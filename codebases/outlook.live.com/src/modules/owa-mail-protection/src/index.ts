import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Protection"*/ './lazyIndex'));

export const lazyLoadCLPUserLabels = new LazyAction(lazyModule, m => m.loadCLPUserLabels);
export const lazyAddAuditActionToViewState = new LazyAction(
    lazyModule,
    m => m.addAuditActionToViewState
);
export const lazyShowJustificationModal = new LazyImport(lazyModule, m => m.showJustificationModal);
export const lazyLoadItemCLPInfo = new LazyAction(lazyModule, m => m.loadItemCLPInfo);
export const lazyUpdateItemCLPInfo = new LazyImport(lazyModule, m => m.updateItemCLPInfo);
export const lazyLogReadCLPLabel = new LazyImport(lazyModule, m => m.logReadCLPLabel);
export const lazyTriggerCLPAutoLabeling = new LazyImport(lazyModule, m => m.triggerCLPAutoLabeling);
export const lazyConstructCLPAuditAction = new LazyImport(
    lazyModule,
    m => m.constructCLPAuditAction
);
export const CLPSubjectHeaderLabel = createLazyComponent(lazyModule, m => m.CLPSubjectHeaderLabel);
export const CLPMandatoryLabelModal = createLazyComponent(
    lazyModule,
    m => m.CLPMandatoryLabelModal
);
