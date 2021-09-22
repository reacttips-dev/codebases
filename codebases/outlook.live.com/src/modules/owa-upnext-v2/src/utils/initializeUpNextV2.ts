import { getTimePanelSelectedCalendarIdsFlatList } from 'owa-time-panel-selected-calendar-ids';
import { initializeUpNextEventLoader } from 'owa-upnext-event-loader';
import { getLockId } from '../selectors/getLockId';

export function initializeUpNextV2() {
    // Selected calendars are the calendars that the user has selected in the time panel. If the
    // user has not selected calendars in the time panel, the calendars that user has selected in Calendar module left nav are used.
    // For Upnext event we will get the upcoming event in any of these selected calendars
    const selectedCalendars = getTimePanelSelectedCalendarIdsFlatList();
    initializeUpNextEventLoader(selectedCalendars, getLockId());
}
