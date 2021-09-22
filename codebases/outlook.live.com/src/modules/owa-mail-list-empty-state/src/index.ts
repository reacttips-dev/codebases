import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailListEmptyState"*/ './lazyIndex')
);

// Delay loaded components
export let MailListEmptyState = createLazyComponent(lazyModule, m => m.MailListEmptyState);
export let MailListShimmerState = createLazyComponent(lazyModule, m => m.MailListShimmerState);
