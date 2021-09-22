import { LazyImport, LazyModule } from 'owa-bundling';

export { default as AttachmentDataProviderType } from 'owa-service/lib/contract/AttachmentDataProviderType';
export type { default as FileProviderViewState } from './store/schema/FileProviderViewState';
export { default as FileSelectionFilter } from './store/schema/FileSelectionFilter';
export { default as getProviderBrandName } from './utils/getProviderBrandName';
export { default as getStore } from './store/store';
export {
    fileProviderAdded,
    fileProviderRemoved,
    providersLoaded,
} from './actions/subscribableActions';
export { ClientOnlyFileProviderType } from './utils/constants';
export type { FileProviderType, FileProviderViewType } from './utils/constants';
export { getFileProvider, getFileProviders } from './selectors/getFileProviders';
export { getProviderLoadState } from './selectors/getProviderLoadState';
export { ProviderLoadStateOption } from './store/schema/ProviderLoadStateOption';
export { getAddableFileProviderInfo } from 'owa-add-fileprovider/lib/utils/AddableFileProviderInfo';
export type { default as AddableFileProviderInfo } from 'owa-add-fileprovider/lib/utils/AddableFileProviderInfo';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FileProviderStore"*/ './lazyIndex')
);

// Delayed loaded imports
export const lazyLoadProviders = new LazyImport(lazyModule, m => m.loadProviders);
export const lazyRemoveFileProvider = new LazyImport(lazyModule, m => m.removeFileProvider);
export const lazyAddFileProvider = new LazyImport(lazyModule, m => m.addFileProvider);
export const lazyRemoveAndAddFileProvider = new LazyImport(
    lazyModule,
    m => m.removeAndAddFileProvider
);
