import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "GroupList" */ './lazyIndex'));

// Delay loaded actions
export let lazyLoadGroups = new LazyAction(lazyModule, m => m.loadGroups);

export let lazyLoadGroupsFromSessionData = new LazyAction(
    lazyModule,
    m => m.loadGroupsFromSessionData
);

export let lazyRemoveGroupFromLeftNav = new LazyAction(lazyModule, m => m.removeGroupFromLeftNav);

export let lazyToggleGroupTreeExpansion = new LazyAction(
    lazyModule,
    m => m.toggleGroupTreeExpansion
);

export let lazyUnsubscribeFromUnreadNotifications = new LazyAction(
    lazyModule,
    m => m.unsubscribeFromUnreadNotifications
);

export let lazySetGroupLastVisitedTime = new LazyAction(lazyModule, m => m.setGroupLastVisitedTime);
