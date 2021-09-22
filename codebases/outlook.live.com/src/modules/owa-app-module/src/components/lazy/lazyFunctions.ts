import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));
export const lazySetupAppModuleKeys = new LazyAction(lazyModule, m => m.setupAppModuleKeys);
