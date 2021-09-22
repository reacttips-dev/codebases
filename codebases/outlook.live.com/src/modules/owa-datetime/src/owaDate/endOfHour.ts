import endOfHour from 'owa-date-utc-fn/lib/endOfHour';
import tzTimeFn from './tzTimeFn';
import type { OwaDate } from '../schema';

export default tzTimeFn(endOfHour) as (date: OwaDate) => OwaDate;
