import { userDate } from '../owaDate/owaDate';

/**
 * Adapter to convert a JavaScript's Date object to
 * an OwaDate in the user's current time zone.
 *
 * The values of the local fields are preserved,
 * unless they represent a time that does not exist in
 * the user's time zone.
 *
 * This should only be used when bridging time-zone aware
 * OWA components with non-OWA components that only work
 * with JavaScript's Date object.
 *
 * Usage of this function must be extremely limited.
 */
export default (date: Date | null | undefined) =>
    date instanceof Date
        ? userDate(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              date.getHours(),
              date.getMinutes(),
              date.getSeconds(),
              date.getMilliseconds()
          )
        : date;
