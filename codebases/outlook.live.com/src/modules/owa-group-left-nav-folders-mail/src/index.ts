import { createLazyComponent, LazyModule } from 'owa-bundling';

// Import mutators so they are initialized at the same time as the store
import './mutators/setLoadingStateForGroupFolderTree';

export { getGroupFolderChildFolders } from './utils/getGroupFolderChildFolders';
export { default as setLoadingStateForGroupFolderTree } from './mutators/setLoadingStateForGroupFolderTree';

const lazyModule = new LazyModule(() => import('./lazyIndex'));

// Delay loaded components
export let GroupFolderChildren = createLazyComponent(lazyModule, m => m.GroupFolderChildren);
