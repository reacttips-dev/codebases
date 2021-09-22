import {
    initializeTranslationsWithFunc,
    OwaTimeformatLocalizedStringResourceId,
} from 'owa-timeformat/lib/localization/getLocalizedString';
import loc from 'owa-localize';
import strings from './strings.locstring.json';
import { multiDayAllDayFormatString } from 'owa-locstrings/lib/strings/multidayalldayformatstring.locstring.json';
import { timeSpanFormatString } from 'owa-locstrings/lib/strings/timespanformatstring.locstring.json';
import { calendarDayOfWeek_Saturday } from 'owa-locstrings/lib/strings/calendardayofweek_saturday.locstring.json';
import { calendarDayOfWeek_Friday } from 'owa-locstrings/lib/strings/calendardayofweek_friday.locstring.json';
import { calendarDayOfWeek_Thursday } from 'owa-locstrings/lib/strings/calendardayofweek_thursday.locstring.json';
import { calendarDayOfWeek_Wednesday } from 'owa-locstrings/lib/strings/calendardayofweek_wednesday.locstring.json';
import { calendarDayOfWeek_Tuesday } from 'owa-locstrings/lib/strings/calendardayofweek_tuesday.locstring.json';
import { calendarDayOfWeek_Monday } from 'owa-locstrings/lib/strings/calendardayofweek_monday.locstring.json';
import { calendarDayOfWeek_Sunday } from 'owa-locstrings/lib/strings/calendardayofweek_sunday.locstring.json';
import { calendarMonth_December } from 'owa-locstrings/lib/strings/calendarmonth_december.locstring.json';
import { calendarMonth_November } from 'owa-locstrings/lib/strings/calendarmonth_november.locstring.json';
import { calendarMonth_October } from 'owa-locstrings/lib/strings/calendarmonth_october.locstring.json';
import { calendarMonth_September } from 'owa-locstrings/lib/strings/calendarmonth_september.locstring.json';
import { calendarMonth_August } from 'owa-locstrings/lib/strings/calendarmonth_august.locstring.json';
import { calendarMonth_July } from 'owa-locstrings/lib/strings/calendarmonth_july.locstring.json';
import { calendarMonth_June } from 'owa-locstrings/lib/strings/calendarmonth_june.locstring.json';
import { calendarMonth_May } from 'owa-locstrings/lib/strings/calendarmonth_may.locstring.json';
import { calendarMonth_April } from 'owa-locstrings/lib/strings/calendarmonth_april.locstring.json';
import { calendarMonth_March } from 'owa-locstrings/lib/strings/calendarmonth_march.locstring.json';
import { calendarMonth_February } from 'owa-locstrings/lib/strings/calendarmonth_february.locstring.json';
import { calendarMonth_January } from 'owa-locstrings/lib/strings/calendarmonth_january.locstring.json';

const stringLookup: Record<OwaTimeformatLocalizedStringResourceId, string> = {
    ...strings,
    multiDayAllDayFormatString,
    timeSpanFormatString,
    calendarDayOfWeek_Saturday,
    calendarDayOfWeek_Friday,
    calendarDayOfWeek_Thursday,
    calendarDayOfWeek_Wednesday,
    calendarDayOfWeek_Tuesday,
    calendarDayOfWeek_Monday,
    calendarDayOfWeek_Sunday,
    calendarMonth_December,
    calendarMonth_November,
    calendarMonth_October,
    calendarMonth_September,
    calendarMonth_August,
    calendarMonth_July,
    calendarMonth_June,
    calendarMonth_May,
    calendarMonth_April,
    calendarMonth_March,
    calendarMonth_February,
    calendarMonth_January,
};

function owaTimeformatLocalizer(resourceId: OwaTimeformatLocalizedStringResourceId): string {
    return loc(stringLookup[resourceId]);
}

export function initializeOwaTimeFormatTranslations(): void {
    initializeTranslationsWithFunc(owaTimeformatLocalizer);
}
