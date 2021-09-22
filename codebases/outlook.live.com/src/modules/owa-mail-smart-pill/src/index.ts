import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailSmartPill" */ './lazyIndex')
);

export const MailSmartPillBlock = createLazyComponent(lazyModule, m => m.MailSmartPillBlock);
