import { LazyAction, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import { selectPreviousNode } from 'owa-mail-actions/lib/selectPreviousNode';
import { validateDumpsterQuota } from 'owa-storage-store/lib/actions/validateDumpsterQuota';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FolderForestActions"*/ './lazyIndex')
);

export const lazyLoadDumpster = new LazyAction(lazyModule, m => m.loadDumpster);
export const lazyToggleFavoriteFolder = new LazyAction(lazyModule, m => m.toggleFavoriteFolder);
export const lazySelectFolderNode = new LazyAction(lazyModule, m => m.selectFolderNode);
export const lazySelectFavoriteSearch = new LazyAction(lazyModule, m => m.selectFavoriteSearch);
export const lazySelectGroup = new LazyAction(lazyModule, m => m.selectGroup);
export const lazySelectFavoriteCategory = new LazyAction(lazyModule, m => m.selectFavoriteCategory);
export const lazySelectPersona = new LazyAction(lazyModule, m => m.selectPersona);
export const lazySelectPrivateDistributionList = new LazyAction(
    lazyModule,
    m => m.selectPrivateDistributionList
);
export const lazyPrefetchFrequentlyUsedFolders = new LazyAction(
    lazyModule,
    m => m.prefetchFrequentlyUsedFolders
);

export const lazyLogConsumerDeletedRetentionPolicy = new LazyAction(
    lazyModule,
    m => m.logConsumerDeletedRetentionPolicy
);

export const lazyLoadPopoutDataToFolderStore = new LazyAction(
    lazyModule,
    m => m.loadPopoutDataToFolderStore
);
export const lazyLoadPopoutDataToPublicFolderFavoriteStore = new LazyAction(
    lazyModule,
    m => m.loadPopoutDataToPublicFolderFavoriteStore
);

registerLazyOrchestrator(selectPreviousNode, lazyModule, m => m.selectPreviousNodeOrchestrator);
registerLazyOrchestrator(
    validateDumpsterQuota,
    lazyModule,
    m => m.validateDumpsterQuotaOrchestrator
);
