import { render } from './runtime.js';

export type MountHandle = {
  unmount: () => Promise<void>;
  cleanup: () => Promise<void>;
};

const mountedParents = new WeakSet<HTMLElement>();

export async function mount( node: any, parent: HTMLElement ): Promise<MountHandle> {
  render( node, parent );
  mountedParents.add( parent );

  return {
    unmount: async () => unmount( parent ),
    cleanup: async () => cleanup( parent ),
  };
}

export async function unmount( parent: HTMLElement ): Promise<void> {
  parent.innerHTML = '';
  mountedParents.delete( parent );
}

export async function cleanup( parent: HTMLElement ): Promise<void> {
  await unmount( parent );
}
