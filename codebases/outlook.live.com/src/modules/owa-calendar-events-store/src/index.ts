import './orchestrators/eventsCacheOrchestrators';
import './orchestrators/instantCalendarEventCreateOrchestrator';
import './mutators/eventsCacheMutators';
import './mutators/fullItemsMruMapMutators';
import './orchestrators/instantCalendarEventDeleteOrchestrator';
import './orchestrators/updateFullCalendarEventFromServerOrchestrator';
import './orchestrators/instantCalendarEventUpdateOrchestrator';
import './orchestrators/initReloadOnTimeZoneChange';
import { LazyModule, LazyAction } from 'owa-bundling';

export type { default as CalendarEvent } from 'owa-calendar-types/lib/types/CalendarEvent';
export type { CalendarEventsLoadingState } from './types/CalendarEventsLoadingState';
export type { CalendarEventEntity } from './store/schema/CalendarEventEntity';
export type { EventsCacheLockId } from 'owa-events-cache';
export { FullItemLoadState } from './store/schema/FullItemsMruMap';
export { getCalendarEventWithId } from './selectors/calendarFolderEventsSelectors';

export type {
    LockedCalendarEventsStore,
    LockedCalendarEventsReader,
} from './types/LockedCalendarEventsStore';

// Actions
export * from './actions/publicActions';

// Util functions
export {
    resumeNotificationsProcessing,
    suspendNotificationsProcessing,
} from './utils/CalendarItemNotifications';
export { getCalendarCharmIdByFolderId } from './utils/calendarCharmResolver';
export { getCharm } from './utils/getCharm';
export { default as getItemIdToUpdate } from './utils/getItemIdToUpdate';
export { getFullItemLoadState } from './selectors/fullItemInfoSelectors';
export { managePollingForLinkedCalendars } from './utils/managePollingForLinkedCalendars';
export { getCalendarEventUpdatesForResponseTypeChange } from './utils/getCalendarEventUpdatesForResponseTypeChange';
export { reload } from './utils/reload';

export { default as expandCalendarEventService } from './services/expandCalendarEventService';
export { convertRESTEventsToClientEvents } from './services/calendarEventsFromRestUtils';

// Locked calendar folder events functions
export { createLockedCalendarEventsStore } from './utils/lockedCalendarEvents/createLockedCalendarEventsStore';
export { getLockedCalendarEventsStore } from './utils/lockedCalendarEvents/getLockedCalendarEventsStore';
export { getLockedCalendarEventsReader } from './utils/lockedCalendarEvents/getLockedCalendarEventsReader';
export { getCalendarFolderWorkingHours } from './selectors/calendarWorkingHoursSelector';

// events-store package is not intended to be lazy.This is to track removing lazyIndex.ts once shadow mailbox is supported.
// In case more lazy features are required, consider creating a new package.
// https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/62892
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "EventsStore" */ './lazyIndex')
);

export let lazyGetCalendarEventsFromRest = new LazyAction(
    lazyModule,
    m => m.getCalendarEventsFromRest
);
