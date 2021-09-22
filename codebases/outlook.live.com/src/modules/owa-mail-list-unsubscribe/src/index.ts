import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailListUnsubscribe"*/ './lazyIndex')
);

export const MailListItemUnsubscribe = createLazyComponent(
    lazyModule,
    m => m.MailListItemUnsubscribe
);
