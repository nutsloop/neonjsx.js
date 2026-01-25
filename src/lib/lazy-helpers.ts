import type { LazyComponent } from './lazy.js';
import type { VNode } from './runtime.js';

/**
 * Returns event props that trigger lazy loading on hover
 *
 * @example
 * const Dashboard = lazyOnDemand(() => import('./Dashboard.js'));
 * const hoverProps = lazyOnHover(Dashboard);
 * <a href="/dashboard" {...hoverProps}>Dashboard</a>
 */
export function lazyOnHover<P = any>(
  component: LazyComponent<P>
): { onMouseEnter: () => void } {
  return {
    onMouseEnter: () => {
      // console.trace( '[lazyOnHover] Mouse enter, status:', component.__status );
      if ( component.__status === 'pending' ) {
        component.__load();
      }
    }
  };
}

/**
 * Triggers lazy loading after a delay
 *
 * @param component - The lazy component to load
 * @param delayMs - Delay in milliseconds before loading
 * @returns Cleanup function to cancel the timeout
 *
 * @example
 * const Analytics = lazyOnDemand(() => import('./Analytics.js'));
 * lazyAfterDelay(Analytics, 5000); // Load after 5 seconds
 */
export function lazyAfterDelay<P = any>(
  component: LazyComponent<P>,
  delayMs: number
): () => void {
  // console.trace( '[lazyAfterDelay] Setting up delay:', delayMs, 'ms, status:', component.__status );

  if ( component.__status !== 'pending' ) {
    return () => {};
  }

  const timeoutId = window.setTimeout( () => {
    // console.trace( '[lazyAfterDelay] Delay elapsed, calling __load()' );
    component.__load();
  }, delayMs );

  return () => clearTimeout( timeoutId );
}

/**
 * Triggers lazy loading when the browser is idle
 *
 * @param component - The lazy component to load
 * @param timeout - Maximum time to wait before loading (default: 5000ms)
 * @returns Cleanup function to cancel the idle callback
 *
 * @example
 * const ChatWidget = lazyOnDemand(() => import('./ChatWidget.js'));
 * lazyWhenIdle(ChatWidget); // Load when browser idle
 */
export function lazyWhenIdle<P = any>(
  component: LazyComponent<P>,
  timeout: number = 5000
): () => void {
  // console.trace( '[lazyWhenIdle] Setting up idle callback, timeout:', timeout, 'ms, status:', component.__status );

  if ( typeof requestIdleCallback === 'undefined' ) {
    // console.trace( '[lazyWhenIdle] requestIdleCallback not available, using delay fallback' );
    return lazyAfterDelay( component, timeout );
  }

  if ( component.__status !== 'pending' ) {
    return () => {};
  }

  const requestId = requestIdleCallback(
    () => {
      // console.trace( '[lazyWhenIdle] Idle callback triggered, calling __load()' );
      component.__load();
    },
    { timeout }
  );

  return () => cancelIdleCallback( requestId );
}

/**
 * Component wrapper that triggers lazy loading when scrolled into view
 *
 * @param props.component - The lazy component to load
 * @param props.componentProps - Props to pass to the component when loaded
 * @param props.fallback - Content to show before component is visible
 * @param props.rootMargin - Margin around root for intersection detection (e.g., "200px")
 * @param props.threshold - Visibility threshold (0-1) that triggers loading
 *
 * @example
 * const Footer = lazyOnDemand(() => import('./Footer.js'));
 * <LazyOnVisible
 *   component={Footer}
 *   fallback={<div style="height: 200px">Scroll to load footer</div>}
 *   rootMargin="200px"
 * />
 */
export function LazyOnVisible<P = any>( props: {
  component: LazyComponent<P>;
  componentProps?: P;
  fallback?: VNode | string;
  rootMargin?: string;
  threshold?: number;
} ): VNode {
  return {
    type: '__lazy_onvisible__',
    props: {
      component: props.component,
      componentProps: props.componentProps || {},
      fallback: props.fallback || null,
      observerOptions: {
        rootMargin: props.rootMargin,
        threshold: props.threshold
      }
    },
    children: []
  } as VNode;
}
