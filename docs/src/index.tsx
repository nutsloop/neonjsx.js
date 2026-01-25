import { render, lazy, Suspense, ErrorBoundary, css } from '@nutsloop/neonjsx';
import { Spinner } from './components/Spinner.js';

css( './app.css' );

// Lazy load the heavy Dashboard component
const Dashboard = lazy( () => import( './components/Dashboard.js' ) );

const App = () => (
  <main>
    <header>
      <h1>NeonJSX Lazy Loading</h1>
      <p>Dynamic component loading with Suspense</p>
    </header>

    <ErrorBoundary fallback={ ( error ) => (
      <div className="error-box">
        <h2>Something went wrong</h2>
        <p>{ error.message }</p>
      </div>
    ) }>
      <Suspense fallback={ <Spinner message="Loading Dashboard..." /> }>
        <Dashboard userId={ 42 } />
      </Suspense>
    </ErrorBoundary>
  </main>
);

render( <App />, document.getElementById( 'root' )! );
