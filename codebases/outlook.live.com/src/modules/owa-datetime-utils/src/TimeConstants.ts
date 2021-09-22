import { DayOfWeek } from '@fluentui/date-time-utilities/lib/dateValues/dateValues';

/**
 * Common constants and methods
 */
let TimeConstants = {
    MillisecondsInOneDay: 86400000,
    MillisecondsIn1Sec: 1000,
    MillisecondsIn1Min: 60000,
    MillisecondsIn15Mins: 900000,
    MillisecondsIn20Mins: 1200000,
    MillisecondsIn22Mins: 1320000,
    MillisecondsIn24Mins: 1440000,
    MillisecondsIn30Mins: 1800000,
    MillisecondsIn1Hour: 3600000,
    MinutesInOneDay: 1440,
    MinutesInOneHour: 60,
    SecondsInOneMinute: 60,
    DaysInOneWeek: 7,
    AllDaysOfWeek: [
        DayOfWeek.Sunday,
        DayOfWeek.Monday,
        DayOfWeek.Tuesday,
        DayOfWeek.Wednesday,
        DayOfWeek.Thursday,
        DayOfWeek.Friday,
        DayOfWeek.Saturday,
    ],
};
export default TimeConstants;
