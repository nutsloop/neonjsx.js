export * from './lib/runtime.js';
export { css } from './lib/css.js';
export type { CSSOptions } from './lib/css.js';

declare global {
  namespace JSX {
    type Element = any;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
