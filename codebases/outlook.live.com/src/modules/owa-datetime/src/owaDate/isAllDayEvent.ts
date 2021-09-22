import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import isEqual from './isEqual';
import isBefore from './isBefore';
import startOfDay from './startOfDay';

export default function isAllDayEvent(start: OwaDate, end: OwaDate): boolean {
    const endInStartTz = owaDate(start.tz, end);
    return (
        isEqual(start, startOfDay(start)) &&
        isEqual(endInStartTz, startOfDay(endInStartTz)) &&
        isBefore(start, endInStartTz)
    );
}
