import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import isEqual from './isEqual';
import startOfDay from './startOfDay';

export default (left: OwaDate, right: OwaDate) =>
    isEqual(startOfDay(left), startOfDay(owaDate(left.tz, right)));
