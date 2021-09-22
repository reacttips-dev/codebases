import { initializeTranslationsWithFunc, OwaDateTimeLocalizedStringResourceId } from 'owa-datetime';
import loc from 'owa-localize';
import strings from './strings.locstring.json';
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

import { decemberAbbreviatedLowercase } from 'owa-locstrings/lib/strings/decemberabbreviatedlowercase.locstring.json';
import { novemberAbbreviatedLowercase } from 'owa-locstrings/lib/strings/novemberabbreviatedlowercase.locstring.json';
import { octoberAbbreviatedLowercase } from 'owa-locstrings/lib/strings/octoberabbreviatedlowercase.locstring.json';
import { septemberAbbreviatedLowercase } from 'owa-locstrings/lib/strings/septemberabbreviatedlowercase.locstring.json';
import { augustAbbreviatedLowercase } from 'owa-locstrings/lib/strings/augustabbreviatedlowercase.locstring.json';
import { julyAbbreviatedLowercase } from 'owa-locstrings/lib/strings/julyabbreviatedlowercase.locstring.json';
import { juneAbbreviatedLowercase } from 'owa-locstrings/lib/strings/juneabbreviatedlowercase.locstring.json';
import { mayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/mayabbreviatedlowercase.locstring.json';
import { aprilAbbreviatedLowercase } from 'owa-locstrings/lib/strings/aprilabbreviatedlowercase.locstring.json';
import { marchAbbreviatedLowercase } from 'owa-locstrings/lib/strings/marchabbreviatedlowercase.locstring.json';
import { februaryAbbreviatedLowercase } from 'owa-locstrings/lib/strings/februaryabbreviatedlowercase.locstring.json';
import { januaryAbbreviatedLowercase } from 'owa-locstrings/lib/strings/januaryabbreviatedlowercase.locstring.json';

import { decemberUppercase } from 'owa-locstrings/lib/strings/decemberuppercase.locstring.json';
import { novemberUppercase } from 'owa-locstrings/lib/strings/novemberuppercase.locstring.json';
import { octoberUppercase } from 'owa-locstrings/lib/strings/octoberuppercase.locstring.json';
import { septemberUppercase } from 'owa-locstrings/lib/strings/septemberuppercase.locstring.json';
import { augustUppercase } from 'owa-locstrings/lib/strings/augustuppercase.locstring.json';
import { julyUppercase } from 'owa-locstrings/lib/strings/julyuppercase.locstring.json';
import { juneUppercase } from 'owa-locstrings/lib/strings/juneuppercase.locstring.json';
import { mayUppercase } from 'owa-locstrings/lib/strings/mayuppercase.locstring.json';
import { aprilUppercase } from 'owa-locstrings/lib/strings/apriluppercase.locstring.json';
import { marchUppercase } from 'owa-locstrings/lib/strings/marchuppercase.locstring.json';
import { februaryUppercase } from 'owa-locstrings/lib/strings/februaryuppercase.locstring.json';
import { januaryUppercase } from 'owa-locstrings/lib/strings/januaryuppercase.locstring.json';

import { saturdayUppercase } from 'owa-locstrings/lib/strings/saturdayuppercase.locstring.json';
import { fridayUppercase } from 'owa-locstrings/lib/strings/fridayuppercase.locstring.json';
import { thursdayUppercase } from 'owa-locstrings/lib/strings/thursdayuppercase.locstring.json';
import { wednesdayUppercase } from 'owa-locstrings/lib/strings/wednesdayuppercase.locstring.json';
import { tuesdayUppercase } from 'owa-locstrings/lib/strings/tuesdayuppercase.locstring.json';
import { mondayUppercase } from 'owa-locstrings/lib/strings/mondayuppercase.locstring.json';
import { sundayUppercase } from 'owa-locstrings/lib/strings/sundayuppercase.locstring.json';
import { saturdayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/saturdayabbreviatedlowercase.locstring.json';
import { fridayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/fridayabbreviatedlowercase.locstring.json';
import { thursdayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/thursdayabbreviatedlowercase.locstring.json';
import { wednesdayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/wednesdayabbreviatedlowercase.locstring.json';
import { tuesdayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/tuesdayabbreviatedlowercase.locstring.json';
import { mondayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/mondayabbreviatedlowercase.locstring.json';
import { sundayAbbreviatedLowercase } from 'owa-locstrings/lib/strings/sundayabbreviatedlowercase.locstring.json';

import { weekDayDateFormat } from 'owa-locstrings/lib/strings/weekdaydateformat.locstring.json';

const stringLookup: Record<OwaDateTimeLocalizedStringResourceId, string> = {
    ...strings,
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

    decemberAbbreviatedLowercase,
    novemberAbbreviatedLowercase,
    octoberAbbreviatedLowercase,
    septemberAbbreviatedLowercase,
    augustAbbreviatedLowercase,
    julyAbbreviatedLowercase,
    juneAbbreviatedLowercase,
    mayAbbreviatedLowercase,
    aprilAbbreviatedLowercase,
    marchAbbreviatedLowercase,
    februaryAbbreviatedLowercase,
    januaryAbbreviatedLowercase,

    decemberUppercase,
    novemberUppercase,
    octoberUppercase,
    septemberUppercase,
    augustUppercase,
    julyUppercase,
    juneUppercase,
    mayUppercase,
    aprilUppercase,
    marchUppercase,
    februaryUppercase,
    januaryUppercase,

    saturdayUppercase,
    fridayUppercase,
    thursdayUppercase,
    wednesdayUppercase,
    tuesdayUppercase,
    mondayUppercase,
    sundayUppercase,
    saturdayAbbreviatedLowercase,
    fridayAbbreviatedLowercase,
    thursdayAbbreviatedLowercase,
    wednesdayAbbreviatedLowercase,
    tuesdayAbbreviatedLowercase,
    mondayAbbreviatedLowercase,
    sundayAbbreviatedLowercase,

    weekDayDateFormat,
};

function owaDateTimeLocalizer(resourceId: OwaDateTimeLocalizedStringResourceId): string {
    return loc(stringLookup[resourceId]);
}

export function initializeOwaDateTimeTranslations(): void {
    initializeTranslationsWithFunc(owaDateTimeLocalizer);
}
