import { render } from './runtime.js';

export type InjectMode = 'append' | 'prepend' | 'replace';

export type InjectOptions = {
  mode?: InjectMode;
};

function renderToFragment( node: any ): DocumentFragment {
  const temp = document.createElement( 'div' );
  render( node, temp );
  const fragment = document.createDocumentFragment();

  while ( temp.firstChild ) {
    fragment.appendChild( temp.firstChild );
  }

  return fragment;
}

export async function inject(
  node: any,
  parent: HTMLElement,
  options?: InjectOptions
): Promise<void> {
  const mode = options?.mode ?? 'replace';

  if ( mode === 'replace' ) {
    render( node, parent );
    return;
  }

  const fragment = renderToFragment( node );

  if ( mode === 'append' ) {
    parent.appendChild( fragment );
    return;
  }

  if ( mode === 'prepend' ) {
    parent.insertBefore( fragment, parent.firstChild );
    return;
  }

  render( node, parent );
}
