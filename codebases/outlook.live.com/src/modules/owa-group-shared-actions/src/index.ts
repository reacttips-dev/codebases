import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupSharedActions" */ './lazyIndex')
);

export const lazyLoadGroupAction = new LazyAction(lazyModule, m => m.loadGroupAction);

export const lazyOnAfterNewGroupSelected = new LazyAction(
    lazyModule,
    m => m.onAfterNewGroupSelectedAction
);

export const lazyOnAfterGroupDetailsSucceeded = new LazyAction(
    lazyModule,
    m => m.onAfterGroupDetailsSucceededAction
);

export const lazySetGroupIsSubscribed = new LazyAction(
    lazyModule,
    m => m.setGroupIsSubscribedAction
);

export const lazySetGroupIsMember = new LazyAction(lazyModule, m => m.setGroupIsMemberAction);
