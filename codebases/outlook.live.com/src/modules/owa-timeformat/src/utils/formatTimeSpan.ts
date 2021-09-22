import { format } from 'owa-localize';
import { getLocalizedString } from '../localization/getLocalizedString';
import {
    formatUserTime,
    formatWeekDayDate,
    formatWeekDayShortUserDate,
    isEqual,
    OwaDate,
    owaDate,
    subDays,
} from 'owa-datetime';

export function formatOneDayAllDayTimeSpan(
    startDate: OwaDate,
    endDate: OwaDate,
    isShortString: boolean
): string {
    return format(
        getLocalizedString('oneDayAllDayFormatString'),
        formatDateString(startDate, isShortString)
    );
}

export function formatMultiDayAllDayTimeSpan(
    startDate: OwaDate,
    endDate: OwaDate,
    isShortString: boolean
): string {
    const end = owaDate(startDate, subDays(endDate, 1));
    return format(
        getLocalizedString('multiDayAllDayFormatString'),
        formatDateString(startDate, isShortString),
        formatDateString(end, isShortString)
    );
}

export function formatSingleDayTimeSpan(
    startDate: OwaDate,
    endDate: OwaDate,
    isShortString: boolean
): string {
    const end = owaDate(startDate, endDate);

    if (isEqual(startDate, end)) {
        return format(
            getLocalizedString('sameDayNoDurationFormatString'),
            formatDateString(startDate, isShortString),
            formatUserTime(startDate)
        );
    }

    return format(
        getLocalizedString('sameDayFormatString'),
        formatDateString(startDate, isShortString),
        formatUserTime(startDate),
        formatUserTime(end)
    );
}

export function formatSingleDayTimeSpanWithoutDate(startDate: OwaDate, endDate: OwaDate): string {
    const end = owaDate(startDate, endDate);
    return format(
        getLocalizedString('timeSpanFormatString'),
        formatUserTime(startDate),
        formatUserTime(end)
    );
}

export function formatMultiDayTimeSpan(
    startDate: OwaDate,
    endDate: OwaDate,
    isShortString: boolean
): string {
    const end = owaDate(startDate, endDate);
    return format(
        getLocalizedString('differentDayFormatString'),
        formatDateString(startDate, isShortString),
        formatUserTime(startDate),
        formatDateString(end, isShortString),
        formatUserTime(end)
    );
}

export function formatDateString(date: OwaDate, isShortString: boolean) {
    return (isShortString ? formatWeekDayShortUserDate : formatWeekDayDate)(date);
}
