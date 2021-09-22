import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Tti" */ './lazyIndex'));
export const lazyTti = new LazyAction(lazyModule, m => m.tti);
export const lazyGovern = new LazyAction(lazyModule, m => m.govern);
export const lazyEnableGovernReport = new LazyAction(lazyModule, m => m.enableGovernReport);
