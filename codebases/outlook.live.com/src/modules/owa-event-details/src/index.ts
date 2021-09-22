import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TimePanelEventDetails"*/ './lazyIndex')
);

// Delay loaded actions
export const lazyUpdateSelectedEventId = new LazyAction(lazyModule, m => m.updateSelectedEventId);

// Delay loaded components
export const EventDetails = createLazyComponent(lazyModule, m => m.TimePanelEventDetails);
export const AttendeeTracking = createLazyComponent(lazyModule, m => m.TimePanelAttendeeTracking);
