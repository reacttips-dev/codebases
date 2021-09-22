import { LazyModule } from 'owa-bundling';

export const lazyModule = new LazyModule(
    () =>
        import(
            /* webpackChunkName: "AttachmentPreviewSxSInitialize" */ './lazyInitializeAttachmentPreviewInSxS'
        )
);
