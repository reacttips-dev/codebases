import { LazyAction, LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "MailRoutes"*/ './lazyIndex')
);

export let lazyInitializeMailRoutes = new LazyAction(lazyModule, m => m.initializeMailRoutes);
export let lazyGetCurrentRoute = new LazyImport(lazyModule, m => m.getCurrentRoute);
