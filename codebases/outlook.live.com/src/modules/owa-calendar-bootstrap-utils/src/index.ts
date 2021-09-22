import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarBootstrapUtils"*/ './lazyIndex')
);

/**
 * Initializes accounts, calendars, and settings necessary for OWA modules
 *
 * Superset of `lazyInitializeCalendarsDataForEventDeeplink` that covers additional concerns not relevant
 * to event deeplinks, such as (but not limited to):
 * - conditional auto-selection of default calendar
 * - fetch of scenario settings
 * - auto-upgrade of shared calendars
 */
export const lazyInitializeCalendarsDataForModule = new LazyAction(
    lazyModule,
    m => m.initializeCalendarsDataForModule
);

/**
 * Initializes just the accounts and calendars
 */
export const lazyInitializeAccountAndCalendars = new LazyAction(
    lazyModule,
    m => m.initializeAccountAndCalendars
);

/**
 * Initializes accounts, calendars, and settings necessary for event deeplinks (e.g. compose, reading pane)
 */
export const lazyInitializeCalendarsDataForEventDeeplink = new LazyAction(
    lazyModule,
    m => m.initializeAccountAndCalendars
);
