import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCompose" */ './lazyIndex')
);

export let lazyRemoveMailItemWithData = new LazyAction(lazyModule, m => m.removeMailItemWithData);
export let lazyUndoLatestDelayedMailItem = new LazyAction(
    lazyModule,
    m => m.undoLatestDelayedMailItem
);

export { getStore as getDelayedItemStore } from './store/store';
