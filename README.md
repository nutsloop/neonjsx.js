# NeonJSX

NeonJSX is a tiny JSX runtime with a straightforward render pipeline. It turns
JSX into lightweight virtual nodes, then renders them to real DOM nodes with a
single pass. No diffing, no reconciliation, no hooks, just the essentials.

## Features
- Small, dependency-free runtime
- Classic JSX pragma support (`h` / `Fragment`)
- Simple DOM renderer (`render`)
- CSS loading with browser cache optimization (`css`)
- Dynamic component loading (`lazy` / `Suspense`)
- TypeScript-friendly, ESM-first

## Compile TSX/JSX (your app)
NeonJSX is a runtime only. You bring the compiler, and it should use the classic
JSX transform with `h` and `Fragment`.

## Complete example (esbuild)
A full, minimal app you can copy into a new directory.

Project layout:
```
neonjsx-example/
  package.json
  tsconfig.json
  src/
    index.tsx
  public/
    index.html
    app.css
```

`package.json`:
```json
{
  "name": "neonjsx-example",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "esbuild src/index.tsx --bundle --format=esm --platform=browser --jsx=transform --jsx-factory=h --jsx-fragment=Fragment --outfile=public/app.js"
  },
  "dependencies": {
    "@nutsloop/neonjsx": "^1.0.0"
  },
  "devDependencies": {
    "esbuild": "^0.27.2"
  }
}
```

`tsconfig.json` (editor types only):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "@nutsloop/neonjsx"
    "strict": true
  },
  "include": ["src"]
}
```

`src/index.tsx`:
```ts
import { render, css } from '@nutsloop/neonjsx';

const App = () => {
  css('./app.css');  // URL-based, browser cached
  css('.highlight { color: blue; }', { inline: true });  // Inline CSS
  return (
    <main>
      <h1>NeonJSX</h1>
      <p className="highlight">Runtime-only JSX, compiled by your toolchain.</p>
    </main>
  );
};

render(<App />, document.getElementById('root')!);
```

`public/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NeonJSX Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

`public/app.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  background: #1a1a2e;
  color: #eee;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
```

Run it:
```bash
npm install
npm run build
```

For a complete example with lazy loading, Suspense, trigger-based loading patterns, and animated spinners, see [docs/README.md](docs/README.md).

To download only the example:
```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/nutsloop/neonjsx.js.git
cd neonjsx.js
git sparse-checkout set docs
```

## API

### `h(type, props, ...children)`
Creates a virtual node. This is the JSX factory function.

### `Fragment`
Collects children without adding an extra DOM element.

### `render(node, parent)`
Initial mount only. Clears the parent and appends the rendered DOM tree.
Use this when you bootstrap the app at first page load and you want the
root container to represent the whole application.

Why keep `render()`?
- It is synchronous and simple, which is ideal for the first mount.
- It communicates that this is the primary app root, not a dynamic insert.
- It keeps existing examples and mental models for app startup intact.

For dynamic updates inside existing DOM, use `inject()` or `mount()`.

### `mount(node, parent)`
Async root mount with an explicit lifecycle handle. `mount()` is the
modern, explicit alternative to `render()` when you want control over
cleanup and future lifecycle capabilities.

```ts
const root = await mount( <App />, document.getElementById( 'root' )! );
```

What it does today:
- Performs a `render()` into the container (replace mode).
- Returns a handle with `unmount()` and `cleanup()` methods.
- Tracks that the container is a mounted root.

Why use it:
- Clear intent: "this is a mounted root I may later tear down".
- Safer teardown: you can unmount predictably, even across routes or hot reloads.
- Forward compatible: the handle gives us space to add updates or teardown hooks.

### `unmount(parent)`
Async teardown of a mounted root container.

```ts
await unmount( document.getElementById( 'root' )! );
```

Current behavior:
- Clears the container.
- Removes the container from the internal mounted registry.

### `cleanup(parent)`
Async cleanup alias for `unmount()`. This is the semantic "end of lifecycle"
operation you can call when you want to ensure the container is empty and
the mount is discarded.

```ts
await cleanup( document.getElementById( 'root' )! );
```

Why both `unmount` and `cleanup`?
- `unmount()` is lifecycle terminology that matches other UI runtimes.
- `cleanup()` reads more like a finalization step, especially in async flows.

### `inject(node, parent, options?)`
Async injection for dynamic content inside an existing DOM container.
This is ideal for spinners, toasts, dialogs, or any UI that lives inside
an already-mounted part of the page.

```ts
await inject( <Spinner />, contentEl, { mode: 'append' } );
```

Modes:
- `replace` (default): same DOM behavior as `render()` but without implying
  this is the root app mount.
