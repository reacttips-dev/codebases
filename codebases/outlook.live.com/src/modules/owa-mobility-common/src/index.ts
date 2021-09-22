import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MobilityCommon"*/ './lazyIndex')
);

// lazy actions
export let lazyDeleteEventTravelBookends = new LazyAction(
    lazyModule,
    m => m.deleteEventTravelBookends
);

export let lazyUpdateEventTravelBookends = new LazyAction(
    lazyModule,
    m => m.updateEventTravelBookends
);

export let lazyLogDeleteTravelTimeEvent = new LazyAction(
    lazyModule,
    m => m.logDeleteTravelTimeEvent
);

export let lazyLogSaveTravelTimeEvent = new LazyAction(lazyModule, m => m.logSaveTravelTimeEvent);

// components
export const MobilityDropdown = createLazyComponent(lazyModule, m => m.MobilityDropdown);
