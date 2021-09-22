import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ImmersiveReaderContainer" */ './lazyIndex')
);

// Lazy-load components
export let ImmersiveReaderContainer = createLazyComponent(
    lazyModule,
    m => m.ImmersiveReaderContainer
);
