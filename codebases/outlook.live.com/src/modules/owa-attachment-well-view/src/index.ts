import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "Attachments" */ './lazyIndex')
);

// Delayed Loaded Components
export const AttachmentWellView = createLazyComponent(lazyModule, m => m.AttachmentWellView);

export const AttachmentWellPrintView = createLazyComponent(
    lazyModule,
    m => m.AttachmentWellPrintView
);
