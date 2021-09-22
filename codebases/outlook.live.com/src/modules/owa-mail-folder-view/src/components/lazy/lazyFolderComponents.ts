import { createLazyComponent, LazyModule } from 'owa-bundling';
import { createLazyApolloComponent } from 'owa-apollo-component';

export const LoadMoreFolderNode = createLazyComponent(
    new LazyModule(() => import(/* webpackChunkName: "LoadMore"*/ '../LoadMoreFolderNode')),
    m => m.default
);

export const MoveToFolderDialog = createLazyApolloComponent(
    new LazyModule(() => import(/* webpackChunkName: "MoveFolderDialog"*/ './MoveToFolderDialog')),
    m => m.MoveToFolderDialog
);
