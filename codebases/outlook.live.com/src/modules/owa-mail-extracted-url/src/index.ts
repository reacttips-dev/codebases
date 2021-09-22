import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "extractedUrls" */ './lazyIndex')
);

export const lazyLogToSigsWithLinkCustomProperties = new LazyImport(
    lazyModule,
    m => m.logToSigsWithLinkCustomProperties
);
