import type { OwaDate } from '../schema';
import { getYear, getMonth } from './getFields';
import getDaysInMonth from 'owa-date-utc-fn/lib/getDaysInMonth';

export default (date: OwaDate) => getDaysInMonth(getYear(date), getMonth(date));
