import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears, formatDistanceToNowStrict, fromUnixTime, parseISO, } from 'date-fns';
export var getFormattedTimestamp = function (dataTimestamp) {
    var nowTime = new Date();
    var postedTime = fromUnixTime(dataTimestamp);
    var mins = differenceInMinutes(nowTime, postedTime);
    var hours = differenceInHours(nowTime, postedTime);
    var days = differenceInDays(nowTime, postedTime);
    var weeks = differenceInWeeks(nowTime, postedTime);
    var months = differenceInMonths(nowTime, postedTime);
    var years = differenceInYears(nowTime, postedTime);
    var timeAgo = '';
    if (mins <= 0) {
        timeAgo = 'less than a minute ago';
    }
    else if (hours <= 0) {
        timeAgo = pluralize(mins, 'minute') + ' ago';
    }
    else if (days <= 0) {
        timeAgo = pluralize(hours, 'hour') + ' ago';
    }
    else if (weeks <= 0) {
        timeAgo = pluralize(days, 'day') + ' ago';
    }
    else if (months <= 0) {
        timeAgo = pluralize(weeks, 'week') + ' ago';
    }
    else if (years <= 0) {
        timeAgo = pluralize(months, 'month') + ' ago';
    }
    else {
        timeAgo = pluralize(years, 'year') + ' ago';
    }
    return timeAgo;
};
export var getRelativeTimestamp = function (isoString) {
    var parsedISO = parseISO(isoString);
    var minsDiff = differenceInMinutes(new Date(), parsedISO);
    if (minsDiff <= 0) {
        return 'less than a minute ago';
    }
    return formatDistanceToNowStrict(parsedISO) + " ago";
};
export var pluralize = function (number, pluralStr) {
    var str = number === 1 ? pluralStr : pluralStr + 's';
    return number + " " + str;
};
export var currentYear = function () {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date());
};
//# sourceMappingURL=timestamp-formatter.js.map