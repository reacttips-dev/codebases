import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "DateTimePicker"*/ './lazyIndex')
);

// Delayed Loaded Components
export let DateTimePicker = createLazyComponent(lazyModule, m => m.DateTimePicker);
