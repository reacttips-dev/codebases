import { refreshUpNextCalendarEvent } from '../orchestrators/refreshUpNextCalendarEvent';
import { getInitializedScenarioIds } from '../selectors/upNextStoreSelectors';

/**
 * Manually refresh the up-next calendar event
 */
export function refreshUpNextCalendarEventForAllScenarios(): void {
    getInitializedScenarioIds().forEach(refreshUpNextCalendarEvent);
}
