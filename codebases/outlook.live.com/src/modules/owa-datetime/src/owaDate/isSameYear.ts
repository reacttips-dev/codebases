import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import isEqual from './isEqual';
import startOfYear from './startOfYear';

export default (left: OwaDate, right: OwaDate) =>
    isEqual(startOfYear(left), startOfYear(owaDate(left.tz, right)));
