import { getLocalizedString } from '../localization/getLocalizedString';
import approximateDifferenceInMonths from '../owaDate/approximateDifferenceInMonths';
import approximateDifferenceInYears from '../owaDate/approximateDifferenceInYears';
import differenceInDays from '../owaDate/differenceInDays';
import differenceInHours from '../owaDate/differenceInHours';
import differenceInMinutes from '../owaDate/differenceInMinutes';
import differenceInWeeks from '../owaDate/differenceInWeeks';
import isAfter from '../owaDate/isAfter';
import type { OwaDate } from '../schema';
import { APPROXIMATE_DAYS_IN_MONTH, APPROXIMATE_DAYS_IN_YEAR } from 'owa-date-constants';
import { startOfDay } from '../index';
import { format } from 'owa-localize';

const MAX_MINUTES_AGO = 59;
const MAX_HOURS_AGO = 23;
const MAX_DAYS_AGO = 6;

export default function formatPastRelativeDateTime(
    pastDateTime: OwaDate,
    compareToDateTime: OwaDate
): string {
    if (isAfter(pastDateTime, compareToDateTime)) {
        // Default to one minute ago in that case
        // as this is corner scenario
        const oneMinuteAgoText = getLocalizedString('oneMinuteAgoText');
        return oneMinuteAgoText;
    }

    const diffMins = differenceInMinutes(compareToDateTime, pastDateTime);
    if (diffMins <= MAX_MINUTES_AGO) {
        const oneMinuteAgoText = getLocalizedString('oneMinuteAgoText');
        const minutesAgoText = getLocalizedString('minutesAgoText');

        return diffMins > 1 ? format(minutesAgoText, diffMins) : oneMinuteAgoText;
    }

    const diffHours = differenceInHours(compareToDateTime, pastDateTime);
    if (diffHours <= MAX_HOURS_AGO) {
        const oneHourAgoText = getLocalizedString('oneHourAgoText');
        const hoursAgoText = getLocalizedString('hoursAgoText');

        return diffHours > 1 ? format(hoursAgoText, diffHours) : oneHourAgoText;
    }

    const compareToDateTimeStartOfDay = startOfDay(compareToDateTime);
    const pastDateTimeStartOfDay = startOfDay(pastDateTime);

    const diffDays = differenceInDays(compareToDateTimeStartOfDay, pastDateTimeStartOfDay);
    if (diffDays <= MAX_DAYS_AGO) {
        const oneDayAgoText = getLocalizedString('oneDayAgoText');
        const daysAgoText = getLocalizedString('daysAgoText');
        return diffDays > 1 ? format(daysAgoText, diffDays) : oneDayAgoText;
    }

    if (diffDays < APPROXIMATE_DAYS_IN_MONTH) {
        const diffWeeks = differenceInWeeks(compareToDateTimeStartOfDay, pastDateTimeStartOfDay);
        const oneWeekAgoText = getLocalizedString('oneWeekAgoText');
        const weeksAgoText = getLocalizedString('weeksAgoText');
        return diffWeeks > 1 ? format(weeksAgoText, diffWeeks) : oneWeekAgoText;
    }

    if (diffDays < APPROXIMATE_DAYS_IN_YEAR) {
        const diffMonths = approximateDifferenceInMonths(
            compareToDateTimeStartOfDay,
            pastDateTimeStartOfDay
        );
        const oneMonthAgoText = getLocalizedString('oneMonthAgoText');
        const monthsAgoText = getLocalizedString('monthsAgoText');
        return diffMonths > 1 ? format(monthsAgoText, diffMonths) : oneMonthAgoText;
    }

    const diffYears = approximateDifferenceInYears(
        compareToDateTimeStartOfDay,
        pastDateTimeStartOfDay
    );
    const oneYearAgoText = getLocalizedString('oneYearAgoText');
    const yearsAgoText = getLocalizedString('yearsAgoText');
    return diffYears > 1 ? format(yearsAgoText, diffYears) : oneYearAgoText;
}
