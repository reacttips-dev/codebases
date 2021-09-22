import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ForgottenAttachments" */ './lazyIndex')
);

export const LazyForgottenAttachmentsToggle = createLazyComponent(
    lazyModule,
    m => m.ForgottenAttachmentsDialogToggle
);

export { default as checkForForgottenAttachments } from './utils/checkForForgottenAttachments';