- `append`: inserts the rendered nodes after the current children.
- `prepend`: inserts the rendered nodes before the current children.

Notes:
- `inject()` is async so the API can evolve (cleanup hooks, async rendering,
  or future diffing) without breaking your call sites.
- Use `eject()` to remove injected content when you are done.

### `eject(parent)`
Async cleanup for injected content. Clears the parent container.

```ts
await eject( contentEl );
```

### How the APIs fit together
Think of the DOM in two layers: root app mounts and local injections.

Root mount (app lifecycle):
- Use `render()` for the simplest initial boot.
- Use `mount()` if you want explicit teardown and a returned handle.
- Use `unmount()` or `cleanup()` to remove the root app.

Local injection (dynamic UI inside the app):
- Use `inject()` to place content inside an existing DOM container.
- Use `eject()` to clear that container.

This split keeps the intent clear:
- `render()`/`mount()` communicate "this is the app root".
- `inject()` communicates "this is a dynamic insertion".

### `css(urlOrContent, options?)`
Loads CSS on first component render with deduplication.

```ts
css('/styles/button.css');                    // URL-based (browser cached)
css('.btn { color: red; }', { inline: true }); // Inline CSS
```

- **URL mode**: Injects `<link rel="stylesheet">` into `<head>`
- **Inline mode**: Injects `<style>` into `<head>` (pass `{ inline: true }`)
- **Deduplication**: Same CSS is only loaded once across all components
- **SSR safe**: No-op when `document` is undefined

### `lazy(loader)`
Wraps a dynamic import for on-demand component loading. The component loads automatically when rendered.

```ts
import { lazy, Suspense, render } from '@nutsloop/neonjsx';

const Dashboard = lazy(() => import('./Dashboard.js'));

const App = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <Dashboard userId={123} />
  </Suspense>
);

render(<App />, document.getElementById('root')!);
```

- **Caching**: Same loader returns the same component instance
- **SSR safe**: No-op when `document` is undefined
- **Preloading**: Call `Dashboard.__load()` to preload before render

### `lazyOnDemand(loader)`
Like `lazy()`, but requires explicit triggering - the component won't load until you call `__load()`.

```ts
import { lazyOnDemand, Suspense } from '@nutsloop/neonjsx';

const Settings = lazyOnDemand(() => import('./Settings.js'));

const App = () => (
  <>
    <button onClick={() => Settings.__load()}>Load Settings</button>
    <Suspense fallback={<p>Loading...</p>}>
      <Settings />
    </Suspense>
  </>
);
```

### Lazy Loading Helpers

**`lazyOnHover(component)`** - Load on mouse enter:
```ts
import { lazyOnDemand, lazyOnHover } from '@nutsloop/neonjsx';

const Dashboard = lazyOnDemand(() => import('./Dashboard.js'));
const hoverProps = lazyOnHover(Dashboard);

<a href="/dashboard" {...hoverProps}>Dashboard</a>
```

**`lazyAfterDelay(component, ms)`** - Load after timeout:
```ts
import { lazyOnDemand, lazyAfterDelay } from '@nutsloop/neonjsx';

const Analytics = lazyOnDemand(() => import('./Analytics.js'));
lazyAfterDelay(Analytics, 3000); // Load after 3 seconds
```

**`lazyWhenIdle(component, timeout?)`** - Load when browser is idle:
```ts
import { lazyOnDemand, lazyWhenIdle } from '@nutsloop/neonjsx';

const ChatWidget = lazyOnDemand(() => import('./ChatWidget.js'));
lazyWhenIdle(ChatWidget); // Load during idle time
```

**`LazyOnVisible`** - Load when scrolled into view:
```ts
import { lazyOnDemand, LazyOnVisible } from '@nutsloop/neonjsx';

const Footer = lazyOnDemand(() => import('./Footer.js'));

<LazyOnVisible
  component={Footer}
  fallback={<div style="height: 200px">Scroll to load footer</div>}
  rootMargin="200px"
/>
```

### `Suspense`
Shows a fallback while lazy components inside are loading.

```ts
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

Multiple lazy components share the same fallback:
```ts
const Chart = lazy(() => import('./Chart.js'));
const Table = lazy(() => import('./Table.js'));

<Suspense fallback={<div class="skeleton" />}>
  <Chart />
  <Table />
</Suspense>
```

### `ErrorBoundary`
Catches errors in children and displays a fallback.

```ts
import { ErrorBoundary } from '@nutsloop/neonjsx';

<ErrorBoundary fallback={(error) => <p>Error: {error.message}</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <Dashboard />
  </Suspense>
</ErrorBoundary>
```

## Notes
- This renderer clears the target container on each `render`.
- Event handlers use `onClick`, `onInput`, etc. (lowercased when assigned).

## License
Apache-2.0
