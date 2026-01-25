import type { VNode } from './runtime.js';

export interface ErrorBoundaryProps {
  fallback: VNode | string | ( ( error: Error ) => VNode | string );
  children?: any;
}

export function ErrorBoundary( props: ErrorBoundaryProps ): VNode {
  return {
    type: '__error_boundary__',
    props: {
      fallback: props.fallback,
      children: props.children
    },
    children: Array.isArray( props.children ) ? props.children : [ props.children ]
  };
}
