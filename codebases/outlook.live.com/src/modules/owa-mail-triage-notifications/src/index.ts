import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TriageNotifications" */ './lazyIndex')
);

export const lazySubscribeToRowNotifications = new LazyAction(
    lazyModule,
    m => m.subscribeToRowNotifications
);
export const lazyUnsubscribeToRowNotifications = new LazyAction(
    lazyModule,
    m => m.unsubscribeToRowNotifications
);
