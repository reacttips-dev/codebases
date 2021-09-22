import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Signature"*/ './lazyIndex'));

export let lazyLoadSignature = new LazyAction(lazyModule, m => m.loadSignature);
