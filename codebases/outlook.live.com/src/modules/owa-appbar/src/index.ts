import { LazyImport, LazyBootModule } from 'owa-bundling-light';

export const lazyAppBar = new LazyImport(
    new LazyBootModule(() => import(/* webpackChunkName: "AppBar" */ './components/AppBar')),
    m => m.default
);

export const lazyLegacyAppBar = new LazyImport(
    new LazyBootModule(() => import(/* webpackChunkName: "LegacyAppBar" */ 'owa-left-rail')),
    m => m.LeftRail
);

export type { AppBarProps } from './components/AppBar';
