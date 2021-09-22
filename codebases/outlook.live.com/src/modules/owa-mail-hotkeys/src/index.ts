import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailHotKeys" */ './lazyIndex')
);

export let lazySetupUndoHotKeys = new LazyAction(lazyModule, m => m.setupUndoHotKeys);
export let MailHotkeysMap = createLazyComponent(lazyModule, m => m.MailHotkeysMap);
