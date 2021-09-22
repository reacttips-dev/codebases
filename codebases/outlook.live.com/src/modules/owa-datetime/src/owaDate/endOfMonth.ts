import endOfMonth from 'owa-date-utc-fn/lib/endOfMonth';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(endOfMonth) as (date: OwaDate) => OwaDate;
