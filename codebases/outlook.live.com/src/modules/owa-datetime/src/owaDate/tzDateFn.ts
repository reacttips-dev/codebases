import tz from './tz';

/**
 * Produces a time zone aware wrapper around a UTC-modification function
 * that operates on date values, ie, years, months, weeks and days.
 */
export default (fn: (time: number, amount: number) => Date) => tz(fn, false);
