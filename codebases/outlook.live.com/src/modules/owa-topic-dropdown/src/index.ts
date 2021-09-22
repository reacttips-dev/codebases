import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TopicDropdown" */ './lazyIndex')
);

// Delayed Loaded Components
export const TopicDropdownButton = createLazyComponent(lazyModule, m => m.TopicDropdownButton);
