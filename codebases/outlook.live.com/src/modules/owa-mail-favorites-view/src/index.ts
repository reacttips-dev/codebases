import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FavoriteContextMenu" */ './lazyIndex')
);

// Delay loaded components
export let FavoriteNodeContextMenu = createLazyComponent(
    lazyModule,
    m => m.FavoriteNodeContextMenu
);

export { default as Favorites } from './components/Favorites';
