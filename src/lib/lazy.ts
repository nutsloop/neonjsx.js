import { h } from './runtime.js';
import type { VNode } from './runtime.js';

type ComponentType<P = any> = ( props: P ) => VNode | VNode[] | string | null;
type LazyLoader<P = any> = () => Promise<{ default: ComponentType<P> }>;

export interface LazyComponent<P = any> {
  ( props: P ): VNode;
  __lazy: true;
  __status: 'pending' | 'resolved' | 'rejected';
  __component: ComponentType<P> | null;
  __error: Error | null;
  __promise: Promise<void> | null;
  __load: () => Promise<void>;
  __autoLoad: boolean;
}

const autoLoadCache = new Map<LazyLoader<any>, LazyComponent<any>>();
const onDemandCache = new Map<LazyLoader<any>, LazyComponent<any>>();

function createLazyComponent<P>( loader: LazyLoader<P>, autoLoad: boolean ): LazyComponent<P> {
  const cache = autoLoad ? autoLoadCache : onDemandCache;

  if ( cache.has( loader ) ) {
    return cache.get( loader )!;
  }

  const LazyWrapper: LazyComponent<P> = ( ( props: P & { children?: any } ) => {
    // console.trace( '[LazyWrapper] Called, autoLoad:', autoLoad, 'status:', LazyWrapper.__status );

    if ( LazyWrapper.__status === 'resolved' && LazyWrapper.__component ) {
      // console.trace( '[LazyWrapper] Returning resolved component' );
      return h( LazyWrapper.__component, props );
    }

    if ( LazyWrapper.__status === 'rejected' ) {
      // console.trace( '[LazyWrapper] Returning error' );
      return {
        type: '__lazy_error__',
        props: { error: LazyWrapper.__error },
        children: []
      } as VNode;
    }

    if ( !LazyWrapper.__promise && LazyWrapper.__autoLoad ) {
      // console.trace( '[LazyWrapper] Auto-loading' );
      LazyWrapper.__load();
    }

    const vnode = {
      type: LazyWrapper.__autoLoad ? '__lazy_pending__' : '__lazy_ondemand_pending__',
      props: { wrapper: LazyWrapper, componentProps: props },
      children: []
    } as VNode;

    // console.trace( '[LazyWrapper] Returning VNode with type:', vnode.type );
    return vnode;
  } ) as LazyComponent<P>;

  LazyWrapper.__lazy = true;
  LazyWrapper.__status = 'pending';
  LazyWrapper.__component = null;
  LazyWrapper.__error = null;
  LazyWrapper.__promise = null;
  LazyWrapper.__autoLoad = autoLoad;

  LazyWrapper.__load = () => {
    // console.trace( '[LazyWrapper.__load] Called, autoLoad:', autoLoad, 'has promise:', !!LazyWrapper.__promise );

    if ( LazyWrapper.__promise ) {
      // console.trace( '[LazyWrapper.__load] Promise already exists, returning it' );
      return LazyWrapper.__promise;
    }

    // SSR safety
    if ( typeof document === 'undefined' ) {
      return Promise.resolve();
    }

    // console.trace( '[LazyWrapper.__load] Starting loader()' );
    LazyWrapper.__promise = loader()
      .then( mod => {
        // console.trace( '[LazyWrapper.__load] Loader resolved, setting component' );
        LazyWrapper.__component = mod.default;
        LazyWrapper.__status = 'resolved';
      } )
      .catch( err => {
        // console.trace( '[LazyWrapper.__load] Loader failed:', err );
        LazyWrapper.__error = err;
        LazyWrapper.__status = 'rejected';
      } );

    return LazyWrapper.__promise;
  };

  cache.set( loader, LazyWrapper );
  return LazyWrapper;
}

export function lazy<P = any>( loader: LazyLoader<P> ): LazyComponent<P> {
  return createLazyComponent( loader, true );
}

export function lazyOnDemand<P = any>( loader: LazyLoader<P> ): LazyComponent<P> {
  return createLazyComponent( loader, false );
}
