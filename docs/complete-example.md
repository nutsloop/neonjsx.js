# NeonJSX Lazy Loading Example

A complete example demonstrating dynamic component loading with `lazy`, `Suspense`, and `ErrorBoundary`,
plus the new lifecycle APIs for injection and mounting.

## What This Example Shows

- **Lazy loading**: The Dashboard component is loaded on-demand via dynamic `import()`
- **Suspense fallback**: A spinner displays while the component loads
- **Simulated delay**: The Dashboard module has a 3-second artificial delay to demonstrate loading states
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
    index.tsx              # Main entry point
    components/
      Spinner.tsx          # Loading spinner component
      Dashboard.tsx        # Lazy-loaded component (simulates 3s load)
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

// Wrap dynamic import with lazy()
const Dashboard = lazy(() => import('./components/Dashboard.js'));

const injectTargetId = 'inject-target';
const mountTargetId = 'mount-target';
let mountHandle: MountHandle | null = null;

const MountCard = () => (
  <div className="mount-card">
    <h3>Mounted Panel</h3>
    <p>This content is managed by mount/unmount/cleanup.</p>
  </div>
);

const getTarget = (id: string) =>
  document.getElementById(id) as HTMLElement | null;

const handleInject = async (mode: 'append' | 'prepend' | 'replace') => {
  const target = getTarget(injectTargetId);
  if (!target) return;
  await inject(<Spinner message={`Injected via ${mode}`} />, target, { mode });
};

const handleEject = async () => {
  const target = getTarget(injectTargetId);
  if (!target) return;
  await eject(target);
};

const handleMount = async () => {
  const target = getTarget(mountTargetId);
  if (!target) return;
  mountHandle = await mount(<MountCard />, target);
};

const handleUnmount = async () => {
  const target = getTarget(mountTargetId);
  if (!target) return;
  if (mountHandle) {
    await mountHandle.unmount();
    mountHandle = null;
    return;
  }
  await unmount(target);
};

const handleCleanup = async () => {
  const target = getTarget(mountTargetId);
  if (!target) return;
  if (mountHandle) {
    await mountHandle.cleanup();
    mountHandle = null;
    return;
  }
  await cleanup(target);
};

const App = () => (
  <main>
    <header>
      <h1>NeonJSX Lazy Loading</h1>
    </header>

    <ErrorBoundary fallback={(error) => (
      <div className="error-box">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    )}>
      <Suspense fallback={<Spinner message="Loading Dashboard..." />}>
        <Dashboard userId={42} />
      </Suspense>
    </ErrorBoundary>

    <section className="demo-section">
      <h2>Inject + Eject</h2>
      <p>Insert UI into an existing container without re-mounting the app.</p>
      <div className="demo-actions">
        <button type="button" onClick={() => { void handleInject('replace'); }}>
          Replace
        </button>
        <button type="button" onClick={() => { void handleInject('append'); }}>
          Append
        </button>
        <button type="button" onClick={() => { void handleInject('prepend'); }}>
          Prepend
        </button>
        <button type="button" onClick={() => { void handleEject(); }}>
          Eject
        </button>
      </div>
      <div id="inject-target" className="demo-target"></div>
    </section>

    <section className="demo-section">
      <h2>Mount + Unmount + Cleanup</h2>
      <p>Explicit lifecycle control for a mounted sub-root.</p>
      <div className="demo-actions">
        <button type="button" onClick={() => { void handleMount(); }}>
          Mount
        </button>
        <button type="button" onClick={() => { void handleUnmount(); }}>
          Unmount
        </button>
        <button type="button" onClick={() => { void handleCleanup(); }}>
          Cleanup
        </button>
      </div>
      <div id="mount-target" className="demo-target"></div>
    </section>
  </main>
);

render(<App />, document.getElementById('root')!);
```

What to look for:
- The buttons call async APIs, so you can see how the lifecycle functions work.
- `inject()` is used for dynamic content inside a live app.
- `mount()` creates a sub-root so you can tear it down explicitly.

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

### `lazy(loader)`

Wraps a dynamic import and returns a component that loads on first render:

```tsx
const MyComponent = lazy(() => import('./MyComponent.js'));
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

### Preloading

Start loading before render (e.g., on hover):

```tsx
const Settings = lazy(() => import('./Settings.js'));

// Preload on mouse enter
link.onmouseenter = () => Settings.__load();
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
