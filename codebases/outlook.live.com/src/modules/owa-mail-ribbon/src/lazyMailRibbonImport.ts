import { LazyBootModule, LazyImport } from 'owa-bundling-light';

export const LazyMailRibbonImport = new LazyImport(
    new LazyBootModule(() => import(/* webpackChunkName: "MailRibbonImport" */ './lazyIndex')),
    m => m.MailRibbon
);
