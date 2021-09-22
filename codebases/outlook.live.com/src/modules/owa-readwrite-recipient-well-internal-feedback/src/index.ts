import { LazyModule, LazyImport, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RWFeedbackFooter" */ './lazyIndex')
);

export let lazyRemovePendingRequestCorrelationId = new LazyAction(
    lazyModule,
    m => m.removePendingRequestCorrelationId
);
export let lazyAddPendingRequestCorrelationId = new LazyAction(
    lazyModule,
    m => m.addPendingRequestCorrelationId
);

export const lazyOpenFeedbackDialog = new LazyImport(lazyModule, m => m.openFeedbackDialog);
