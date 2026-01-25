import { findLazyPending } from './suspense.js';
import type { LazyComponent } from './lazy.js';

export type VNode = {
  type: string | ( ( props: any ) => VNode | VNode[] | string | null );
  props: Record<string, any>;
  children: Array<VNode | string | null | undefined>;
};

export function h(
  type: VNode['type'],
  props: Record<string, any> | null,
  ...children: Array<VNode | string | null | undefined>
): VNode {
  return { type, props: props || {}, children };
}

export const Fragment = ( props: { children?: any } ) =>
  Array.isArray( props.children ) ? props.children : [ props.children ];

export function render( node: any, parent: HTMLElement ) {
  parent.innerHTML = '';
  parent.appendChild( toDOM( node ) );
}

function toDOM( node: any ): Node {
  if ( node === null || node === undefined ) {
    return document.createTextNode( '' );
  }
  if ( typeof node === 'string' || typeof node === 'number' ) {
    return document.createTextNode( String( node ) );
  }

  if ( Array.isArray( node ) ) {
    const frag = document.createDocumentFragment();
    node.forEach( child => frag.appendChild( toDOM( child ) ) );

    return frag;
  }

  // Debug: log VNode type
  if ( node.type === '__lazy_ondemand_pending__' ) {
    // console.trace( '[DEBUG] toDOM processing __lazy_ondemand_pending__' );
  }

  // Handle Suspense boundary
  if ( node.type === '__suspense__' ) {
    const { fallback, children } = node.props;
    const pending = findLazyPending( children );

    if ( pending.length === 0 ) {
      return toDOM( children );
    }

    const container = document.createElement( 'div' );
    container.setAttribute( 'data-neon-suspense', 'true' );
    container.appendChild( toDOM( fallback ) );

    Promise.all( pending.map( lc => lc.__load() ) ).then( () => {
      const content = toDOM( children );
      container.innerHTML = '';
      container.appendChild( content );
    } );

    return container;
  }

  // Handle lazy pending marker
  if ( node.type === '__lazy_pending__' ) {
    const { wrapper, componentProps } = node.props as {
      wrapper: LazyComponent<any>;
      componentProps: any;
    };

    const placeholder = document.createElement( 'div' );
    placeholder.setAttribute( 'data-neon-lazy', 'pending' );

    wrapper.__load().then( () => {
      if ( wrapper.__status === 'resolved' ) {
        const resolved = toDOM( h( wrapper.__component!, componentProps ) );
        placeholder.replaceWith( resolved );
      }
    } );

    return placeholder;
  }

  // Handle lazy ondemand pending marker
  if ( node.type === '__lazy_ondemand_pending__' ) {
    const { wrapper, componentProps } = node.props as {
      wrapper: LazyComponent<any>;
      componentProps: any;
    };

    const placeholder = document.createElement( 'div' );
    placeholder.setAttribute( 'data-neon-lazy', 'ondemand-pending' );
    placeholder.style.display = 'none';

    // Store reference for manual re-render after load
    ( placeholder as any ).__lazyComponent = wrapper;
    ( placeholder as any ).__componentProps = componentProps;

    // Set up a mechanism to watch for when __load() is called
    // console.trace( '[lazy ondemand] Created placeholder, status:', wrapper.__status, 'has promise:', !!wrapper.__promise );
    let stopPolling = false;
    let pollCount = 0;
    const checkAndRender = () => {
      pollCount++;

      // Stop if placeholder is no longer in the document
      if ( stopPolling ) {
        // console.trace( '[lazy ondemand] Stopped polling, stopPolling:', stopPolling );
        return;
      }

      // Wait for element to be connected before checking
      if ( !placeholder.isConnected ) {
        if ( pollCount % 10 === 0 ) {
          // console.trace( '[lazy ondemand] Waiting for connection...', pollCount );
        }
        setTimeout( checkAndRender, 100 );
        return;
      }

      if ( wrapper.__promise ) {
        // console.trace( '[lazy ondemand] Found promise after', pollCount, 'polls, status:', wrapper.__status );
        stopPolling = true; // Stop polling once we find the promise
        wrapper.__promise.then( () => {
          // console.trace( '[lazy ondemand] Component loaded:', wrapper.__component?.name, 'status:', wrapper.__status, 'connected:', placeholder.isConnected );
          if ( wrapper.__status === 'resolved' && placeholder.isConnected ) {
            const resolved = toDOM( h( wrapper.__component!, componentProps ) );
            // console.trace( '[lazy ondemand] Replacing placeholder with resolved component' );
            placeholder.replaceWith( resolved );
          }
        } );
      }
      else {
        if ( pollCount % 10 === 0 ) {
          // console.trace( '[lazy ondemand] Still polling...', pollCount, 'status:', wrapper.__status );
        }
        // Check again after a short delay
        setTimeout( checkAndRender, 100 );
      }
    };

    // Start checking after a small delay to allow DOM connection
    setTimeout( checkAndRender, 0 );

    return placeholder;
  }

  // Handle lazy onvisible marker
  if ( node.type === '__lazy_onvisible__' ) {
    const { component, componentProps, fallback, observerOptions } = node.props;

    const container = document.createElement( 'div' );
    container.setAttribute( 'data-neon-lazy', 'onvisible' );

    if ( fallback ) {
      container.appendChild( toDOM( fallback ) );
    }

    if ( typeof IntersectionObserver !== 'undefined' ) {
      const observer = new IntersectionObserver( ( entries ) => {
        entries.forEach( ( entry ) => {
          if ( entry.isIntersecting ) {
            component.__load().then( () => {
              if ( component.__status === 'resolved' ) {
                const resolved = toDOM( h( component, componentProps ) );
                container.innerHTML = '';
                container.appendChild( resolved );
              }
            } );
            observer.disconnect();
          }
        } );
      }, observerOptions );

      observer.observe( container );
    }
    else {
      // SSR or old browser fallback
      component.__load();
    }

    return container;
  }

  // Handle lazy error marker
  if ( node.type === '__lazy_error__' ) {
    const errorDiv = document.createElement( 'div' );
    errorDiv.setAttribute( 'data-neon-lazy', 'error' );
    errorDiv.textContent = `Error: ${ node.props.error?.message || 'Unknown' }`;
    return errorDiv;
  }

  // Handle error boundary
  if ( node.type === '__error_boundary__' ) {
    const { fallback, children } = node.props;

    try {
      return toDOM( children );
    }
    catch ( error ) {
      if ( typeof fallback === 'function' ) {
        return toDOM( fallback( error as Error ) );
      }
      return toDOM( fallback );
    }
  }

  if ( typeof node.type === 'function' ) {
    return toDOM( node.type( { ...node.props, children: node.children } ) );
  }

  const el = document.createElement( node.type as string );
  const props = node.props || {};
  Object.entries( props ).forEach( ( [ key, value ] ) => {
    if ( key === 'className' ) {
      if ( typeof value === 'string' ) {
        el.setAttribute( 'class', value );
      }
    }
    else if ( key.startsWith( 'on' ) && typeof value === 'function' ) {
      ( el as any )[ key.toLowerCase() ] = value;
    }
    else if ( value !== false && value !== null ) {
      el.setAttribute( key, String( value ) );
    }
  } );
  if ( node.children ) {
    node.children.forEach( ( child: any ) => {
      el.appendChild( toDOM( child ) );
    } );
  }

  return el;
}

// Expose globals for JSX pragma usage when bundled.
if ( typeof globalThis !== 'undefined' ) {
  ( globalThis as any ).h = h;
  ( globalThis as any ).Fragment = Fragment;
}
