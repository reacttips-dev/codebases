import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "OwaHeader"*/ './lazyIndex'));

export const lazySignout = new LazyAction(lazyModule, m => m.signout);
