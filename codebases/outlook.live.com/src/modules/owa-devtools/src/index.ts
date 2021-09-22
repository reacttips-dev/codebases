import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "DevTools" */ './lazyIndex'));

export const lazySetupDevTools = new LazyAction(lazyModule, m => m.setupDevTools);
