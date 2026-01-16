import type { VNode } from './lib/runtime.js';

import { h, Fragment } from './lib/runtime.js';

export { Fragment };
export type { VNode };

type JSXProps = Record<string, unknown> & { children?: unknown };

function toChildArray( children: unknown ): Array<VNode | string | null | undefined> {
  if ( children === undefined || children === null ) {
    return [];
  }
  if ( Array.isArray( children ) ) {
    return children;
  }

  return [ children as VNode | string ];
}

export function jsx(
  type: VNode['type'],
  props: JSXProps | null,
  key?: unknown
): VNode {
  const { children, ...rest } = props ?? {};
  if ( key !== undefined ) {
    ( rest as Record<string, unknown> ).key = key;
  }

  return h( type, rest as Record<string, any>, ...toChildArray( children ) );
}

export const jsxs = jsx;
export const jsxDEV = jsx;
