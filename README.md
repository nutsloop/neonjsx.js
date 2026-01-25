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

For a complete example with lazy loading, Suspense, and animated spinners, see [docs/complete-example.md](docs/complete-example.md).

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
Clears the parent and appends the rendered DOM tree.

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
Wraps a dynamic import for on-demand component loading.

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
