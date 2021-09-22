import { LazyBootModule } from 'owa-bundling-light';

export const lazyPwaUtils = new LazyBootModule(
    () => import(/* webpackChunkName: "PwaUtils" */ './lazyIndex')
);
