import startOfMonth from 'owa-date-utc-fn/lib/startOfMonth';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(startOfMonth) as (date: OwaDate) => OwaDate;
