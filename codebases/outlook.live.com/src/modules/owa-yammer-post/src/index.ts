import { LazyModule, createLazyComponent, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "YammerPost" */ './lazyIndex'));

// Export component
export const YammerPostTeachingMoment = createLazyComponent(
    lazyModule,
    m => m.YammerPostTeachingMoment
);

// Export lazy actions
export const lazyTryShowYammerPostTeachingMoment = new LazyAction(
    lazyModule,
    m => m.TryShowYammerPostTeachingMoment
);
