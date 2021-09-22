import { inXMinutes } from 'owa-locstrings/lib/strings/inxminutes.locstring.json';
import { tomorrow, nowUpNext } from '../components/upNext.locstring.json';
import loc, { format } from 'owa-localize';
import type { CalendarEvent } from 'owa-calendar-types';
import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';
import { formatUserTime, isSameDay, userDate, getTimestamp } from 'owa-datetime';
import { isEventHappeningNow } from 'owa-datetime-utils';
import { observableNow } from 'owa-observable-datetime';

const MILLISECONDS_IN_FIFTYNINE_MINUTES = 59 * MILLISECONDS_IN_MINUTE;

export default function getTimeUntilEvent(
    upNextEvent: CalendarEvent,
    addNowSeparator: boolean
): string {
    const now = observableNow();

    /**
     * Case 1 - If event is happening now
     * Show Now if no location is set
     * Show Now, if location is set
     */

    if (isEventHappeningNow(now, upNextEvent.Start, upNextEvent.End)) {
        return addNowSeparator ? loc(nowUpNext) + ',' : loc(nowUpNext);
    }

    /**
     * Case 2 - Show "in {0} mins" when event is 59 mins away from now
     */
    const meetingStart = userDate(upNextEvent.Start);
    const differenceInSeconds = Math.abs(getTimestamp(now) - getTimestamp(meetingStart));
    if (differenceInSeconds <= MILLISECONDS_IN_FIFTYNINE_MINUTES) {
        const minutes = Math.ceil(differenceInSeconds / MILLISECONDS_IN_MINUTE);
        return format(loc(inXMinutes), minutes);
    }

    /**
     * Case 3 - Event is today or tomorrow but not starting in next hour (59 mins)
     */
    const isMeetingToday = isSameDay(now, meetingStart);
    const formattedTime = formatUserTime(meetingStart);
    const timeString = isMeetingToday
        ? formattedTime /* 12:30 PM */
        : format(loc(tomorrow), formattedTime); /* Tomorrow 12:30 PM */

    return timeString;
}
