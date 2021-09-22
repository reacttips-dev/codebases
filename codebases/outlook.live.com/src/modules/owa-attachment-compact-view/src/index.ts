import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentsCompact"*/ './lazyIndex')
);

// Delayed Loaded Components
export let AttachmentCompactView = createLazyComponent(lazyModule, m => m.AttachmentCompactView);
