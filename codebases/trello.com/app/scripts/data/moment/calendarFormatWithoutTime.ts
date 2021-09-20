import moment from 'moment';
import makeYearAwareCalendar from './make-year-aware-calendar';

/**
 * For the start date badge on the card front, we want to show the date without the time portion.
 * E.g. "Apr 4" or "tomorrow".
 * To do this, we create an alternative calendar format for each language, for moment to use
 * when we want to render a date without the time.
 * 
 * For the most part, the format is a modified version of the existing `calendar` formats
 * that are already present in each locale file.
 * 
 * Translations were verified by the Atlassian Product Team.
 * See: https://hello.atlassian.net/wiki/spaces/~jlo/pages/1084110636/Localization+of+Calendar+Date+Format+Without+Time
 * 
 * Notes: All langauges support the "lastDay", "sameDay", and "nextDay" relative formats.
 * But only SOME support "nextWeek" and "lastWeek" relative formats. The rest that don't simply use "llll".
 */

type calendarFormatWithoutTimeType = {
  [key: string]: moment.CalendarSpec,
}

// from hu.js
const huWeekEndings = [
  'vasárnap',
  'hétfőn',
  'kedden',
  'szerdán',
  'csütörtökön',
  'pénteken',
  'szombaton',
];

// from hu.js
function huWeek(isFuture: boolean) {
  return `${isFuture ? '' : '[múlt] '}[${huWeekEndings[this.day()]}]`;
}

const englishFormat = makeYearAwareCalendar({
  lastDay: '[yesterday]',
  sameDay: '[today]',
  nextDay: '[tomorrow]',
  lastWeek: 'llll',
  nextWeek: 'llll',
  sameYear: 'llll',
  sameElse: 'll',
});

const frenchFormat = makeYearAwareCalendar({
  lastDay: '[Hier]',
  sameDay: "[Aujourd'hui]",
  nextDay: '[Demain]',
  lastWeek: 'dddd [dernier]',
  nextWeek: 'dddd',
  sameYear: 'llll',
  sameElse: 'll',
});

