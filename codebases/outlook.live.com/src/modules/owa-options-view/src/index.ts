import { createLazyApolloComponent } from 'owa-apollo-component';
import { LazyAction, LazyImport, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import mountFullOptions from 'owa-options-link/lib/actions/mountFullOptions';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Options"*/ './lazyIndex'));

// Export delay loaded actions
export let lazyMountAndShowFullOptions = new LazyAction(lazyModule, m => m.mountAndShowFullOptions);
export let lazyHideFullOptions = new LazyImport(lazyModule, m => m.hideFullOptions);
export let lazyConfirmDirtyOptionsAndPerformAction = new LazyImport(
    lazyModule,
    m => m.confirmDirtyOptionsAndPerformAction
);

export let lazyExitOptionsFullPage = new LazyImport(lazyModule, m => m.exitOptionsFullPage);

// Export delay loaded components
export var QuickOptions = createLazyApolloComponent(lazyModule, m => m.QuickOptions);

// Export synchronous utils
export { default as getOptionRouteState } from './utils/getOptionRouteState';

// Register lazy orchestrator
registerLazyOrchestrator(mountFullOptions, lazyModule, m => m.mountFullOptionsOrchestrator);
