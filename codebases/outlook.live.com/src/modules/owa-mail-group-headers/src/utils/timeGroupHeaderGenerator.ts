import { noneGroupHeader } from './timeGroupHeaderGenerator.locstring.json';
import loc from 'owa-localize';
import generateTimeGroupHeaders from './generateTimeGroupHeaders';
import type TimeGroupHeader from '../type/TimeGroupHeader';
import { OwaDate, isBefore, isSameDay } from 'owa-datetime';
import { NoGroupHeaderId } from '../index';
import { observableToday } from 'owa-observable-datetime';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

let timeGroupHeaders: TimeGroupHeader[] = [];
let todayUsedToGenerateTimeHeaders;

// initialize group headers
function initializeTimeGroupHeaders(today: OwaDate) {
    const weekStartDay = getUserConfiguration().UserOptions.WeekStartDay;
    timeGroupHeaders = generateTimeGroupHeaders(today, weekStartDay);
    todayUsedToGenerateTimeHeaders = today;
}

/**
 * Get group time header for a given time
 * @param date for which to get time group header
 * @return time group header for a given time
 */
export function getTimeGroupHeader(date: OwaDate): TimeGroupHeader {
    // Generate the group header date ranges if they were not generated ever or
    // the day has changed than what it was when the ranges were generated
    const today = observableToday();
    if (timeGroupHeaders.length == 0 || !isSameDay(todayUsedToGenerateTimeHeaders, today)) {
        initializeTimeGroupHeaders(today);
    }

    for (let i = 0; i < timeGroupHeaders.length; i++) {
        const timeRange = timeGroupHeaders[i];

        // Check if the time is within range by including lower time boundary but excluding upper boundary
        if (!isBefore(date, timeRange.rangeStartTime) && isBefore(date, timeRange.rangeEndTime)) {
            return timeRange;
        }
    }

    // If an item is not in defined group ranges return none type. It should be very rare but in the
    // past we have seen instances of Tomorrow header e.g. in case timer callback is not triggered.
    return {
        headerText: () => loc(noneGroupHeader),
        headerId: NoGroupHeaderId.None,
        rangeStartTime: null,
        rangeEndTime: null,
    };
}
