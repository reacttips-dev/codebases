import { LazyModule, LazyImport } from 'owa-bundling';
import { createLazyApolloComponent } from 'owa-apollo-component';
export { getMoveToMenuProps } from './components/getMoveToMenuProps';
export type { default as MoveToFolderType } from './store/schema/MoveToFolderType';
export type { default as MoveToMenuItem } from './store/schema/MoveToMenuItem';

export { default as onFolderClickedInMoveToControlAction } from './actions/onFolderClickedInMoveToControl';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MoveTo"*/ './lazyIndex'));

export const lazyGetFoldersForMoveTo = new LazyImport(lazyModule, m => m.getFoldersForMoveTo);

// Delayed Loaded Components
// Need to be wrapped with lazy apollo component so that the component is wrapped with the apollo provider
// and apollo client instance is available in the apollo hooks
export const MoveToFolder = createLazyApolloComponent(lazyModule, m => m.MoveToFolder);
