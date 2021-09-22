import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Lightning" */ './lazyIndex'));
export const endLightning = new LazyAction(lazyModule, m => m.endLightningImp);
