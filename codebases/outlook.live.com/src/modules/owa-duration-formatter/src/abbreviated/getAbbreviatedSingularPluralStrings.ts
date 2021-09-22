import {
    yearSingularAbbreviation,
    yearFirstPluralAbbreviation,
    yearSecondGenitivePluralAbbreviation,
    monthSingularAbbreviation,
    monthFirstPluralAbbreviation,
    monthSecondGenitivePluralAbbreviation,
    weekSingularAbbreviation,
    weekFirstPluralAbbreviation,
    weekSecondGenitivePluralAbbreviation,
    daySingularAbbreviation,
    dayFirstPluralAbbreviation,
    daySecondGenitivePluralAbbreviation,
    hourSingularAbbreviation,
    hourFirstPluralAbbreviation,
    hourSecondGenitivePluralAbbreviation,
    minuteSingularAbbreviation,
    minuteFirstPluralAbbreviation,
    minuteSecondGenitivePluralAbbreviation,
    secondSingularAbbreviation,
    secondFirstPluralAbbreviation,
    secondSecondGenitivePluralAbbreviation,
} from './getAbbreviatedSingularPluralStrings.locstring.json';
import loc from 'owa-localize';

import createSingularPluralStrings from 'owa-measurementunit-formatter/lib/createSingularPluralStrings';

// Groups the strings for each unit
export default function getAbbreviatedSingularPluralStrings() {
    return {
        year: createSingularPluralStrings(
            loc(yearSingularAbbreviation),
            loc(yearFirstPluralAbbreviation),
            loc(yearSecondGenitivePluralAbbreviation)
        ),
        month: createSingularPluralStrings(
            loc(monthSingularAbbreviation),
            loc(monthFirstPluralAbbreviation),
            loc(monthSecondGenitivePluralAbbreviation)
        ),
        week: createSingularPluralStrings(
            loc(weekSingularAbbreviation),
            loc(weekFirstPluralAbbreviation),
            loc(weekSecondGenitivePluralAbbreviation)
        ),
        day: createSingularPluralStrings(
            loc(daySingularAbbreviation),
            loc(dayFirstPluralAbbreviation),
            loc(daySecondGenitivePluralAbbreviation)
        ),
        hour: createSingularPluralStrings(
            loc(hourSingularAbbreviation),
            loc(hourFirstPluralAbbreviation),
            loc(hourSecondGenitivePluralAbbreviation)
        ),
        minute: createSingularPluralStrings(
            loc(minuteSingularAbbreviation),
            loc(minuteFirstPluralAbbreviation),
            loc(minuteSecondGenitivePluralAbbreviation)
        ),
        second: createSingularPluralStrings(
            loc(secondSingularAbbreviation),
            loc(secondFirstPluralAbbreviation),
            loc(secondSecondGenitivePluralAbbreviation)
        ),
    };
}
