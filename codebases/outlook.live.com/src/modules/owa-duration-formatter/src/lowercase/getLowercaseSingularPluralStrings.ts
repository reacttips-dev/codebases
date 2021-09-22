import {
    yearSecondGenitivePluralLowercase,
    monthSecondGenitivePluralLowercase,
    weekSingularLowercase,
    weekFirstPluralLowercase,
    weekSecondGenitivePluralLowercase,
    daySecondGenitivePluralLowercase,
    hourSingularLowercase,
    hourFirstPluralLowercase,
    hourSecondGenitivePluralLowercase,
    minuteSingularLowercase,
    minuteFirstPluralLowercase,
    minuteSecondGenitivePluralLowercase,
    secondSingularLowercase,
    secondFirstPluralLowercase,
    secondSecondGenitivePluralLowercase,
} from './getLowercaseSingularPluralStrings.locstring.json';
import { yearFirstPluralLowercase } from 'owa-locstrings/lib/strings/yearfirstplurallowercase.locstring.json';
import { yearSingularLowercase } from 'owa-locstrings/lib/strings/yearsingularlowercase.locstring.json';
import { monthFirstPluralLowercase } from 'owa-locstrings/lib/strings/monthfirstplurallowercase.locstring.json';
import { monthSingularLowercase } from 'owa-locstrings/lib/strings/monthsingularlowercase.locstring.json';
import { dayFirstPluralLowercase } from 'owa-locstrings/lib/strings/dayfirstplurallowercase.locstring.json';
import { daySingularLowercase } from 'owa-locstrings/lib/strings/daysingularlowercase.locstring.json';
import loc from 'owa-localize';
import createSingularPluralStrings from 'owa-measurementunit-formatter/lib/createSingularPluralStrings';

// Groups the strings for each unit
export default function getLowercaseSingularPluralStrings() {
    return {
        year: createSingularPluralStrings(
            loc(yearSingularLowercase),
            loc(yearFirstPluralLowercase),
            loc(yearSecondGenitivePluralLowercase)
        ),
        month: createSingularPluralStrings(
            loc(monthSingularLowercase),
            loc(monthFirstPluralLowercase),
            loc(monthSecondGenitivePluralLowercase)
        ),
        week: createSingularPluralStrings(
            loc(weekSingularLowercase),
            loc(weekFirstPluralLowercase),
            loc(weekSecondGenitivePluralLowercase)
        ),
        day: createSingularPluralStrings(
            loc(daySingularLowercase),
            loc(dayFirstPluralLowercase),
            loc(daySecondGenitivePluralLowercase)
        ),
        hour: createSingularPluralStrings(
            loc(hourSingularLowercase),
            loc(hourFirstPluralLowercase),
            loc(hourSecondGenitivePluralLowercase)
        ),
        minute: createSingularPluralStrings(
            loc(minuteSingularLowercase),
            loc(minuteFirstPluralLowercase),
            loc(minuteSecondGenitivePluralLowercase)
        ),
        second: createSingularPluralStrings(
            loc(secondSingularLowercase),
            loc(secondFirstPluralLowercase),
            loc(secondSecondGenitivePluralLowercase)
        ),
    };
}
