import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "InlineImageLoader" */ './lazyIndex')
);

export let lazyClearInlineImageStore = new LazyAction(lazyModule, m => m.clearInlineImageStore);

export let lazyTryCreateDataURIFromImage = new LazyImport(
    lazyModule,
    m => m.tryCreateDataURIFromImage
);

export let lazyCacheInlineImage = new LazyImport(lazyModule, m => m.cacheInlineImage);
export let lazyLogImageUpload = new LazyImport(lazyModule, m => m.logImageUpload);
export let lazyLogImageLoadError = new LazyImport(lazyModule, m => m.logImageLoadError);

export let lazyLoadFromAttachmentServiceUrl = new LazyImport(
    lazyModule,
    m => m.loadFromAttachmentServiceUrl
);

export let lazyLoadFromAttachment = new LazyImport(lazyModule, m => m.loadFromAttachment);
export let lazyLoadFromProxy = new LazyImport(lazyModule, m => m.loadFromProxy);
export let lazyLoadFromImageTag = new LazyImport(lazyModule, m => m.loadFromImageTag);

export { default as isImageProxyEnabled } from './utils/isImageProxyEnabled';
export { default as isInlineImageStoreEmpty } from './utils/isInlineImageStoreEmpty';
