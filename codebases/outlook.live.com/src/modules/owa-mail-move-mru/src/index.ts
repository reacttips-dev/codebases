import { LazyAction, LazyModule } from 'owa-bundling';
export { default as getMoveToMruList } from './actions/getMoveToMruList';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MoveMruActions"*/ './lazyIndex')
);

export let lazyAddFolderIdToMoveToMruList = new LazyAction(
    lazyModule,
    m => m.addFolderIdToMoveToMruList
);

export let lazyRemoveFolderIdFromMoveToMruList = new LazyAction(
    lazyModule,
    m => m.removeFolderIdFromMoveToMruList
);
