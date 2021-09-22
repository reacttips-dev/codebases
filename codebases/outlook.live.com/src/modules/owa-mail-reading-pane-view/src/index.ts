import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ReadingPane"*/ './lazyIndex'));

// Export delay loaded components
export let ConversationReadingPane = createLazyComponent(
    lazyModule,
    m => m.ConversationReadingPane
);

export let ReadingPane = createLazyComponent(lazyModule, m => m.ReadingPane);
export let ItemReadingPane = createLazyComponent(lazyModule, m => m.ItemReadingPane);

export let SecondaryReadingPaneTabCommandingBar = createLazyComponent(
    lazyModule,
    m => m.SecondaryReadingPaneTabCommandingBar
);
