import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaMailPlaywright" */ './lazyIndex')
);

export const lazyEvaluatePlaywrightMailActions = new LazyAction(
    lazyModule,
    m => m.evaluatePlaywrightMailActions
);
