import { APPROXIMATE_DAYS_IN_MONTH } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import differenceInDays from './differenceInDays';

/** Returns the number of full months (ie, 30 days) between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate) => {
    const diffDays = differenceInDays(left, right) / APPROXIMATE_DAYS_IN_MONTH;
    return Math.floor(diffDays);
};
