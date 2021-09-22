import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';
import type * as imports from './lazyIndex';

const lazyModule = new LazyModule<typeof imports>(
    () => import(/* webpackChunkName: "GroupFilesHubActions" */ './lazyIndex')
);

export const lazyOnFilesNavigationAction = new LazyAction(lazyModule, m => m.onFilesNavigation);

export const lazyOnGetGroupDetailsSucceededInOwaGroupFiles = new LazyAction(
    lazyModule,
    m => m.onGetGroupDetailsSucceeded
);

export const lazySetSharePointItemsViewNavigationTargetPath = new LazyImport(
    lazyModule,
    m => m.setSharePointItemsViewNavigationTargetPath
);
export const lazyGetSharePointItemsViewCurrentPath = new LazyImport(
    lazyModule,
    m => m.getSharePointItemsViewCurrentPath
);

export const lazyLoadAttachmentInformation = new LazyImport(
    lazyModule,
    m => m.loadAttachmentInformation
);

export const lazyClickAttachmentFile = new LazyImport(lazyModule, m => m.clickAttachmentFile);
