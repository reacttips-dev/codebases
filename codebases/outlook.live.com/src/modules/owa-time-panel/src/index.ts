import { openTimePanel } from 'owa-time-panel-bootstrap';
import {
    createLazyComponent,
    LazyAction,
    LazyModule,
    registerLazyOrchestrator,
} from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "TimePanel"*/ './lazyIndex'));

// Lazy orchestrator
registerLazyOrchestrator(openTimePanel, lazyModule, m => m.openTimePanelOrchestrator);

// Delayed Loaded Components
export const TimePanel = createLazyComponent(lazyModule, m => m.TimePanel);
export const TimePanelHeaderBar = createLazyComponent(lazyModule, m => m.TimePanelHeaderBar);

// Delayed Loaded Actions
export const lazyInitializeTimePanel = new LazyAction(lazyModule, m => m.loadTimePanelData);

// Public APIs

/** See docs for `openEventDetailsView` for usage information */
export const lazyOpenEventDetailsView = new LazyAction(lazyModule, m => m.openEventDetailsView);

/** See docs for `openAttendeeTrackingView` for usage information */
export const lazyOpenAttendeeTrackingView = new LazyAction(
    lazyModule,
    m => m.openAttendeeTrackingView
);

/** See docs for `closeAttendeeTrackingView` for usage information */
export const lazyCloseAttendeeTrackingView = new LazyAction(
    lazyModule,
    m => m.closeAttendeeTrackingView
);

/** See docs for `openTasksView` for usage information */
export const lazyOpenTasksView = new LazyAction(lazyModule, m => m.openTasksView);

/** See docs for `openCalendarView` for usage information */
export const lazyOpenTimePanelInCalendarView = new LazyAction(lazyModule, m => m.openCalendarView);

/**  See docs for `openConflictsView` for usage information */
export const lazyOpenConflictsView = new LazyAction(lazyModule, m => m.openConflictsView);

/** See docs for `closeConflictsView` for usage information */
export const lazyCloseConflictsView = new LazyAction(lazyModule, m => m.closeConflictsView);

/** See docs for `openEventQuickComposeView` for usage information */
export const lazyOpenEventQuickComposeView = new LazyAction(
    lazyModule,
    m => m.openEventQuickComposeView
);
