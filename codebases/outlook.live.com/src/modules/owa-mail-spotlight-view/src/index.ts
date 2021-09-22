import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Spotlight"*/ './lazyIndex'));

// Components
export const SpotlightIconTeachingMoment = createLazyComponent(
    lazyModule,
    m => m.SpotlightIconTeachingMoment
);
