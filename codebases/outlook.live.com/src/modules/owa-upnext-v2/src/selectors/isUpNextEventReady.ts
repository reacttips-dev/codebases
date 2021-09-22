import { getUpNextCalendarEventId } from 'owa-upnext-event-loader';
import { getLockId } from './getLockId';

export function isUpNextEventReady(): boolean {
    return !!getUpNextCalendarEventId(getLockId());
}
