import endOfMinute from 'owa-date-utc-fn/lib/endOfMinute';
import tzTimeFn from './tzTimeFn';
import type { OwaDate } from '../schema';

export default tzTimeFn(endOfMinute) as (date: OwaDate) => OwaDate;
