import { APPROXIMATE_DAYS_IN_YEAR } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import differenceInDays from './differenceInDays';

/** Returns the number of full years (ie, 365 days) between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate) => {
    const diffDays = differenceInDays(left, right) / APPROXIMATE_DAYS_IN_YEAR;
    return Math.floor(diffDays);
};
