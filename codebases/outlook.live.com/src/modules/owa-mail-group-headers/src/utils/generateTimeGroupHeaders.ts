import {
    todayGroupHeader,
    yesterdayGroupHeader,
    thisWeekGroupHeader,
    lastWeekGroupHeader,
    thisMonthGroupHeader,
    lastMonthGroupHeader,
    olderGroupHeader,
} from './generateTimeGroupHeaders.locstring.json';
import { pinnedGroupHeader } from 'owa-locstrings/lib/strings/pinnedgroupheader.locstring.json';
import { decemberUppercase } from 'owa-locstrings/lib/strings/decemberuppercase.locstring.json';
import { novemberUppercase } from 'owa-locstrings/lib/strings/novemberuppercase.locstring.json';
import { octoberUppercase } from 'owa-locstrings/lib/strings/octoberuppercase.locstring.json';
import { septemberUppercase } from 'owa-locstrings/lib/strings/septemberuppercase.locstring.json';
import { augustUppercase } from 'owa-locstrings/lib/strings/augustuppercase.locstring.json';
import { julyUppercase } from 'owa-locstrings/lib/strings/julyuppercase.locstring.json';
import { juneUppercase } from 'owa-locstrings/lib/strings/juneuppercase.locstring.json';
import { mayUppercase } from 'owa-locstrings/lib/strings/mayuppercase.locstring.json';
import { aprilUppercase } from 'owa-locstrings/lib/strings/apriluppercase.locstring.json';
import { marchUppercase } from 'owa-locstrings/lib/strings/marchuppercase.locstring.json';
import { februaryUppercase } from 'owa-locstrings/lib/strings/februaryuppercase.locstring.json';
import { januaryUppercase } from 'owa-locstrings/lib/strings/januaryuppercase.locstring.json';
import loc from 'owa-localize';
import TimeGroupHeader, { TimeGroupHeaderType } from '../type/TimeGroupHeader';
import { TimeHeaderId } from '../type/GroupHeaderId';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    addDays,
    addSeconds,
    getMonth,
    getYear,
    MIN_OUTLOOK_DATE,
    OwaDate,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subDays,
    subMonths,
    subWeeks,
    subYears,
    utcDate,
} from 'owa-datetime';

// References in time that are used to build time group headers.
interface TimeGroupDateTimeReferences {
    adjustedTime: OwaDate;
    currentYear: number;
    lastWeek: OwaDate;
    oneMonthAgo: OwaDate;
    pinnedItemTimestamp: OwaDate;
    startofThisMonth: OwaDate;
    startOfThisWeek: OwaDate;
    todayStartTime: OwaDate;
    tomorrowStartTime: OwaDate;
    twoMonthsAgo: OwaDate;
    yesterdayStartTime: OwaDate;
}

/**
 * Generate time group headers
 * @param time Time specified in user time zone based on which to generate time ranges
 * @return An array of time group ranges for mail list headers
 */
export default function generateTimeGroupHeaders(
    time: OwaDate,
    weekStartDay: number
): TimeGroupHeader[] {
    const monthNames: string[] = [
        loc(januaryUppercase),
        loc(februaryUppercase),
        loc(marchUppercase),
        loc(aprilUppercase),
        loc(mayUppercase),
        loc(juneUppercase),
        loc(julyUppercase),
        loc(augustUppercase),
        loc(septemberUppercase),
        loc(octoberUppercase),
        loc(novemberUppercase),
        loc(decemberUppercase),
    ];

    // References in time that are used to build time group headers.
    const dateTimeReferences: TimeGroupDateTimeReferences = {
        adjustedTime: time,
        currentYear: getYear(time),
        lastWeek: startOfWeek(subWeeks(time, 1), weekStartDay),
        oneMonthAgo: startOfMonth(subMonths(time, 1)),
        pinnedItemTimestamp: utcDate(4500, 8, 1) /* Sept 1 4500 */,
        startofThisMonth: startOfMonth(time),
        startOfThisWeek: startOfWeek(time, weekStartDay),
        todayStartTime: startOfDay(time),
        tomorrowStartTime: startOfDay(addDays(time, 1)),
        twoMonthsAgo: startOfMonth(subMonths(time, 2)),
        yesterdayStartTime: startOfDay(subDays(time, 1)),
    };

    const consumerHeaders = [
        TimeGroupHeaderType.Pinned,
        TimeGroupHeaderType.Today,
        TimeGroupHeaderType.Yesterday,
        TimeGroupHeaderType.ThisMonth,
        TimeGroupHeaderType.OneMonthOlder,
        TimeGroupHeaderType.TwoMonthsOlder,
        TimeGroupHeaderType.Older,
    ];

    const enterpriseHeaders = [
        TimeGroupHeaderType.Pinned,
        TimeGroupHeaderType.Today,
        TimeGroupHeaderType.Yesterday,
        TimeGroupHeaderType.ThisWeek,
        TimeGroupHeaderType.LastWeek,
        TimeGroupHeaderType.ThisMonth,
        TimeGroupHeaderType.LastMonth,
        TimeGroupHeaderType.SpecificMonth,
        TimeGroupHeaderType.SpecificYear,
    ];

    // Determine header types depending on the product.
    const headerTypes = isConsumer() ? consumerHeaders : enterpriseHeaders;

    // Generate headers from header types.
    return generateTimeGroupHeadersFromTimeGroupHeaderTypes(
        dateTimeReferences,
        headerTypes,
        monthNames
    );
}

