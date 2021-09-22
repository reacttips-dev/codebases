import { createLazyComponent, LazyModule } from 'owa-bundling';

import './orchestrators/showQuickOptions';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "HeaderPane"*/ './lazyIndex'));

// Delay loaded components
export const DiagnosticsPane = createLazyComponent(lazyModule, m => m.DiagnosticsPane);
export const MiniMavenPane = createLazyComponent(lazyModule, m => m.MiniMavenPane);
export const RolloutOverridesPane = createLazyComponent(lazyModule, m => m.RolloutOverridesPane);
