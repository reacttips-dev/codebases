import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "InboxForMeSurface" */ './lazyIndex')
);

export let InboxForMe = createLazyComponent(lazyModule, m => m.InboxForMe);
