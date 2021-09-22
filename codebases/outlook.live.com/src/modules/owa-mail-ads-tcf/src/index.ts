import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "initializeAdTcf" */ './lazyIndex')
);

export let lazyAdTcfInitialization = new LazyAction(lazyModule, m => m.initializeAdTcf);
