import { LazyImport, LazyModule } from 'owa-bundling';

// Create lazily loadable RetentionPolicies chunk.
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RetentionPolicies" */ './lazyIndex')
);

export const lazyOnArchiveTagForFolderChanged = new LazyImport(
    lazyModule,
    m => m.onArchiveTagForFolderChanged
);

export const lazyOnDeleteTagForFolderChanged = new LazyImport(
    lazyModule,
    m => m.onDeleteTagForFolderChanged
);

export const lazyGetRetentionPolicyMenuItem = new LazyImport(
    lazyModule,
    m => m.getRetentionPolicyMenuItem
);

export const lazyGetAssignPolicyPropertiesForMailContextMenu = new LazyImport(
    lazyModule,
    m => m.getAssignPolicyPropertiesForMailContextMenu
);
