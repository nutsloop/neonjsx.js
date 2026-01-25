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
