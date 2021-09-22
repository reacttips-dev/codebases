import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';

// Create lazily loadable FolderPermissions chunk.
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FolderPermissions" */ './lazyIndex')
);

/**
 * Action which others can use to open folder permissions dialog.
 * It gets lazily loaded with the 'FolderPermissions' chunk.
 */
export const lazyOpenFolderPermissions = new LazyImport(
    lazyModule,
    m => m.openFolderPermissionsDialog
);

/**
 * This component show Folder Permissions Dialog in UI.
 * It gets lazily loaded with the 'FolderPermissions' chunk.
 */
export const LazyFolderPermissionsDialog = createLazyComponent(
    lazyModule,
    m => m.FolderPermissionsDialog
);
