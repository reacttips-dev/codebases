import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OneNoteFeedBootstrap" */ './lazyIndex')
);

export * from './actions/publicActions';
export type { OneNoteFeedPanelSource } from './OneNoteFeedPanelSource';
export { wereSamsungNotesEverSynchronized } from './utils/wereSamsungNotesEverSynchronized';

export let lazyInitializeOneNoteFeed = new LazyAction(lazyModule, m => m.initializeOneNoteFeed);
