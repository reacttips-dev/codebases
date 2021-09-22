import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupCreateV2" */ './lazyIndex')
);

// Exported actions
export const lazyCreateGroupV2 = new LazyImport(lazyModule, m => m.createGroup);
