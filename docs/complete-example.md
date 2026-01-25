# NeonJSX Lazy Loading Example

A complete example demonstrating dynamic component loading with `lazy`, `Suspense`, and `ErrorBoundary`.

## What This Example Shows

- **Lazy loading**: The Dashboard component is loaded on-demand via dynamic `import()`
- **Suspense fallback**: A spinner displays while the component loads
- **Simulated delay**: The Dashboard module has a 3-second artificial delay to demonstrate loading states
- **Error handling**: ErrorBoundary catches any loading failures
- **CSS loading**: Both URL-based and inline CSS with deduplication

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
    index.html
    app.css                # Base styles
    spinner.css            # Spinner animation
```

## Quick Start

```bash
cd docs
npm install
npm run build
npm run serve
```

Open http://localhost:3000 in your browser.

## How It Works

### 1. Entry Point (`src/index.tsx`)

```tsx
import { render, lazy, Suspense, ErrorBoundary, css } from '@nutsloop/neonjsx';
import { Spinner } from './components/Spinner.js';

css('./app.css');

// Wrap dynamic import with lazy()
const Dashboard = lazy(() => import('./components/Dashboard.js'));

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
  </main>
);

render(<App />, document.getElementById('root')!);
```

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
  --outfile=public/app.js
```

The dynamic `import()` in `lazy()` creates a separate chunk that loads on demand.
