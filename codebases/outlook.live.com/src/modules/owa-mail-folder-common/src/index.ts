import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FolderCommon" */ './lazyIndex')
);

export let lazyPreparePopoutDataForReadingPane = new LazyImport(
    lazyModule,
    m => m.preparePopoutDataForReadingPane
);
