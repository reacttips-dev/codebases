import { LazyAction, LazyModule } from 'owa-bundling';

export const lazyDeleteFolder = new LazyAction(
    new LazyModule(() => import(/* webpackChunkName: "DeleteFolder"*/ './deleteFolder')),
    m => m.deleteFolder
);
