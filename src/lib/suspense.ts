import type { VNode } from './runtime.js';
import type { LazyComponent } from './lazy.js';

export interface SuspenseProps {
  fallback: VNode | string;
  children?: any;
}

export function Suspense( props: SuspenseProps ): VNode {
  return {
    type: '__suspense__',
    props: {
      fallback: props.fallback,
      children: props.children
    },
    children: Array.isArray( props.children ) ? props.children : [ props.children ]
  };
}

export function findLazyPending(
  node: VNode | VNode[] | string | null | undefined
): LazyComponent<any>[] {
  if ( !node || typeof node === 'string' || typeof node === 'number' ) {
    return [];
  }

  if ( Array.isArray( node ) ) {
    return node.flatMap( n => findLazyPending( n ) );
  }

  const vnode = node as VNode;

  // Check if type is a lazy component function (has __lazy marker)
  if ( typeof vnode.type === 'function' && ( vnode.type as LazyComponent<any> ).__lazy ) {
    const lazyComp = vnode.type as LazyComponent<any>;
    // Only return if still pending
    if ( lazyComp.__status === 'pending' ) {
      return [ lazyComp ];
    }
  }

  // Also check for already-rendered lazy pending marker
  if ( vnode.type === '__lazy_pending__' ) {
    return [ vnode.props.wrapper as LazyComponent<any> ];
  }

  // Recurse into children
  if ( vnode.children ) {
    return vnode.children.flatMap( c => findLazyPending( c ) );
  }

  return [];
}
