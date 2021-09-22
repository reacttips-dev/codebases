import endOfYear from 'owa-date-utc-fn/lib/endOfYear';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(endOfYear) as (date: OwaDate) => OwaDate;
