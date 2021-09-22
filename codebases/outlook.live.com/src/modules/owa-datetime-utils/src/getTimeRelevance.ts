import {
    compare,
    differenceInDays,
    differenceInWeeks,
    isSameDay,
    isSameWeek,
    now,
    owaDate,
    OwaDate,
    startOfDay,
    startOfWeek,
} from 'owa-datetime';
import { getUserOptions } from 'owa-session-store';
import { assertNever } from 'owa-assert';

/**
 * Represents the time relevance used for telemetry.
 * Note that the order cannot be changed. Otherwise the telemetry report will be messed up.
 */
export enum TimeRelevance {
    BeforeLastWeek = 0,
    LastWeek = 1,
    SameWeekBeforeYesterday = 2,
    Yesterday = 3,
    Now = 4,
    Tomorrow = 5,
    SameWeekAfterTomorrow = 6,
    NextWeek = 7,
    AfterNextWeek = 8,
    EarlierToday = 9,
    LaterToday = 11,
}

/**
 * Get the time relevance of the target compared to the reference
 * @param targetStart the target event's Start time
 * @param targetEnd the target event's End time
 * @param reference the reference time
 * @return the time relevance
 */
export default function getTimeRelevance(
    targetStart: OwaDate,
    targetEnd: OwaDate,
    reference: OwaDate = now()
): TimeRelevance | number {
    if (isSameDay(targetStart, reference)) {
        if (compare(targetEnd, reference) === -1) {
            // target meeting already ended earlier
            return TimeRelevance.EarlierToday;
        } else if (compare(targetStart, reference) === 1) {
            // target meeting hasn't started yet
            return TimeRelevance.LaterToday;
        } else if (compare(targetStart, reference) === -1 && compare(targetEnd, reference) === 1) {
            // target meeting started but hasn't ended at this point
            return TimeRelevance.Now;
        } else {
            // code won't hit here as End date should always greater than Start date
            assertNever(targetStart as never);
            return -2;
        }
    } else if (isSameWeek(targetStart, reference, getUserOptions().WeekStartDay)) {
        const startDateOfTarget = startOfDay(targetStart);
        const startDateOfReference = startOfDay(owaDate(targetStart.tz, reference));
        const diffInDays = differenceInDays(startDateOfTarget, startDateOfReference);
        if (diffInDays < -1) {
            return TimeRelevance.SameWeekBeforeYesterday;
        } else if (diffInDays === -1) {
            return TimeRelevance.Yesterday;
        } else if (diffInDays === 1) {
            return TimeRelevance.Tomorrow;
        } else if (diffInDays > 1) {
            return TimeRelevance.SameWeekAfterTomorrow;
        } else {
            // code won't hit here as it should have been handled by isSameDay
            assertNever(diffInDays as never);
            return -1;
        }
    } else {
        // not in the same week
        const startWeekOfTarget = startOfWeek(targetStart, getUserOptions().WeekStartDay);
        const startWeekOfReference = startOfWeek(
            owaDate(targetStart.tz, reference),
            getUserOptions().WeekStartDay
        );

        const diffInWeeks = differenceInWeeks(startWeekOfTarget, startWeekOfReference);
        if (diffInWeeks < -1) {
            return TimeRelevance.BeforeLastWeek;
        } else if (diffInWeeks === -1) {
            return TimeRelevance.LastWeek;
        } else if (diffInWeeks === 1) {
            return TimeRelevance.NextWeek;
        } else if (diffInWeeks > 1) {
            return TimeRelevance.AfterNextWeek;
        } else {
            // code won't hit here as it should have been handled by isSameWeek
            assertNever(diffInWeeks as never);
            return -1;
        }
    }
}
