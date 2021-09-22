import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "QuickSwitcher" */ './lazyIndex')
);

export const MailQuickSwitcher = createLazyComponent(lazyModule, m => m.MailQuickSwitcher);
