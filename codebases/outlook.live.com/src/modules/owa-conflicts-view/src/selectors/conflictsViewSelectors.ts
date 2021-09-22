import type { ConflictsViewScenario } from '../store/schema/ConflictsViewState';
import getStore from '../store/store';

export function getHighlightedEventId(scenario: ConflictsViewScenario): string | null {
    const store = getStore().get(scenario);
    if (!store.meetingRequest || !store.meetingRequest.AssociatedCalendarItemId) {
        return null;
    }

    return store.meetingRequest.AssociatedCalendarItemId.Id;
}
