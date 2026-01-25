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
}

const componentCache = new Map<LazyLoader<any>, LazyComponent<any>>();

export function lazy<P = any>( loader: LazyLoader<P> ): LazyComponent<P> {
  if ( componentCache.has( loader ) ) {
    return componentCache.get( loader )!;
  }

  const LazyWrapper: LazyComponent<P> = ( ( props: P & { children?: any } ) => {
    if ( LazyWrapper.__status === 'resolved' && LazyWrapper.__component ) {
      return h( LazyWrapper.__component, props );
    }

    if ( LazyWrapper.__status === 'rejected' ) {
      return {
        type: '__lazy_error__',
        props: { error: LazyWrapper.__error },
        children: []
      } as VNode;
    }

    if ( !LazyWrapper.__promise ) {
      LazyWrapper.__load();
    }

    return {
      type: '__lazy_pending__',
      props: { wrapper: LazyWrapper, componentProps: props },
      children: []
    } as VNode;
  } ) as LazyComponent<P>;

  LazyWrapper.__lazy = true;
  LazyWrapper.__status = 'pending';
  LazyWrapper.__component = null;
  LazyWrapper.__error = null;
  LazyWrapper.__promise = null;

  LazyWrapper.__load = () => {
    if ( LazyWrapper.__promise ) {
      return LazyWrapper.__promise;
    }

    // SSR safety
    if ( typeof document === 'undefined' ) {
      return Promise.resolve();
    }

    LazyWrapper.__promise = loader()
      .then( mod => {
        LazyWrapper.__component = mod.default;
        LazyWrapper.__status = 'resolved';
      } )
      .catch( err => {
        LazyWrapper.__error = err;
        LazyWrapper.__status = 'rejected';
      } );

    return LazyWrapper.__promise;
  };

  componentCache.set( loader, LazyWrapper );
  return LazyWrapper;
}
