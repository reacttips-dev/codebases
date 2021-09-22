import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ResizeHandle" */ './lazyIndex')
);

// Delayed Loaded Components
export let ResizeHandle = createLazyComponent(lazyModule, m => m.ResizeHandle);

// Types
export { ResizeHandleDirection } from './components/ResizeHandleDirection';
