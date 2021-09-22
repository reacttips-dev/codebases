import { LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';

export { default as getCustomIcon } from './util/getCustomIcon';
export { default as LazyFolderTextField } from './components/LazyFolderTextField';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FolderCacheUpdates" */ './lazyIndex')
);

registerLazyOrchestrator(updateFolderCounts, lazyModule, m => m.onUpdateFolderCountsOrchestrator);
