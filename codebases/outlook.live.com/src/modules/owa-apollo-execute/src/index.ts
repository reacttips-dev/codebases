import { LazyAction, LazyModule } from 'owa-bundling-light';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaApolloExecute" */ './lazyIndex')
);

export const lazyExecute = new LazyAction(lazyModule, m => m.execute);
export const lazySubscribe = new LazyAction(lazyModule, m => m.subscribe);
export const lazyResetStateForTests = new LazyAction(lazyModule, m => m.resetStateForTests);
