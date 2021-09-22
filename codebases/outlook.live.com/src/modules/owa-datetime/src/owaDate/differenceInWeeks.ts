import { MILLISECONDS_IN_WEEK } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import fullDateDiff from './fullDateDiff';

/** Returns the number of full weeks (ie, 7 days) between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate) => fullDateDiff(left, right, MILLISECONDS_IN_WEEK);
