import startOfYear from 'owa-date-utc-fn/lib/startOfYear';
import tzDateFn from './tzDateFn';
import type { OwaDate } from '../schema';

export default tzDateFn(startOfYear) as (date: OwaDate) => OwaDate;
