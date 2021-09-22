import { LazyModule, LazyAction } from 'owa-bundling';

export const lazyCreateNewFolder = new LazyAction(
    new LazyModule(() => import(/* webpackChunkName: "createNewFolder" */ './createNewFolder')),
    m => m.createNewFolder
);
