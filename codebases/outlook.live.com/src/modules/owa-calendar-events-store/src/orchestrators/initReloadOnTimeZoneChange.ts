import { orchestrator } from 'satcheljs';
import { setLocalTimeZone } from 'owa-datetime-store';
import { reload } from '../utils/reload';

/**
 * orchestrator to respond to changes to the timezone offset information
 * by flushing and reloading the caches.
 *
 * This is needed because we store OwaDates in the stores.
 *
 * Before the dawn of time our objects were using the browser's Date object to store dates in the user's time zone. Display of those Dates and calculations assumed we wanted the user time zone, always.
 *
 * When multiple time zones came back we transitioned everything to OwaDate which are bound to a particular time zone (by design). This kept all the calculations correct, avoiding regressions.
 * But, when we change time zone we need to change all dates that are bound to the user's time zone to the new time zone. We do that by throwing away the caches and reloading, since changing time zones is not something that happens too often.
 *
 * TODO VSO 57544: The alternative solution for this is to NOT use OwaDate in our stores, but store just a timestamp or an ISO string at best, then create an OwaDate out of it every time we need to make a calculation or show the date. This way, a change in time zone would not require changing the caches.
 */
export const onSetLocalTimeZoneOrchestrator = orchestrator(setLocalTimeZone, reload);
