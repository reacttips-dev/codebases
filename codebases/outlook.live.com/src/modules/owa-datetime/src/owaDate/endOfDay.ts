import endOfDay from 'owa-date-utc-fn/lib/endOfDay';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(endOfDay) as (date: OwaDate) => OwaDate;
