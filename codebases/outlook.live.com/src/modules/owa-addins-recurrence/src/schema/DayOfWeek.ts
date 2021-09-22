const enum DayOfWeek {
    Monday = 'mon',
    Tuesday = 'tue',
    Wednesday = 'wed',
    Thursday = 'thu',
    Friday = 'fri',
    Saturday = 'sat',
    Sunday = 'sun',
    Weekday = 'weekday',
    WeekendDay = 'weekendDay',
    Days = 'day',
    None = '',
}

const Monday = 'Monday';
const Tuesday = 'Tuesday';
const Wednesday = 'Wednesday';
const Thursday = 'Thursday';
const Friday = 'Friday';
const Saturday = 'Saturday';
const Sunday = 'Sunday';
const Weekday = [Monday, Tuesday, Wednesday, Thursday, Friday].join(' ');
const WeekendDay = [Saturday, Sunday].join(' ');
const Day = [Weekday, WeekendDay].join(' ');

export function dayOfWeekToExchange(day: DayOfWeek): string {
    switch (day) {
        case DayOfWeek.Monday:
            return Monday;
        case DayOfWeek.Tuesday:
            return Tuesday;
        case DayOfWeek.Wednesday:
            return Wednesday;
        case DayOfWeek.Thursday:
            return Thursday;
        case DayOfWeek.Friday:
            return Friday;
        case DayOfWeek.Saturday:
            return Saturday;
        case DayOfWeek.Sunday:
            return Sunday;
        case DayOfWeek.Weekday:
            return Weekday;
        case DayOfWeek.WeekendDay:
            return WeekendDay;
        case DayOfWeek.Days:
            return Day;
    }
    return '';
}

export function dayOfWeekToAddins(day: string): DayOfWeek {
    switch (day) {
        case Monday:
            return DayOfWeek.Monday;
        case Tuesday:
            return DayOfWeek.Tuesday;
        case Wednesday:
            return DayOfWeek.Wednesday;
        case Thursday:
            return DayOfWeek.Thursday;
        case Friday:
            return DayOfWeek.Friday;
        case Saturday:
            return DayOfWeek.Saturday;
        case Sunday:
            return DayOfWeek.Sunday;
        case Weekday:
            return DayOfWeek.Weekday;
        case WeekendDay:
            return DayOfWeek.WeekendDay;
        case Day:
            return DayOfWeek.Days;
    }
    return DayOfWeek.None;
}

export default DayOfWeek;
