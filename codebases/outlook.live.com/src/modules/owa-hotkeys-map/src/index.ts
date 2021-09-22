import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "HotkeysMap" */ './lazyIndex'));

// Export component
export let HotkeysMap = createLazyComponent(lazyModule, m => m.HotkeysMap);

// Export actions
export let lazySetIsHotkeysMapVisible = new LazyAction(lazyModule, m => m.setIsHotkeysMapVisible);

// Export types
export type { CommandCategory } from './components/CommandCategory';
