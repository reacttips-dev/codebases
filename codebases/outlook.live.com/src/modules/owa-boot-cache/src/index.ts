import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ValidateCache" */ './lazyIndex')
);

export let lazyValidateCache = new LazyAction(lazyModule, m => m.validateCache);