export const calendarFormatWithoutTime: calendarFormatWithoutTimeType = {
  'cs': makeYearAwareCalendar({
    lastDay: '[včera]',
    sameDay: '[dnes]',
    nextDay: '[zítra]',
    lastWeek() {
      switch (this.day()) {
        case 0:
          return '[minulou neděli]';
        case 1:
        case 2:
          return '[minulé] dddd';
        case 3:
          return '[minulou středu]';
        case 4:
        case 5:
          return '[minulý] dddd';
        case 6:
          return '[minulou sobotu]';
        default:
          return '';
      }
    },
    nextWeek() {
      switch (this.day()) {
        case 0:
          return '[neděle]';
        case 1:
        case 2:
          return 'dddd';
        case 3:
          return '[středa]';
        case 4:
          return '[čtvrtek]';
        case 5:
          return '[pátek]';
        case 6:
          return '[sobota]';
        default:
          return '';
      }
    },
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'de': makeYearAwareCalendar({
    lastDay: '[Gestern]',
    sameDay: '[Heute]',
    nextDay: '[Morgen]',
    lastWeek: 'llll',
    nextWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'en-US': englishFormat,
  'en-GB': englishFormat,
  'en-AU': englishFormat,
  'es': makeYearAwareCalendar({
    lastDay: `[ayer]`,
    sameDay: `[hoy]`,
    nextDay: `[mañana]`,
    lastWeek: 'llll',
    nextWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'fi': makeYearAwareCalendar({
    lastDay: '[eilen]',
    sameDay: '[tänään]',
    nextDay: '[huomenna]',
    lastWeek: '[viime] dddd[na]',
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'fr-CA': frenchFormat,
  'fr': frenchFormat,
  'hu': makeYearAwareCalendar({
    lastDay: '[tegnap]',
    sameDay: '[ma]',
    nextDay: '[holnap]',
    lastWeek() {
      return huWeek.call(this, false);
    },
    nextWeek() {
      return huWeek.call(this, true);
    },
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'it': makeYearAwareCalendar({
    lastDay: '[Ieri]',
    sameDay: '[Oggi]',
    nextDay: '[Domani]',
    lastWeek() {
      switch (this.day()) {
        case 0:
          return '[la scorsa] dddd';
        default:
          return '[lo scorso] dddd';
      }
    },
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'ja': makeYearAwareCalendar({
    lastDay: '[昨日]',
    sameDay: '[今日]',
    nextDay: '[明日]',
    lastWeek: 'llll',
    nextWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'nb': makeYearAwareCalendar({
    lastDay: '[i går]',
    sameDay: '[i dag]',
    nextDay: '[i morgen]',
    lastWeek: '[forrige] dddd',
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'nl': makeYearAwareCalendar({
    lastDay: '[gisteren]',
    sameDay: '[vandaag]',
    nextDay: '[morgen]',
    lastWeek: '[afgelopen] dddd',
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'pl': makeYearAwareCalendar({
    lastDay: '[Wczoraj]',
    sameDay: '[Dziś]',
    nextDay: '[Jutro]',
    lastWeek() {
      switch (this.day()) {
        case 0:
          return '[Zeszłą niedzielę]';
        case 3:
          return '[Zeszłą środę]';
        case 6:
          return '[Zeszłą sobotę]';
        default:
          return '[Zeszły] dddd';
      }
    },
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'pt-BR': makeYearAwareCalendar({
    sameDay: '[Hoje]',
    nextDay: '[Amanhã]',
    lastDay: '[Ontem]',
    nextWeek: 'llll',
    lastWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'ru': makeYearAwareCalendar({
    lastDay: '[Вчера]',
    sameDay: '[Сегодня]',
    nextDay: '[Завтра]',
    lastWeek(now: moment.Moment) {
      if (now.week() !== this.week()) {
        switch (this.day()) {
          case 0:
            return '[В прошлое] dddd';
          case 1:
          case 2:
          case 4:
            return '[В прошлый] dddd';
          case 3:
          case 5:
          case 6:
            return '[В прошлую] dddd';
          default:
            return '';
        }
      } else {
        if (this.day() === 2) {
          return '[Во] dddd';
        } else {
          return '[В] dddd';
        }
      }
    },
    nextWeek() {
      return this.day() === 2 ? '[Во] dddd' : '[В] dddd';
    },
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'sv': makeYearAwareCalendar({
    lastDay: '[Igår]',
    sameDay: '[Idag]',
    nextDay: '[Imorgon]',
    lastWeek: '[I] dddd[s]',
    nextWeek: '[På] dddd',
    sameYear: '[Den] llll',
    sameElse: '[Den] ll',
  }),
  'th': makeYearAwareCalendar({
    lastDay: '[เมื่อวานนี้]',
    sameDay: '[วันนี้]',
    nextDay: '[พรุ่งนี้]',
    lastWeek: '[วัน]dddd',
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'tr': makeYearAwareCalendar({
    lastDay: '[dün]',
    sameDay: '[bugün]',
    nextDay: '[yarın]',
    lastWeek: '[geçen hafta] dddd',
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'uk': makeYearAwareCalendar({
    lastDay: '[Вчора]',
    sameDay: '[Сьогодні]',
    nextDay: '[Завтра]',
    lastWeek() {
      switch (this.day()) {
        case 0:
        case 3:
        case 5:
        case 6:
          return '[Минулої] dddd';
        case 1:
        case 2:
        case 4:
          return '[Минулого] dddd';
        default:
          return;
      }
    },
    nextWeek: 'dddd',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'vi': makeYearAwareCalendar({
    lastDay: '[Hôm qua]',
    sameDay: '[Hôm nay]',
    nextDay: '[Ngày mai]',
    lastWeek: 'dddd [tuần rồi]',
    nextWeek: 'dddd [tuần tới]',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'zh-Hans': makeYearAwareCalendar({
    lastDay: '昨天',
    sameDay: '今天',
    nextDay: '明天',
    lastWeek: 'llll',
    nextWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
  'zh-Hant': makeYearAwareCalendar({
    lastDay: '[昨天]',
    sameDay: '[今天]',
    nextDay: '[明天]',
    lastWeek: 'llll',
    nextWeek: 'llll',
    sameYear: 'llll',
    sameElse: 'll',
  }),
};
