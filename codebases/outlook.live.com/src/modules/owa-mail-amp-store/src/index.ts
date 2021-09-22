import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "AmpStore" */ './lazyIndex'));

export let lazyLoadSenders = new LazyAction(lazyModule, m => m.loadSenders);
