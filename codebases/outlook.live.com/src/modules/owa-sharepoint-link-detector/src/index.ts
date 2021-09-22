import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SharePointLinkDetector"*/ './lazyIndex')
);

export const lazyExtractFileUrlFromOfficeSharePointLink = new LazyImport(
    lazyModule,
    m => m.extractFileUrlFromOfficeSharePointLink
);

export const lazyIsLinkPrefixedWithBaseUrl = new LazyImport(
    lazyModule,
    m => m.isLinkPrefixedWithBaseUrl
);

export const lazyIsSharePointLink = new LazyImport(lazyModule, m => m.isSharePointLink);
export const lazyIsSharePointServiceGeneratedLink = new LazyImport(
    lazyModule,
    m => m.isSharePointServiceGeneratedLink
);
export const lazyIsOfficeSharePointLink = new LazyImport(lazyModule, m => m.isOfficeSharePointLink);
export const lazyGetParsedQueryStringFromUrl = new LazyImport(
    lazyModule,
    m => m.getParsedQueryStringFromUrl
);
