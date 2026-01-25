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

css( './app.css' );

// Auto-loading: loads immediately when rendered
const Dashboard = lazy( () => import( './components/Dashboard.js' ) );

// Manual loading: requires explicit __load() call
const Settings = lazyOnDemand( () => import( './components/Settings.js' ) );

// Hover preloading: loads on mouse enter
const Reports = lazyOnDemand( () => import( './components/Reports.js' ) );
const reportsHoverProps = lazyOnHover( Reports );

// Delayed loading: loads after 5 seconds
const Analytics = lazyOnDemand( () => import( './components/Analytics.js' ) );
lazyAfterDelay( Analytics, 5000 );

// Idle loading: loads when browser is idle
const ChatWidget = lazyOnDemand( () => import( './components/ChatWidget.js' ) );
lazyWhenIdle( ChatWidget );

// Scroll-based loading: Footer component uses LazyOnVisible
const Footer = lazyOnDemand( () => import( './components/Footer.js' ) );

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
      <p>Trigger-based component loading patterns</p>
    </header>

    {/* Auto-loading with Suspense */}
    <section className="demo-section">
      <h2>Auto-Loading (lazy)</h2>
      <p>Dashboard loads automatically when rendered</p>
      <ErrorBoundary fallback={ ( error ) => (
        <div className="error-box">
          <h2>Failed to load</h2>
          <p>{ error.message }</p>
        </div>
      ) }>
        <Suspense fallback={ <Spinner message="Loading Dashboard..." /> }>
          <Dashboard userId={ 42 } />
        </Suspense>
      </ErrorBoundary>
    </section>

    {/* Manual trigger */}
    <section className="demo-section">
      <h2>Manual Loading (lazyOnDemand)</h2>
      <p>Click button to trigger loading</p>
      <div className="demo-actions">
        <button type="button" onClick={ () => Settings.__load() }>
          Load Settings
        </button>
      </div>
      <Settings />
    </section>

    {/* Hover preload */}
    <section className="demo-section">
      <h2>Hover Preload (lazyOnHover)</h2>
      <p>Hover over link to start loading</p>
      <div className="demo-actions">
        <a href="#reports" { ...reportsHoverProps } style="display: inline-block; padding: 0.6rem 1.1rem; border-radius: 999px; background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%); color: #07121e; font-weight: 700; text-decoration: none;">
          View Reports
        </a>
      </div>
      <Reports />
    </section>

    {/* Delayed loading */}
    <section className="demo-section">
      <h2>Delayed Loading (lazyAfterDelay)</h2>
      <p>Analytics loads after 5 seconds</p>
      <Analytics />
    </section>

    {/* Idle loading */}
    <section className="demo-section">
      <h2>Idle Loading (lazyWhenIdle)</h2>
      <p>ChatWidget loads during browser idle time</p>
      <ChatWidget />
    </section>

    {/* Scroll-based loading */}
    <section className="demo-section">
      <h2>Scroll-Based Loading (LazyOnVisible)</h2>
      <p>Footer loads when scrolled into view</p>
      <LazyOnVisible
        component={ Footer }
        fallback={ <div style="height: 200px; border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #8aa0b8;">Scroll down to load footer</div> }
        rootMargin="200px"
      />
    </section>

    {/* Lifecycle APIs */}
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
