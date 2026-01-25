export * from './lib/runtime.js';
export { inject } from './lib/inject.js';
export type { InjectMode, InjectOptions } from './lib/inject.js';
export { eject } from './lib/eject.js';
export { mount, unmount, cleanup } from './lib/mount.js';
export type { MountHandle } from './lib/mount.js';
export { css } from './lib/css.js';
export type { CSSOptions } from './lib/css.js';
export { lazy, lazyOnDemand } from './lib/lazy.js';
export type { LazyComponent } from './lib/lazy.js';
export {
  lazyOnHover,
  lazyAfterDelay,
  lazyWhenIdle,
  LazyOnVisible
} from './lib/lazy-helpers.js';
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
