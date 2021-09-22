import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaGroupUtils" */ './lazyIndex')
);

// Delay loaded imports
export const lazyGetGroupDisplayName = new LazyImport(lazyModule, m => m.getGroupDisplayName);
export const lazyGetGroupDisplayNameFromTableView = new LazyImport(
    lazyModule,
    m => m.getGroupDisplayNameFromTableView
);
export const lazyIsPrivateUnjoinedGroup = new LazyImport(lazyModule, m => m.isPrivateUnjoinedGroup);
export const lazyIsJoinedGroup = new LazyImport(lazyModule, m => m.isJoinedGroup);
export const lazyGetRetentionPolicyTagsForGroup = new LazyImport(
    lazyModule,
    m => m.getRetentionPolicyTagsForGroup
);
export const lazyGetRetentionPolicyTagListForGroupTableQuery = new LazyImport(
    lazyModule,
    m => m.getRetentionPolicyTagListForGroupTableQuery
);
export const lazyIsGroupOwner = new LazyImport(lazyModule, m => m.isGroupOwner);

export { getSelectedGroupId, getGroupId } from './utils/getGroupId';
export { default as isGroupSelected } from './utils/isGroupSelected';
export { default as isGroupTableQuery, getGroupIdFromTableQuery } from './utils/isGroupTableQuery';
export { default as isGroupTableSelected } from './utils/isGroupTableSelected';
