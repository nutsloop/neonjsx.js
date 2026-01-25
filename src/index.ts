export * from './lib/runtime.js';
export { css } from './lib/css.js';
export type { CSSOptions } from './lib/css.js';
export { lazy } from './lib/lazy.js';
export type { LazyComponent } from './lib/lazy.js';
export { Suspense } from './lib/suspense.js';
export type { SuspenseProps } from './lib/suspense.js';
export { ErrorBoundary } from './lib/error-boundary.js';
export type { ErrorBoundaryProps } from './lib/error-boundary.js';

declare global {
  namespace JSX {
    type Element = any;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
