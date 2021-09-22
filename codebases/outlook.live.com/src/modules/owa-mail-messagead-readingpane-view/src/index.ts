import { createLazyComponent, LazyModule } from 'owa-bundling';

const messageAdReadingPaneLazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MessageAdReadingPane" */ './lazyIndex')
);

// Export delay loaded components
export let MessageAdReadingPane = createLazyComponent(
    messageAdReadingPaneLazyModule,
    m => m.MessageAdReadingPane
);
