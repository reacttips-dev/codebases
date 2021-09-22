import { popoutReadingPane } from 'owa-popout';
import { LazyModule, registerLazyOrchestrator, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PopoutReadingPane"*/ './lazyIndex')
);

// Register lazy orchestrators
registerLazyOrchestrator(popoutReadingPane, lazyModule, m => m.popoutReadingPaneOrchestrator);

// Lazy components
export let ProjectionReadingPane = createLazyComponent(lazyModule, m => m.ProjectionReadingPane);
