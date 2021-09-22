import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import isEqual from './isEqual';
import startOfWeek from './startOfWeek';

export default (left: OwaDate, right: OwaDate, weekStartsOn: number) =>
    isEqual(startOfWeek(left, weekStartsOn), startOfWeek(owaDate(left.tz, right), weekStartsOn));
