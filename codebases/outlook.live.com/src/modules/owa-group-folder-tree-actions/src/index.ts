import { LazyAction, LazyModule } from 'owa-bundling';

export { default as toggleGroupFolderNodeExpansion } from './actions/toggleGroupFolderNodeExpansion';
export { setLoadingStateForGroupFolderTree } from './actions/setLoadingStateForGroupFolderTree';

const lazyModule = new LazyModule(() => import('./lazyIndex'));

// Delay loaded components
export let lazyLoadGroupFolders = new LazyAction(lazyModule, m => m.loadGroupFolders);
export let lazyToggleGroupListNodeExpansion = new LazyAction(
    lazyModule,
    m => m.toggleGroupListNodeExpansion
);
