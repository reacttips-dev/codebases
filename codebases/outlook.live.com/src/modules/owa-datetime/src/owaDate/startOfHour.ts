import startOfHour from 'owa-date-utc-fn/lib/startOfHour';
import tzTimeFn from './tzTimeFn';
import type { OwaDate } from '../schema';

export default tzTimeFn(startOfHour) as (date: OwaDate) => OwaDate;
