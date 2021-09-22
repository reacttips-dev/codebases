import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupFavoriteButton" */ './lazyIndex')
);

// Delay loaded components
export let GroupFavoriteButton = createLazyComponent(lazyModule, m => m.GroupFavoriteButton);
export let lazyToggleFavoriteGroup = new LazyImport(lazyModule, m => m.toggleFavoriteGroup);
