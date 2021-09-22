import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LinkPreview" */ './lazyIndex')
);

export const lazyCreateLinkPreview = new LazyImport(lazyModule, m => m.createLinkPreview);
export const lazyRehydrateLinkPreview = new LazyImport(lazyModule, m => m.rehydrateLinkPreview);
