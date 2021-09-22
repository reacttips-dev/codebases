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
import {
    goToPreviousMonthStringLowerCaseText,
    goToNextMonthStringLowerCaseText,
    goToPreviousYearStringLowerCaseText,
    goToNextYearStringLowerCaseText,
    goToPreviousYearRangeStringLowerCaseText,
    goToNextYearRangeStringLowerCaseText,
    calendarDayOfWeek_Su,
    calendarDayOfWeek_Mo,
    calendarDayOfWeek_Tu,
    calendarDayOfWeek_We,
    calendarDayOfWeek_Th,
    calendarDayOfWeek_Fr,
    calendarDayOfWeek_Sa,
    monthPickerHeaderAriaLabel,
    yearPickerHeaderAriaLabel,
    weekNumberFormatString,
    selectedDateFormatString,
    todayDateFormatString,
    dayMarkedAriaLabel,
} from './getCalendarStrings.locstring.json';
import { goToTodayStringLowerCaseText } from 'owa-locstrings/lib/strings/gototodaystringlowercasetext.locstring.json';
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
import loc from 'owa-localize';
import { computed } from 'mobx';
import type { ICalendarStrings } from '@fluentui/react';

export default () => computedCalendarStrings.get();

const computedCalendarStrings = computed(
    (): ICalendarStrings => ({
        months: [
            loc(calendarMonth_January),
            loc(calendarMonth_February),
            loc(calendarMonth_March),
            loc(calendarMonth_April),
            loc(calendarMonth_May),
            loc(calendarMonth_June),
            loc(calendarMonth_July),
            loc(calendarMonth_August),
            loc(calendarMonth_September),
            loc(calendarMonth_October),
            loc(calendarMonth_November),
            loc(calendarMonth_December),
        ],
        shortMonths: [
            loc(januaryAbbreviatedLowercase),
            loc(februaryAbbreviatedLowercase),
            loc(marchAbbreviatedLowercase),
            loc(aprilAbbreviatedLowercase),
            loc(mayAbbreviatedLowercase),
            loc(juneAbbreviatedLowercase),
            loc(julyAbbreviatedLowercase),
            loc(augustAbbreviatedLowercase),
            loc(septemberAbbreviatedLowercase),
            loc(octoberAbbreviatedLowercase),
            loc(novemberAbbreviatedLowercase),
            loc(decemberAbbreviatedLowercase),
        ],
        days: [
            loc(calendarDayOfWeek_Sunday),
            loc(calendarDayOfWeek_Monday),
            loc(calendarDayOfWeek_Tuesday),
            loc(calendarDayOfWeek_Wednesday),
            loc(calendarDayOfWeek_Thursday),
            loc(calendarDayOfWeek_Friday),
            loc(calendarDayOfWeek_Saturday),
        ],
        shortDays: [
            loc(calendarDayOfWeek_Su),
            loc(calendarDayOfWeek_Mo),
            loc(calendarDayOfWeek_Tu),
            loc(calendarDayOfWeek_We),
            loc(calendarDayOfWeek_Th),
            loc(calendarDayOfWeek_Fr),
            loc(calendarDayOfWeek_Sa),
        ],
        goToToday: loc(goToTodayStringLowerCaseText),
        prevMonthAriaLabel: loc(goToPreviousMonthStringLowerCaseText),
        nextMonthAriaLabel: loc(goToNextMonthStringLowerCaseText),
        prevYearAriaLabel: loc(goToPreviousYearStringLowerCaseText),
        nextYearAriaLabel: loc(goToNextYearStringLowerCaseText),
        prevYearRangeAriaLabel: loc(goToPreviousYearRangeStringLowerCaseText),
        nextYearRangeAriaLabel: loc(goToNextYearRangeStringLowerCaseText),
        monthPickerHeaderAriaLabel: loc(monthPickerHeaderAriaLabel),
        yearPickerHeaderAriaLabel: loc(yearPickerHeaderAriaLabel),
        weekNumberFormatString: loc(weekNumberFormatString),
        selectedDateFormatString: loc(selectedDateFormatString),
        todayDateFormatString: loc(todayDateFormatString),
        dayMarkedAriaLabel: loc(dayMarkedAriaLabel),
    })
);
