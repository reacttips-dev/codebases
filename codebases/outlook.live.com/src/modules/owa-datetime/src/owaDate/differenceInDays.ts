import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import fullDateDiff from './fullDateDiff';

/** Returns the number of full days (ie, 24 hours) between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate) => fullDateDiff(left, right, MILLISECONDS_IN_DAY);
