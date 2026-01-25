# NeonJSX Lazy Loading Example

A complete example demonstrating dynamic component loading with `lazy`, `lazyOnDemand`, trigger-based loading patterns,
`Suspense`, `ErrorBoundary`, and lifecycle APIs.

## What This Example Shows

- **Auto-loading**: The Dashboard component loads automatically via `lazy()`
- **Manual loading**: Settings component uses `lazyOnDemand()` with button trigger
- **Hover preloading**: Reports component loads on hover with `lazyOnHover()`
- **Scroll-based loading**: Footer loads when scrolled into view with `LazyOnVisible`
- **Delayed loading**: Analytics loads after 5 seconds with `lazyAfterDelay()`
- **Idle loading**: ChatWidget loads during idle time with `lazyWhenIdle()`
- **Suspense fallback**: A spinner displays while components load
- **Simulated delay**: Components have artificial delays to demonstrate loading states
- **Error handling**: ErrorBoundary catches any loading failures
- **CSS loading**: Both URL-based and inline CSS with deduplication
- **Injection**: Buttons show how to `inject()` and `eject()` UI into an existing container
- **Mount lifecycle**: Buttons show how to `mount()`, `unmount()`, and `cleanup()` a sub-root

## Project Structure

```
docs/
  package.json
  tsconfig.json
  src/
    index.tsx              # Main entry point with all lazy loading patterns
    components/
      Spinner.tsx          # Loading spinner component
      Dashboard.tsx        # Auto-loading component (lazy)
      Settings.tsx         # Manual loading component (lazyOnDemand)
      Reports.tsx          # Hover-triggered component (lazyOnHover)
      Footer.tsx           # Scroll-triggered component (LazyOnVisible)
      Analytics.tsx        # Delayed loading component (lazyAfterDelay)
      ChatWidget.tsx       # Idle loading component (lazyWhenIdle)
  public/
    _default/
      index.html
      app.css              # Base styles + demo controls
      spinner.css          # Spinner animation
```

## Quick Start

```bash
cd docs
npm install
npm run build
npm run serve
```

Open http://localhost:3000 in your browser.

Note: `docs/package.json` uses an absolute `file:` dependency so you can run
this locally against your checkout. If your path is different, update it.

## How It Works

### 1. Entry Point (`src/index.tsx`)

