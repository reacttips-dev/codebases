import moment, { Duration } from 'moment';
import duration from './duration';
import { SupportedLocales } from './supportedLocales';

/**
 * We have a custom duration humanization, different from Moment's. E.g.
 * - 1h 02m
 * - 3 min
 * - 4 sec
 *
 * @return {string} human readable form of estimated time required for learning
 */
export default function humanizeLearningTime(
  locale: SupportedLocales = 'en',
  inputMilliseconds: Duration | number,
  displayFullUnit?: boolean
): string {
  const momentDuration = moment.duration(inputMilliseconds);
  const seconds = momentDuration.seconds();
  const minutes = momentDuration.minutes();
  const hours = momentDuration.hours() + momentDuration.days() * 24;
  const totalDays = momentDuration.asDays();

  let milliseconds = 0;

  // pull milliseconds out of a moment.duration;
  if (typeof inputMilliseconds === 'number') {
    milliseconds = inputMilliseconds;
  } else if (inputMilliseconds && '_milliseconds' in inputMilliseconds) {
    // @ts-expect-error TODO: _milliseconds property does not exist in moment.Duration
    milliseconds = inputMilliseconds._milliseconds;
  } else {
    milliseconds = 0; // fallback to 0 in case of unexpected input
  }

  let result = '';

  /**
   *  momentDuration.days() does not work for durations over 30 days
   *  it will return the days over the month/year unit
   *  for simplicity, we will use days for any duration over 7 days instead of displaying hours
   */
  if (totalDays > 7) {
    if (displayFullUnit) {
      result = duration(milliseconds, 'ddd', locale);
    } else {
      result = duration(milliseconds, 'dd', locale);
    }
  } else if (hours && minutes) {
    if (displayFullUnit) {
      result = duration(milliseconds, 'hhh:mmm', locale);
    } else {
      result = duration(milliseconds, 'h:m', locale);
    }
  } else if (hours) {
    if (displayFullUnit) {
      result = duration(milliseconds, 'hhh', locale);
    } else {
      result = duration(milliseconds, 'h', locale);
    }
  } else if (minutes) {
    if (displayFullUnit) {
      result = duration(milliseconds, 'mmm', locale);
    } else {
      result = duration(milliseconds, 'mm', locale);
    }
  } else if (seconds !== 0) {
    if (displayFullUnit) {
      result = duration(milliseconds, 'sss', locale);
    } else {
      result = duration(milliseconds, 'ss', locale);
    }
  }
  return result;
}
