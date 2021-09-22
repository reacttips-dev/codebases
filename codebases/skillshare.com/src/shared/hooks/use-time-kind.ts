import { isAfter, isBefore, isToday, isWithinInterval } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { TimeKind } from '../time-kind';
export var useTimeKind = function (startDate, endDate, timeZone) {
    if (timeZone === void 0) { timeZone = 'America/New_York'; }
    var ztCurrentDate = utcToZonedTime(new Date(), timeZone);
    var ztStartDate = utcToZonedTime(startDate, timeZone);
    var ztEndDate = utcToZonedTime(endDate, timeZone);
    if (isWithinInterval(ztCurrentDate, { start: ztStartDate, end: ztEndDate })) {
        return TimeKind.NOW;
    }
    else if (isToday(ztStartDate) && isBefore(ztCurrentDate, ztStartDate)) {
        return TimeKind.TODAY;
    }
    else if (isBefore(ztCurrentDate, ztStartDate)) {
        return TimeKind.FUTURE;
    }
    else if (isAfter(ztCurrentDate, ztStartDate)) {
        return TimeKind.PAST;
    }
};
//# sourceMappingURL=use-time-kind.js.map