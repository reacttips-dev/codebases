import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCompose" */ './lazyIndex')
);

// Delay loaded components
export const FullCompose = createLazyComponent(lazyModule, m => m.FullCompose);
export const Compose = createLazyComponent(lazyModule, m => m.Compose);
export const Dock = createLazyComponent(lazyModule, m => m.Dock);
export const ComposeCommandingBar = createLazyComponent(lazyModule, m => m.ComposeCommandingBar);
export const ComposeTab = createLazyComponent(lazyModule, m => m.ComposeTab);
