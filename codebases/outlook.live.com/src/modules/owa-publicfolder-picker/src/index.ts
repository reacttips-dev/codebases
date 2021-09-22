import { LazyModule, LazyImport, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PublicFolderPickerModule" */ './lazyIndex')
);

export const lazyLoadPublicFolders = new LazyImport(lazyModule, m => m.loadPublicFolders);
export const LazyPublicFolderPicker = createLazyComponent(lazyModule, m => m.PublicFolderPicker);
export const lazyRemovePublicFolderFromFavorites = new LazyImport(
    lazyModule,
    m => m.removePublicFolderFromFavorites
);
