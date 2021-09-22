const enum WeekNumber {
    First = 'first',
    Second = 'second',
    Third = 'third',
    Fourth = 'fourth',
    Last = 'last',
    None = '',
}

const First = 'First';
const Second = 'Second';
const Third = 'Third';
const Fourth = 'Fourth';
const Last = 'Last';

export function weekNumberToExchange(week: WeekNumber): string {
    switch (week) {
        case WeekNumber.First:
            return First;
        case WeekNumber.Second:
            return Second;
        case WeekNumber.Third:
            return Third;
        case WeekNumber.Fourth:
            return Fourth;
        case WeekNumber.Last:
            return Last;
    }
    return '';
}

export function weekNumberToAddins(week: string): WeekNumber {
    switch (week) {
        case First:
            return WeekNumber.First;
        case Second:
            return WeekNumber.Second;
        case Third:
            return WeekNumber.Third;
        case Fourth:
            return WeekNumber.Fourth;
        case Last:
            return WeekNumber.Last;
    }
    return WeekNumber.None;
}

export default WeekNumber;
