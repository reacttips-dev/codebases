import {
    getDate,
    getDay,
    getHours,
    getMilliseconds,
    getMinutes,
    getMonth,
    getSeconds,
    getYear,
    getTimestamp,
} from '../owaDate/getFields';
import type { OwaDate } from '../schema';
import formatDateStrings from './formatDateStrings';

/** Formats a date according to an OWA-style format string. */
export default function formatDate(date: OwaDate, format: string, strings = formatDateStrings()) {
    if (date == void 0) {
        throw TypeError(`Invalid Date (${date})`);
    }

    if (isNaN(getTimestamp(date))) {
        throw TypeError('Invalid Date (NaN)');
    }

    if (format == void 0) {
        throw TypeError(`Invalid Format (${format})`);
    }

    return format.replace(tokens, token => {
        const fn = tokenFns[token];
        return fn ? fn(date, strings, format) : token.slice(1, token.length - 1);
    });
}

type Strings = ReturnType<typeof formatDateStrings>;

const d = getDate;
const dd = pad(d);
const ddd = (date: OwaDate, s: Strings) => s.ddd[getDay(date)];
const dddd = (date: OwaDate, s: Strings) => s.dddd[getDay(date)];
const M = (date: OwaDate) => getMonth(date) + 1;
const MM = pad(M);
const MMM = (date: OwaDate, s: Strings) => s.MMM[getMonth(date)];
const yy = (date: OwaDate) => getYear(date) % 100;
const yyyy = getYear;
const h = (date: OwaDate) => getHours(date) % 12 || 12;
const hh = pad(h);
const H = getHours;
const HH = pad(H);
const m = getMinutes;
const mm = pad(m);
const s = getSeconds;
const ss = pad(s);
const l = pad(getMilliseconds, 3);
const amPm = (date: OwaDate, s: string[]) => s[getHours(date) < 12 ? 0 : 1];
const t = (date: OwaDate, s: Strings) => amPm(date, s.AP);
const tt = (date: OwaDate, s: Strings) => amPm(date, s.AMPM);
const T = (date: OwaDate, s: Strings) => amPm(date, s.ap);
const TT = (date: OwaDate, s: Strings) => amPm(date, s.ampm);

function pad(fn: typeof getDate, len: number = 2) {
    return (date: OwaDate) => {
        var str = String(fn(date));
        while (str.length < len) {
            str = '0' + str;
        }
        return str;
    };
}

function MMMM(date: OwaDate, s: Strings, format: string) {
    let monthNames = s.MMMM;

    // If the standalone and usual month names are different (more than just case) then we need
    // to decide which one we want to use; this depends on which fields are asked for in the format string.
    if (s.MMMM[0].toLowerCase() != s.standaloneMMMM[0].toLowerCase()) {
        let day = false;
        let year = false;

        // Detect which tokens are present in the given format string.
        format.replace(tokens, token => {
            day = day || token == 'd' || token == 'dd';
            year = year || token == 'yy' || token == 'yyyy';
            return '';
        });

        // This feels a little bit hacky, but it is small and self-contained enough to get us by
        // without adding extra dependencies (like having to ask for the user's culture or adding extra strings).
        // If the number of rules grows (which should not, as far as I can tell) then we can revisit this.
        // See this GIST https://gist.github.com/fpintos/827b369da5bd7f268939c54cf259cb87/ for more info
        // on how I came up with these rules.
        const isSimplifiedChinese = s.MMMM[0] == '1 月' && s.standaloneMMMM[0] == '一月';

        if (isSimplifiedChinese) {
            // When Simplified Chinese (zh-Hans) has the strings corrected, use standalone name ONLY when just month is requested. Ex:
            // | locale  | MMMM[0] | standaloneMMMM[0] | ex: month only | ex: month+year  | ex: day+month | ex: day+month+year  |
            // | zh-Hans | 1 月    | 一月               | 一月           | 2018 年 1 月    | 1 月 1 日     | 2018 年 1 月 1 日   |
            monthNames = day || year ? s.MMMM : s.standaloneMMMM;
        } else {
            // General Rule, use standalone name if only-Month or Month+Year are specified. If day is requested, use MMMM. Ex:
            // | locale | MMMM[0]    | standaloneMMMM[0] | ex: month only | ex: month+year    | ex: day+month  | ex: day+month+year     |
            // | cs     | ledna      | leden             | leden          | leden 2018        | 1. ledna       | 1. ledna 2018          |
            // | el     | Ιανουαρίου | Ιανουάριος        | Ιανουάριος     | Ιανουάριος 2018   | 1 Ιανουαρίου   | 1 Ιανουαρίου 2018      |
            // Note that Intl API seems to format the month-only version in Greek incorrectly, returning Ιανουαρίου (as of 2019-03).
            monthNames = day ? s.MMMM : s.standaloneMMMM;
        }
    }

    return monthNames[getMonth(date)];
}

const tokens = /d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|l|"[^"]*"|'[^']*'/g;
const tokenFns = {
    d,
    dd,
    ddd,
    dddd,
    M,
    MM,
    MMM,
    MMMM,
    yy,
    yyyy,
    h,
    hh,
    H,
    HH,
    m,
    mm,
    s,
    ss,
    l,
    t,
    tt,
    T,
    TT,
};
