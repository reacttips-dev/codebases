import { createLazyComponent, LazyModule, LazyModuleType } from 'owa-bundling';
import type { ISkipLinkControl } from './types/ISkipLinkControl';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SkipLinkControl"*/ './lazyIndex')
);

export function preloadSkipLinkControl() {
    lazyModule.import();
}

// Lazy-load components
export const SkipLinkControl = createLazyComponent<
    {},
    LazyModuleType<typeof lazyModule>,
    ISkipLinkControl
>(lazyModule, m => m.SkipLinkControl);
