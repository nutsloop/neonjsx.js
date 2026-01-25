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

css( './app.css' );

// Lazy load the heavy Dashboard component
const Dashboard = lazy( () => import( './components/Dashboard.js' ) );

const injectTargetId = 'inject-target';
const mountTargetId = 'mount-target';
let mountHandle: MountHandle | null = null;

const MountCard = () => (
  <div className="mount-card">
    <h3>Mounted Panel</h3>
    <p>This content is managed by mount/unmount/cleanup.</p>
  </div>
);

const getTarget = ( id: string ) =>
  document.getElementById( id ) as HTMLElement | null;

const handleInject = async ( mode: 'append' | 'prepend' | 'replace' ) => {
  const target = getTarget( injectTargetId );
  if ( !target ) {
    return;
  }

  await inject( <Spinner message={ `Injected via ${ mode }` } />, target, { mode } );
};

const handleEject = async () => {
  const target = getTarget( injectTargetId );
  if ( !target ) {
    return;
  }

  await eject( target );
};

const handleMount = async () => {
  const target = getTarget( mountTargetId );
  if ( !target ) {
    return;
  }

  mountHandle = await mount( <MountCard />, target );
};

const handleUnmount = async () => {
  const target = getTarget( mountTargetId );
  if ( !target ) {
    return;
  }

  if ( mountHandle ) {
    await mountHandle.unmount();
    mountHandle = null;
    return;
  }

  await unmount( target );
};

const handleCleanup = async () => {
  const target = getTarget( mountTargetId );
  if ( !target ) {
    return;
  }

  if ( mountHandle ) {
    await mountHandle.cleanup();
    mountHandle = null;
    return;
  }

  await cleanup( target );
};

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

    <section className="demo-section">
      <h2>Inject + Eject</h2>
      <p>Insert UI into an existing container without re-mounting the app.</p>
      <div className="demo-actions">
        <button type="button" onClick={ () => { void handleInject( 'replace' ); } }>
          Replace
        </button>
        <button type="button" onClick={ () => { void handleInject( 'append' ); } }>
          Append
        </button>
        <button type="button" onClick={ () => { void handleInject( 'prepend' ); } }>
          Prepend
        </button>
        <button type="button" onClick={ () => { void handleEject(); } }>
          Eject
        </button>
      </div>
      <div id="inject-target" className="demo-target"></div>
    </section>

    <section className="demo-section">
      <h2>Mount + Unmount + Cleanup</h2>
      <p>Explicit lifecycle control for a mounted sub-root.</p>
      <div className="demo-actions">
        <button type="button" onClick={ () => { void handleMount(); } }>
          Mount
        </button>
        <button type="button" onClick={ () => { void handleUnmount(); } }>
          Unmount
        </button>
        <button type="button" onClick={ () => { void handleCleanup(); } }>
          Cleanup
        </button>
      </div>
      <div id="mount-target" className="demo-target"></div>
    </section>
  </main>
);

render( <App />, document.getElementById( 'root' )! );
