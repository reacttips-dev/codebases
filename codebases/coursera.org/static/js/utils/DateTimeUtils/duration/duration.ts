import { _pluralize } from './_pluralize';
import _i18nLocaleMap from './locales';
import {
  formatObjType,
  Duration,
  TimeFormat,
  LocaleDataSet,
  TimeFormatsDays,
  TimeFormatsHours,
  TimeFormatsMinutes,
  TimeFormatsSeconds,
  LocaleDataSetDays,
  LocaleDataSetHours,
  LocaleDataSetMinutes,
  LocaleDataSetSeconds,
} from './types';
import { SupportedLocales } from '../supportedLocales';

function parseFormat(format: string | undefined): formatObjType {
  const result: formatObjType = {};

  if (format !== undefined && typeof format === 'string') {
    const groups = format.split(':');

    for (let i = 0; i < groups.length; i += 1) {
      switch (groups[i]) {
        case 'd':
          result.day = 'dmicro';
          result.days = 'ddmicro';
          break;
        case 'dd':
          result.day = 'dmid';
          result.days = 'ddmid';
          break;
        case 'ddd':
          result.day = 'd';
          result.days = 'dd';
          break;

        case 'h':
          result.hour = 'hmicro';
          result.hours = 'hhmicro';
          break;
        case 'hh':
          result.hour = 'hmid';
          result.hours = 'hhmid';
          break;
        case 'hhh':
          result.hour = 'h';
          result.hours = 'hh';
          break;
        case 'm':
          result.minute = 'mmicro';
          result.minutes = 'mmmicro';
          break;
        case 'mm':
          result.minute = 'mmid';
          result.minutes = 'mmmid';
          break;
        case 'mmm':
          result.minute = 'm';
          result.minutes = 'mm';
          break;
        case 's':
          result.second = 'smicro';
          result.seconds = 'ssmicro';
          break;
        case 'ss':
          result.second = 'smid';
          result.seconds = 'ssmid';
          break;
        case 'sss':
          result.second = 's';
          result.seconds = 'ss';
          break;
        default:
      }
    }
  }
  return result;
}

const DAYS_MILLISECONDS = 86400000;
const HOURS_MILLISECONDS = 3600000;
const MINUTES_MILLISECONDS = 60000;
const SECONDS_MILLISECONDS = 1000;

function timeCalcGeneric(constantTimeUnit: number, milliseconds: number): number {
  return Math.floor(milliseconds / constantTimeUnit);
}
const millisecondsToDays = timeCalcGeneric.bind(null, DAYS_MILLISECONDS);
const millisecondsToHours = timeCalcGeneric.bind(null, HOURS_MILLISECONDS);
const millisecondsToMinutes = timeCalcGeneric.bind(null, MINUTES_MILLISECONDS);
const millisecondsToSeconds = timeCalcGeneric.bind(null, SECONDS_MILLISECONDS);

function millisecondsToTimeObject(milliseconds: number, formatObj: formatObjType): Duration {
  let remaining = milliseconds;
  const durationObj: Duration = {};

  if (formatObj.days && remaining >= DAYS_MILLISECONDS) {
    const days = millisecondsToDays(remaining);
    if (days >= 1) {
      remaining -= days * DAYS_MILLISECONDS;
      durationObj.days = days;
    }
  }

  if (formatObj.hours && remaining >= HOURS_MILLISECONDS) {
    const hours = millisecondsToHours(remaining);
    if (hours >= 1) {
      remaining -= hours * HOURS_MILLISECONDS;
      durationObj.hours = hours;
    }
  }

  if (formatObj.minutes) {
    const minutes = millisecondsToMinutes(remaining);
    if (minutes >= 1) {
      remaining -= minutes * MINUTES_MILLISECONDS;
      durationObj.minutes = minutes;
    }
  }

  if (formatObj.seconds) {
    const seconds = millisecondsToSeconds(remaining);
    if (seconds > 0) {
      durationObj.seconds = seconds;
    }
  }

  return durationObj;
}

function getLocale(key: SupportedLocales, localeMap: Record<SupportedLocales, LocaleDataSet>): LocaleDataSet {
  let result: LocaleDataSet;
  if (key in localeMap) {
    result = localeMap[key];
  }
  // TODO: code and types are inconsistent here. According to types, result is always defined, but according to the
  // code it can be undefined.
  // @ts-expect-error
  return result;
}

