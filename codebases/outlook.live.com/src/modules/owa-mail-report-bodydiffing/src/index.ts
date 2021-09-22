import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReportBodyDiffing" */ './lazyIndex')
);

// Delayed Loaded Components
export let ReportBodyDiffing = createLazyComponent(lazyModule, m => m.ReportBodyDiffing);
