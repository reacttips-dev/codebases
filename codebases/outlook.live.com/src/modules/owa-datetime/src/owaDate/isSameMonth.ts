import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import isEqual from './isEqual';
import startOfMonth from './startOfMonth';

export default (left: OwaDate, right: OwaDate) =>
    isEqual(startOfMonth(left), startOfMonth(owaDate(left.tz, right)));
