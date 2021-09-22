import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReadingPaneInfoBar"*/ './lazyIndex')
);

export let ItemHeaderInfoBar = createLazyComponent(lazyModule, m => m.ItemHeaderInfoBar);
export let Charms = createLazyComponent(lazyModule, m => m.Charms);

export { default as CharmSize } from './utils/CharmSize';
