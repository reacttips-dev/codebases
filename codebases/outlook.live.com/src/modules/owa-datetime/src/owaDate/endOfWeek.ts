import endOfWeek from 'owa-date-utc-fn/lib/endOfWeek';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(endOfWeek) as (date: OwaDate, weekStartsOn: number) => OwaDate;
