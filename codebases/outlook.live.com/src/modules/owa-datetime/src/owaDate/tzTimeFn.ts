import tz from './tz';

/**
 * Produces a time zone aware wrapper around a UTC-modification function
 * that operates on time values, ie, hours, minutes, seconds and milliseconds.
 */
export default (fn: (time: number, amount: number) => Date) => tz(fn, true);
