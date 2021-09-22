import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "PauseInbox" */ './lazyIndex'));

export let lazyGetPauseInboxContextMenuItem = new LazyImport(
    lazyModule,
    m => m.getPauseInboxContextMenuItem
);
