import { createLazyResolver, createLazySubscriptionResolver } from 'owa-lazy-resolver';

// TODO: Naming and directory structure - to be finalized.
export const lazyFolderHierarchyWeb = createLazyResolver(
    'QUERY_PRIMARY_FOLDER_HIERARCHY_WEB',
    () => import(/* webpackChunkName: "FolderHierarchyWeb"*/ './queries/folderHierarchyWeb'),
    m => m.folderHierarchyWeb
);

export const lazyUpdateFolderPermissionsWeb = createLazyResolver(
    'MUTATION_UPDATE_FOLDER_PERMISSIONS_WEB',
    () =>
        import(
            /* webpackChunkName: "UpdateFolderPermissionsWeb"*/ './queries/updateFolderPermissionsWeb'
        ),
    m => m.updateFolderPermissionsWeb
);

export const lazySubscribeToHierarchyNotificationsWeb = createLazySubscriptionResolver(
    () =>
        import(
            /* webpackChunkName: "HierarchyNotificationsWeb"*/ './queries/subscribeToHierarchyNotificationsWeb'
        ),
    m => m.subscribeToHierarchyNotificationsWeb
);

export const lazyFolderWeb = createLazyResolver(
    'QUERY_FOLDER_WEB',
    () => import(/* webpackChunkName: "FolderWeb"*/ './queries/folderWeb'),
    m => m.folderWeb
);

export const lazyFoldersWeb = createLazyResolver(
    'QUERY_FOLDER_WEB',
    () => import(/* webpackChunkName: "FoldersWeb"*/ './queries/foldersWeb'),
    m => m.foldersWeb
);
