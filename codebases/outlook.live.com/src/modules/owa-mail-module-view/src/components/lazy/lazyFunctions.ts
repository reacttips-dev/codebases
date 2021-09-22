import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));
export const lazySetupMailModuleKeys = new LazyAction(lazyModule, m => m.setupMailModuleKeys);
export const GroupView = createLazyComponent(lazyModule, m => m.GroupView);
export const GroupCommandBarView = createLazyComponent(lazyModule, m => m.GroupCommandBarView);
