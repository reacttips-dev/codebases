import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailListItemContextMenu"*/ './lazyIndex')
);

// Delay loaded components
export const MailListItemContextMenu = createLazyComponent(
    lazyModule,
    m => m.MailListItemContextMenu
);
