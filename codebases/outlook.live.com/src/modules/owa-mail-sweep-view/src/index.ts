import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Sweep" */ './lazyIndex'));

export let lazyShowSweepDialog = new LazyAction(lazyModule, m => m.showSweepDialog);
