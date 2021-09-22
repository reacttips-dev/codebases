import type { OwaDate } from '../schema';

/**
 * Adapter to pass OwaDate to properties that expect Date

 * This should only be used when bridging time-zone aware
 * OWA components with non-OWA components that only work
 * with JavaScript's Date object.
 *
 * Usage of this function must be extremely limited.
 *
 * The returned Date object is different from a normal JavaScript Date.
 * The local values do not depend on the system time zone.
 * They are tied to the arbitrary time zone found in the given OwaDate.
 *
 * In other words:
 * - The face value of the **LOCAL** fields contain the values in the OwaDate time zone.
 * - The face value of the **UTC** fields contain the UTC values of the given date.
 *
 * #### Notes
 * - These Date objects must be treated as read-only objects; all setters will throw.
 * - toString, toDateString and toTimeString will format the **LOCAL** value as an ISO string.
 * - toISOString and toJSON will format the **UTC** value as an ISO string.
 */
export default (owaDate: OwaDate) => (owaDate as unknown) as Date;