```tsx
import {
  render,
  lazy,
  lazyOnDemand,
  lazyOnHover,
  lazyAfterDelay,
  lazyWhenIdle,
  LazyOnVisible,
  Suspense,
  ErrorBoundary,
  css,
  inject,
  eject,
  mount,
  unmount,
  cleanup,
} from '@nutsloop/neonjsx';
import type { MountHandle } from '@nutsloop/neonjsx';
import { Spinner } from './components/Spinner.js';

css('./app.css');

// Auto-loading: loads immediately when rendered
const Dashboard = lazy(() => import('./components/Dashboard.js'));

// Manual loading: requires explicit __load() call
const Settings = lazyOnDemand(() => import('./components/Settings.js'));

// Hover preloading: loads on mouse enter
const Reports = lazyOnDemand(() => import('./components/Reports.js'));
const reportsHoverProps = lazyOnHover(Reports);

// Delayed loading: loads after 5 seconds
const Analytics = lazyOnDemand(() => import('./components/Analytics.js'));
lazyAfterDelay(Analytics, 5000);

// Idle loading: loads when browser is idle
const ChatWidget = lazyOnDemand(() => import('./components/ChatWidget.js'));
lazyWhenIdle(ChatWidget);

// Scroll-based loading: Footer component uses LazyOnVisible
const Footer = lazyOnDemand(() => import('./components/Footer.js'));

const App = () => (
  <main>
    <header>
      <h1>NeonJSX Lazy Loading</h1>
      <p>Trigger-based component loading patterns</p>
    </header>

    {/* Auto-loading with Suspense */}
    <section className="demo-section">
      <h2>Auto-Loading (lazy)</h2>
      <p>Dashboard loads automatically when rendered</p>
      <ErrorBoundary fallback={(error) => (
        <div className="error-box">
          <h2>Failed to load</h2>
          <p>{error.message}</p>
        </div>
      )}>
        <Suspense fallback={<Spinner message="Loading Dashboard..." />}>
          <Dashboard userId={42} />
        </Suspense>
      </ErrorBoundary>
    </section>

    {/* Manual trigger */}
    <section className="demo-section">
      <h2>Manual Loading (lazyOnDemand)</h2>
      <p>Click button to trigger loading</p>
      <button onClick={() => Settings.__load()}>Load Settings</button>
      <Suspense fallback={<Spinner message="Loading Settings..." />}>
        <Settings />
      </Suspense>
    </section>

    {/* Hover preload */}
    <section className="demo-section">
      <h2>Hover Preload (lazyOnHover)</h2>
      <p>Hover over link to start loading</p>
      <a href="#reports" {...reportsHoverProps}>View Reports</a>
      <Suspense fallback={<Spinner message="Loading Reports..." />}>
        <Reports />
      </Suspense>
    </section>

    {/* Delayed loading */}
    <section className="demo-section">
      <h2>Delayed Loading (lazyAfterDelay)</h2>
      <p>Analytics loads after 5 seconds</p>
      <Suspense fallback={<Spinner message="Loading Analytics..." />}>
        <Analytics />
      </Suspense>
    </section>

    {/* Idle loading */}
    <section className="demo-section">
      <h2>Idle Loading (lazyWhenIdle)</h2>
      <p>ChatWidget loads during browser idle time</p>
      <Suspense fallback={<Spinner message="Loading Chat..." />}>
        <ChatWidget />
      </Suspense>
    </section>

    {/* Scroll-based loading */}
    <section className="demo-section">
      <h2>Scroll-Based Loading (LazyOnVisible)</h2>
      <p>Footer loads when scrolled into view</p>
      <LazyOnVisible
        component={Footer}
        fallback={<div style="height: 200px; border: 1px dashed #666; display: flex; align-items: center; justify-content: center;">Scroll down to load footer</div>}
        rootMargin="200px"
      />
    </section>

    {/* Lifecycle APIs */}
    <section className="demo-section">
      <h2>Inject + Eject</h2>
      <p>Dynamic content insertion</p>
      <div className="demo-actions">
        <button onClick={async () => {
          const target = document.getElementById('inject-target');
          if (target) await inject(<Spinner message="Injected" />, target);
        }}>Inject</button>
        <button onClick={async () => {
          const target = document.getElementById('inject-target');
          if (target) await eject(target);
        }}>Eject</button>
      </div>
      <div id="inject-target" className="demo-target"></div>
    </section>
  </main>
);

render(<App />, document.getElementById('root')!);
```

What to look for:
- `lazy()` auto-loads when rendered inside Suspense
- `lazyOnDemand()` requires manual trigger via `__load()` call
- `lazyOnHover()` returns event props for hover preloading
- `lazyAfterDelay()` and `lazyWhenIdle()` trigger loading automatically
- `LazyOnVisible` uses IntersectionObserver for scroll-based loading
- All patterns work with Suspense boundaries

### 2. Lazy-Loaded Component (`src/components/Dashboard.tsx`)

The key is the top-level `await` that simulates a heavy module:

```tsx
import { css } from '@nutsloop/neonjsx';

// Simulate heavy module load (3 second delay)
await new Promise(resolve => setTimeout(resolve, 3000));

const Dashboard = (props: { userId: number }) => {
  css(`...`, { inline: true });  // Inline styles

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <span>User #{props.userId}</span>
      {/* ... stats grid ... */}
    </div>
  );
};

export default Dashboard;
```

### 3. Spinner Component (`src/components/Spinner.tsx`)

A reusable loading indicator:

```tsx
import { css } from '@nutsloop/neonjsx';

export const Spinner = (props: { message?: string }) => {
  css('./spinner.css');

  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {props.message && <p className="spinner-message">{props.message}</p>}
    </div>
  );
};
```

### 4. Base Styles (`public/_default/app.css`)

This includes the layout plus styling for the demo buttons and targets:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #0a0f1a;
  color: #e8ecf1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

