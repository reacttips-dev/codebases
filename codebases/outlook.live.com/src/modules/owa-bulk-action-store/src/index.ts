import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

export type { BulkActionInformation } from './store/schema/BulkActionStateStore';
export { default as isBulkActionInState } from './utils/isBulkActionInState';
export { default as isBulkActionValid } from './utils/isBulkActionValid';
export { default as isBulkActionRunning } from './utils/isBulkActionRunning';
export type { default as BulkActionCustomDataBase } from './store/schema/BulkActionCustomDataBase';
export type { default as BulkActionScenarioType } from './types/BulkActionScenarioType';
export { default as BulkActionStateEnum } from './store/schema/BulkActionStateEnum';

export { default as store } from './store/store';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "BulkActions" */ './lazyIndex')
);

export const BulkActionSpinner = createLazyComponent(lazyModule, m => m.BulkActionSpinner);

export let lazySubscribeToBulkActionNotification = new LazyAction(
    lazyModule,
    m => m.subscribeToBulkActionNotification
);
export let lazyOnBulkActionSubmitted = new LazyAction(lazyModule, m => m.onBulkActionSubmitted);
export let lazyfindBulkActionItemAction = new LazyAction(
    lazyModule,
    m => m.findBulkActionItemAction
);
export let lazyOnBulkActionCancel = new LazyAction(lazyModule, m => m.onBulkActionCancel);
export let lazyOnBulkActionHierarchyNotification = new LazyAction(
    lazyModule,
    m => m.onBulkActionHierarchyNotification
);
export let lazyOnBulkActionDismiss = new LazyAction(lazyModule, m => m.onBulkActionDismiss);
