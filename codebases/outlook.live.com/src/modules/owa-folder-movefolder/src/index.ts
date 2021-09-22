import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MoveFolder" */ './lazyIndex'));

export const lazyMoveFolder = new LazyAction(lazyModule, m => m.moveFolder);
