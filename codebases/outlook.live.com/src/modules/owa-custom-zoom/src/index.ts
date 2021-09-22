import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "owa-custom-zoom" */ './lazyIndex')
);

// Delayed Loaded Components
export const ZoomButtons = createLazyComponent(lazyModule, m => m.ZoomButtons);
export const lazyGetZoomStyle = new LazyAction(lazyModule, m => m.getZoomStyle);
export const lazyOverrideCustomZoomToDefault = new LazyAction(
    lazyModule,
    m => m.overrideCustomZoomToDefault
);
export const lazyOverrideCustomZoomToDefaultRollUp = new LazyAction(
    lazyModule,
    m => m.overrideCustomZoomToDefaultRollUp
);
export const lazyOverrideCustomZoomToDefaultInfoBar = new LazyAction(
    lazyModule,
    m => m.overrideCustomZoomToDefaultInfoBar
);
