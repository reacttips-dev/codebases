import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailMessageApproval" */ './lazyIndex')
);

// Delay loaded components
export let MessageApprovalHeader = createLazyComponent(lazyModule, m => m.MessageApprovalHeader);
