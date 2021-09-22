import startOfDay from 'owa-date-utc-fn/lib/startOfDay';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(startOfDay) as (date: OwaDate) => OwaDate;
