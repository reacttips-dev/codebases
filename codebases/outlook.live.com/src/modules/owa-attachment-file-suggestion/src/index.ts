import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "Attachments" */ './lazyIndex')
);

export const lazyIsFileImmersiveViewSupported = new LazyImport(
    lazyModule,
    m => m.isFileImmersiveViewSupported
);

export const lazyIsSharePointLinkPreviewable = new LazyImport(
    lazyModule,
    m => m.isSharePointLinkPreviewable
);