/**
 * Generates headers from header types.
 * @param dateTimeReferences Object with references required to build TimeGroupHeader objects
 * @param headerTypes Determines which headers are returned
 * @param monthNames Array of month name strings
 * @returns An array of header objects
 */
function generateTimeGroupHeadersFromTimeGroupHeaderTypes(
    dateTimeReferences: TimeGroupDateTimeReferences,
    headerTypes: TimeGroupHeaderType[],
    monthNames: string[]
): TimeGroupHeader[] {
    const timeGroupHeaders: TimeGroupHeader[] = [];

    for (const headerType of headerTypes) {
        const timeGroupHeadersFromHeaderType = mapHeaderTypeToTimeGroupHeaders(
            dateTimeReferences,
            headerType,
            monthNames
        );

        timeGroupHeaders.push(...timeGroupHeadersFromHeaderType);
    }

    return timeGroupHeaders;
}

/**
 * Maps header type to header objects.
 * @param dateTimeReferences Object with references required to build TimeGroupHeader objects
 * @param headerType Determines which headers are returned
 * @param monthNames Array of month name strings
 * @returns An array of header objects
 */
function mapHeaderTypeToTimeGroupHeaders(
    dateTimeReferences: TimeGroupDateTimeReferences,
    headerType: TimeGroupHeaderType,
    monthNames: string[]
): TimeGroupHeader[] {
    switch (headerType) {
        // "Pinned" header.
        case TimeGroupHeaderType.Pinned:
            return [
                {
                    headerText: () => loc(pinnedGroupHeader),
                    headerId: TimeHeaderId.Pinned,
                    rangeStartTime: dateTimeReferences.pinnedItemTimestamp,
                    rangeEndTime: addSeconds(
                        dateTimeReferences.pinnedItemTimestamp,
                        1
                    ) /* add one second */,
                },
            ];
        // "Today" header.
        case TimeGroupHeaderType.Today:
            return [
                {
                    headerText: () => loc(todayGroupHeader),
                    headerId: TimeHeaderId.Today,
                    rangeStartTime: dateTimeReferences.todayStartTime,
                    rangeEndTime: dateTimeReferences.tomorrowStartTime,
                },
            ];
        // "Yesterday" header.
        case TimeGroupHeaderType.Yesterday:
            return [
                {
                    headerText: () => loc(yesterdayGroupHeader),
                    headerId: TimeHeaderId.Yesterday,
                    rangeStartTime: dateTimeReferences.yesterdayStartTime,
                    rangeEndTime: dateTimeReferences.todayStartTime,
                },
            ];
        // "This week" header.
        case TimeGroupHeaderType.ThisWeek:
            return [
                {
                    headerText: () => loc(thisWeekGroupHeader),
                    headerId: TimeHeaderId.ThisWeek,
                    rangeStartTime: dateTimeReferences.startOfThisWeek,
                    rangeEndTime: dateTimeReferences.yesterdayStartTime,
                },
            ];
        // "Last week" header.
        case TimeGroupHeaderType.LastWeek:
            return [
                {
                    headerText: () => loc(lastWeekGroupHeader),
                    headerId: TimeHeaderId.LastWeek,
                    rangeStartTime: dateTimeReferences.lastWeek,
                    rangeEndTime: dateTimeReferences.startOfThisWeek,
                },
            ];
        // "This month" header.
        case TimeGroupHeaderType.ThisMonth:
            if (dateTimeReferences.startofThisMonth < dateTimeReferences.yesterdayStartTime) {
                return [
                    {
                        headerText: () => loc(thisMonthGroupHeader),
                        headerId: TimeHeaderId.ThisMonth,
                        rangeStartTime: dateTimeReferences.startofThisMonth,
                        rangeEndTime: dateTimeReferences.yesterdayStartTime,
                    },
                ];
            }

            return [];
        // "Last month" header.
        case TimeGroupHeaderType.LastMonth:
            return [
                {
                    headerText: () => loc(lastMonthGroupHeader),
                    headerId: TimeHeaderId.LastMonth,
                    rangeStartTime: dateTimeReferences.oneMonthAgo,
                    rangeEndTime: dateTimeReferences.startofThisMonth,
                },
            ];
        // Haders for specific months of the year, up until the previous year.
        case TimeGroupHeaderType.SpecificMonth:
            /**
             * Add headers for preceding months of the current year (not including the
             * previous month, as that is handled by "Last month" header).
             */
            const monthHeaders: TimeGroupHeader[] = [];

            let monthIterator = 2;
            let monthHeaderStartTime = startOfMonth(
                subMonths(dateTimeReferences.adjustedTime, monthIterator)
            );
            let monthHeaderEndTime = startOfMonth(
                subMonths(dateTimeReferences.adjustedTime, monthIterator - 1)
            );

            while (getYear(monthHeaderStartTime) === dateTimeReferences.currentYear) {
                const monthName = monthNames[getMonth(monthHeaderStartTime)];

                monthHeaders.push({
                    headerText: () => monthName,
                    headerId: monthName,
                    rangeStartTime: monthHeaderStartTime,
                    rangeEndTime: monthHeaderEndTime,
                });

                monthIterator++;
                monthHeaderStartTime = startOfMonth(
                    subMonths(dateTimeReferences.adjustedTime, monthIterator)
                );
                monthHeaderEndTime = startOfMonth(
                    subMonths(dateTimeReferences.adjustedTime, monthIterator - 1)
                );
            }

            return monthHeaders;
        // Headers for specific years (before current year and until 1970).
        case TimeGroupHeaderType.SpecificYear:
            /**
             * Add headers for preceding years until 1970 (not including the current
             * year, as that is handled by the month headers)
             */
            const yearHeaders: TimeGroupHeader[] = [];

            let yearIterator = 1;
            let yearStartTime = startOfYear(
                subYears(dateTimeReferences.adjustedTime, yearIterator)
            );
            let yearEndTime = startOfYear(
                subYears(dateTimeReferences.adjustedTime, yearIterator - 1)
            );

            const earliestYear = 1970; // corresponds to Unix/JavaScript epoch.
            while (getYear(yearStartTime) >= earliestYear) {
                const year = getYear(yearStartTime);

                yearHeaders.push({
                    headerText: () => year.toString(),
                    headerId: year,
                    rangeStartTime: yearStartTime,
                    rangeEndTime: yearEndTime,
                });

                yearIterator++;
                yearStartTime = startOfYear(
                    subYears(dateTimeReferences.adjustedTime, yearIterator)
                );
                yearEndTime = startOfYear(
                    subYears(dateTimeReferences.adjustedTime, yearIterator - 1)
                );
            }

            return yearHeaders;
        // "Older" header.
        case TimeGroupHeaderType.Older:
            return [
                {
                    headerText: () => loc(olderGroupHeader),
                    headerId: TimeHeaderId.Older,
                    rangeStartTime: MIN_OUTLOOK_DATE /* Jan 1st 1601 00:00:00 UTC */,
                    rangeEndTime: dateTimeReferences.twoMonthsAgo,
                },
            ];
        // Header for one month ago.
        case TimeGroupHeaderType.OneMonthOlder:
            return [
                {
                    headerText: () => monthNames[getMonth(dateTimeReferences.oneMonthAgo)],
                    headerId: TimeHeaderId.OneMonthOlder,
                    rangeStartTime: dateTimeReferences.oneMonthAgo,
                    rangeEndTime: dateTimeReferences.startofThisMonth,
                },
            ];
        // Header for two months ago.
        case TimeGroupHeaderType.TwoMonthsOlder:
            return [
                {
                    headerText: () => monthNames[getMonth(dateTimeReferences.twoMonthsAgo)],
                    headerId: TimeHeaderId.TwoMonthsOlder,
                    rangeStartTime: dateTimeReferences.twoMonthsAgo,
                    rangeEndTime: dateTimeReferences.oneMonthAgo,
                },
            ];
        default:
            throw new Error(
                'Invalid TimeGroupHeaderType passed to mapHeaderTypeToTimeGroupHeaders'
            );
    }
}
