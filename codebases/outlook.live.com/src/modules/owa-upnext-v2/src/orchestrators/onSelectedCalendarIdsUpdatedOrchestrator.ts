import { updateUpNextCalendarIds } from 'owa-upnext-event-loader';
import { orchestrator } from 'satcheljs';
import { getLoadState } from 'owa-calendar-events-loader';
import {
    onSelectedCalendarIdsUpdated,
    getTimePanelSelectedCalendarIdsFlatList,
} from 'owa-time-panel-selected-calendar-ids';
import { getLockId } from '../selectors/getLockId';

export const onSelectedCalendarIdsUpdatedOrchestrator = orchestrator(
    onSelectedCalendarIdsUpdated,
    () => {
        const selectedCalendars = getTimePanelSelectedCalendarIdsFlatList();
        if (getLoadState(getLockId()) !== 'DoesNotExist') {
            updateUpNextCalendarIds(selectedCalendars, getLockId());
        }
    }
);
