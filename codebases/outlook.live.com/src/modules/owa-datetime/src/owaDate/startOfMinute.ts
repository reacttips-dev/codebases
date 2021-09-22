import startOfMinute from 'owa-date-utc-fn/lib/startOfMinute';
import tzTimeFn from './tzTimeFn';
import type { OwaDate } from '../schema';

export default tzTimeFn(startOfMinute) as (date: OwaDate) => OwaDate;
