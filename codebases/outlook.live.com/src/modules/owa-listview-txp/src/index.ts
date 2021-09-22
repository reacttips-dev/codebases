import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TxpInListView" */ './lazyIndex')
);
export const lazyTryGetTxpAdditionalData = new LazyAction(
    lazyModule,
    m => m.tryGetTxpAdditionalData
);

export const lazyRemoveTxpFromStoreAction = new LazyAction(
    lazyModule,
    m => m.removeTxpFromStoreAction
);

export const lazyAddTxpToFetchList = new LazyAction(lazyModule, m => m.addToTxpItemIdMap);
export const TxpListViewButton = createLazyComponent(lazyModule, m => m.TxpListViewButton);
