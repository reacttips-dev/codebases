import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupSettings" */ './lazyIndex')
);

export const lazyOpenGroupSettings = new LazyImport(lazyModule, m => m.openGroupSettings);