function localeDataSetTimeUnit(timeUnit: keyof LocaleDataSet, dataset: LocaleDataSet) {
  return dataset[timeUnit];
}

function daysFormat(dataset: LocaleDataSet, formatKey: TimeFormatsDays): TimeFormat | null {
  const timeUnitDataset = localeDataSetTimeUnit('days', dataset) as LocaleDataSetDays;
  return timeUnitDataset[formatKey];
}

function hoursFormat(dataset: LocaleDataSet, formatKey: TimeFormatsHours): TimeFormat | null {
  const timeUnitDataset = localeDataSetTimeUnit('hours', dataset) as LocaleDataSetHours;
  return timeUnitDataset[formatKey];
}

function minutesFormat(dataset: LocaleDataSet, formatKey: TimeFormatsMinutes): TimeFormat | null {
  const timeUnitDataset = localeDataSetTimeUnit('minutes', dataset) as LocaleDataSetMinutes;
  return timeUnitDataset[formatKey];
}

function secondsFormat(dataset: LocaleDataSet, formatKey: TimeFormatsSeconds): TimeFormat | null {
  const timeUnitDataset = localeDataSetTimeUnit('seconds', dataset) as LocaleDataSetSeconds;
  return timeUnitDataset[formatKey];
}

function pluralizedTime(value: number, format: TimeFormat): string {
  const pluralizedFormat = _pluralize<string, string>(value, format[0], format[1]);
  return pluralizedFormat.replace('%d', String(value));
}

function humanize(localeObj: LocaleDataSet, durationObj: Duration, formatArray: string[]): string {
  const result: string[] = [];

  for (let i = 0; i < formatArray.length; i += 1) {
    const testFormat: string = formatArray[i];
    let currentFormat: TimeFormat | null = null;

    let timeValue = 0;
    const isLastItemWithNoResults = i === formatArray.length - 1 && result.length === 0;
    if (/dd?d?/.test(formatArray[i]) && (durationObj.days || isLastItemWithNoResults)) {
      if (testFormat === 'd' || testFormat === 'dd' || testFormat === 'ddd') {
        currentFormat = daysFormat(localeObj, testFormat);
        timeValue = durationObj.days || 0;
      }
    } else if (/hh?h?/.test(formatArray[i]) && (durationObj.hours || isLastItemWithNoResults)) {
      if (testFormat === 'h' || testFormat === 'hh' || testFormat === 'hhh') {
        currentFormat = hoursFormat(localeObj, testFormat);
        timeValue = durationObj.hours || 0;
      }
    } else if (/mm?m?/.test(formatArray[i]) && (durationObj.minutes || isLastItemWithNoResults)) {
      if (testFormat === 'm' || testFormat === 'mm' || testFormat === 'mmm') {
        currentFormat = minutesFormat(localeObj, testFormat);
        timeValue = durationObj.minutes || 0;
      }
    } else if (/ss?s?/.test(formatArray[i]) && (durationObj.seconds || isLastItemWithNoResults)) {
      if (testFormat === 's' || testFormat === 'ss' || testFormat === 'sss') {
        currentFormat = secondsFormat(localeObj, testFormat);
        timeValue = durationObj.seconds || 0;
      }
    }
    if (currentFormat) {
      result.push(pluralizedTime(timeValue, currentFormat));
    }
  }

  return result.join(' ');
}

export default function duration(
  time: number | Duration,
  formatString: string,
  locale: SupportedLocales = 'en'
): string {
  let availableLocale = locale;
  if (!(locale in _i18nLocaleMap)) {
    availableLocale = 'en';
  }

  const formatArray: string[] = formatString.split(':');
  let durationObj: Duration;

  if (typeof time === 'number') {
    durationObj = millisecondsToTimeObject(time, parseFormat(formatString));
  } else {
    durationObj = time;
  }

  const localeObj = getLocale(availableLocale, _i18nLocaleMap);

  return humanize(localeObj, durationObj, formatArray);
}

duration.locale = (locale: SupportedLocales) => {
  return (time: number, formatString: string) => duration(time, formatString, locale);
};

export const internal = {
  parseFormat,
  millisecondsToTimeObject,
};
