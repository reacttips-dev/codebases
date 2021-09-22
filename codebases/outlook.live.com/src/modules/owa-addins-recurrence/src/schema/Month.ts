const enum Month {
    January = 'jan',
    February = 'feb',
    March = 'mar',
    April = 'apr',
    May = 'may',
    June = 'jun',
    July = 'jul',
    August = 'aug',
    September = 'sep',
    October = 'oct',
    November = 'nov',
    December = 'dec',
    None = '',
}

const January = 'January';
const February = 'February';
const March = 'March';
const April = 'April';
const May = 'May';
const June = 'June';
const July = 'July';
const August = 'August';
const September = 'September';
const October = 'October';
const November = 'November';
const December = 'December';

export function monthToExchange(month: Month): string {
    switch (month) {
        case Month.January:
            return January;
        case Month.February:
            return February;
        case Month.March:
            return March;
        case Month.April:
            return April;
        case Month.May:
            return May;
        case Month.June:
            return June;
        case Month.July:
            return July;
        case Month.August:
            return August;
        case Month.September:
            return September;
        case Month.October:
            return October;
        case Month.November:
            return November;
        case Month.December:
            return December;
    }
    return '';
}

export function monthToAddins(month: string): Month {
    switch (month) {
        case January:
            return Month.January;
        case February:
            return Month.February;
        case March:
            return Month.March;
        case April:
            return Month.April;
        case May:
            return Month.May;
        case June:
            return Month.June;
        case July:
            return Month.July;
        case August:
            return Month.August;
        case September:
            return Month.September;
        case October:
            return Month.October;
        case November:
            return Month.November;
        case December:
            return Month.December;
    }
    return Month.None;
}

export default Month;
