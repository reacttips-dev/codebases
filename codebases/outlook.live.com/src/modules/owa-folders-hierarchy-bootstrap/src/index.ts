import { LazyAction, LazyBootModule } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "OwaHierarchyBootstrap" */ './lazyIndex')
);

export const lazyBootstrapFolderHierarchyCache = new LazyAction(
    lazyModule,
    m => m.bootstrapFolderHierarchyCache
);
