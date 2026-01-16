const loadedCSS = new Set<string>();

export interface CSSOptions {
  inline?: boolean;
}

function hashString( str: string ): string {
  let hash = 0;
  for ( let i = 0; i < str.length; i ++ ) {
    hash = ( ( hash << 5 ) - hash + str.charCodeAt( i ) ) | 0;
  }

  return hash.toString( 36 );
}

export function css( urlOrContent: string, options?: CSSOptions ): void {
  const isInline = options?.inline ?? false;
  const key = isInline ? `inline:${ hashString( urlOrContent ) }` : urlOrContent;

  if ( loadedCSS.has( key ) ) {
    return;
  }
  loadedCSS.add( key );

  if ( typeof document === 'undefined' ) {
    return;
  }

  if ( isInline ) {
    const style = document.createElement( 'style' );
    style.setAttribute( 'data-neon-css', key );
    style.textContent = urlOrContent;
    document.head.appendChild( style );
  }
  else {
    const link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.href = urlOrContent;
    link.setAttribute( 'data-neon-css', key );
    document.head.appendChild( link );
  }
}
