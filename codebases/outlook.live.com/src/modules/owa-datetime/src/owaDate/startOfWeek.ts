import startOfWeek from 'owa-date-utc-fn/lib/startOfWeek';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(startOfWeek) as (date: OwaDate, weekStartsOn: number) => OwaDate;