main {
  width: 100%;
  max-width: 800px;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

header p {
  color: #6b7c93;
  font-size: 1.1rem;
}

.demo-section {
  margin-top: 2.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.demo-section h2 {
  font-size: 1.35rem;
  margin-bottom: 0.35rem;
  color: #e8ecf1;
}

.demo-section p {
  color: #8aa0b8;
  margin-bottom: 1rem;
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.demo-actions button {
  border: none;
  background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
  color: #07121e;
  font-weight: 700;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.demo-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.25);
}

.demo-actions button:active {
  transform: translateY(0);
  box-shadow: none;
}

.demo-target {
  min-height: 120px;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(10, 15, 26, 0.6);
}

.mount-card {
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.35);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}

.mount-card h3 {
  margin-bottom: 0.35rem;
  color: #00d4ff;
}

.mount-card p {
  color: #c6d3e1;
}

.error-box {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.error-box h2 {
  color: #ff3b30;
  margin-bottom: 0.5rem;
}

.error-box p {
  color: #ff6b6b;
}
```

## Key Concepts

### `lazy(loader)` - Auto-Loading

Wraps a dynamic import and auto-loads on first render:

```tsx
const Dashboard = lazy(() => import('./Dashboard.js'));

// Loads automatically when rendered
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### `lazyOnDemand(loader)` - Manual Trigger

Requires explicit `__load()` call to start loading:

```tsx
const Settings = lazyOnDemand(() => import('./Settings.js'));

// Must call __load() manually
<button onClick={() => Settings.__load()}>Load Settings</button>
<Suspense fallback={<Loading />}>
  <Settings />
</Suspense>
```

### `lazyOnHover(component)` - Hover Preload

Returns props that trigger loading on mouse enter:

```tsx
const Reports = lazyOnDemand(() => import('./Reports.js'));
const hoverProps = lazyOnHover(Reports);

<a {...hoverProps}>Reports</a>
```

### `lazyAfterDelay(component, ms)` - Delayed Load

Triggers loading after a timeout:

```tsx
const Analytics = lazyOnDemand(() => import('./Analytics.js'));
lazyAfterDelay(Analytics, 5000); // Loads after 5 seconds
```

### `lazyWhenIdle(component, timeout?)` - Idle Load

Triggers loading when browser is idle:

```tsx
const ChatWidget = lazyOnDemand(() => import('./ChatWidget.js'));
lazyWhenIdle(ChatWidget); // Loads during idle time
```

### `LazyOnVisible` - Scroll-Based Load

Loads when component scrolls into view:

```tsx
const Footer = lazyOnDemand(() => import('./Footer.js'));

<LazyOnVisible
  component={Footer}
  fallback={<div>Scroll to load</div>}
  rootMargin="200px"
/>
```

### `Suspense`

Shows a fallback while any lazy children are loading:

```tsx
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### `ErrorBoundary`

Catches errors in children (including failed imports):

```tsx
<ErrorBoundary fallback={(error) => <Error message={error.message} />}>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

## Lifecycle APIs in This Example

### `inject(node, parent, options?)`
Use `inject()` when you want to drop UI into an existing container without
re-mounting the app. The `mode` option controls where the DOM goes.

```tsx
await inject(<Spinner />, container, { mode: 'append' });
```

### `eject(parent)`
Use `eject()` to clear a container you used for injection.

```tsx
await eject(container);
```

### `mount(node, parent)`
Use `mount()` when you want a dedicated sub-root with explicit lifecycle
controls. It returns a handle that you can store and use later.

```tsx
const handle = await mount(<Widget />, container);
await handle.unmount();
```

### `unmount(parent)`
Direct unmount for a parent container. This is also what the handle uses
internally if you do not keep the handle around.

```tsx
await unmount(container);
```

### `cleanup(parent)`
Semantic alias for `unmount()`, useful in async flows or teardown steps.

```tsx
await cleanup(container);
```

## Build Configuration

**esbuild** handles the JSX transform and bundling:

```bash
esbuild src/index.tsx \
  --bundle \
  --format=esm \
  --platform=browser \
  --jsx=transform \
  --jsx-factory=h \
  --jsx-fragment=Fragment \
  --outdir=public/_default \
  --splitting \
  --entry-names=[name]
```

The dynamic `import()` in `lazy()` creates a separate chunk that loads on demand.
