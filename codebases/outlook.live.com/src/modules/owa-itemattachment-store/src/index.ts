import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ItemAttachment" */ './lazyIndex')
);

// Delayed Loaded Actions
export const lazyLoadItemAttachment = new LazyAction(lazyModule, m => m.loadItemAttachment);
export const lazyLoadItemAttachmentFromServer = new LazyImport(
    lazyModule,
    m => m.loadItemAttachmentFromServer
);
