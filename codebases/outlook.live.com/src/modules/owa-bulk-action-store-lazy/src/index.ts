import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () =>
        import(/* webpackChunkName: "LazyBulkActionStore" */ 'owa-bulk-action-store/lib/lazyIndex')
);

export const lazySubscribeToBulkActionNotification = new LazyAction(
    lazyModule,
    m => m.subscribeToBulkActionNotification
);

export const lazyfindBulkActionItemAction = new LazyAction(
    lazyModule,
    m => m.findBulkActionItemAction
);
