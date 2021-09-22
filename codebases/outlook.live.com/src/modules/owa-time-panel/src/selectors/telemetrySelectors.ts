import getStore from '../store/store';
import { differenceInMilliseconds, now } from 'owa-datetime';
import { TimeConstants } from 'owa-datetime-utils';

export function getTimePanelSessionId(): string {
    return getStore().sessionId;
}

export function getSessionDuration(): number {
    const { panelOpenTimestamp } = getStore();
    return panelOpenTimestamp ? differenceInMilliseconds(now(), panelOpenTimestamp) : null;
}

export function getViewDuration(): number {
    const { panelViewOpenTimestamp } = getStore();
    return panelViewOpenTimestamp ? differenceInMilliseconds(now(), panelViewOpenTimestamp) : null;
}

export function getDurationBucket(
    durationInMs: number
): { lowerBoundMinutes: number; upperBoundMinutes: number | null } {
    if (durationInMs <= TimeConstants.MillisecondsIn1Min) {
        // Bucket 1: [0 min, 1 min]
        return { lowerBoundMinutes: 0, upperBoundMinutes: 1 };
    } else if (durationInMs <= 5 * TimeConstants.MillisecondsIn1Min) {
        // Bucket 2: (1 min, 5 min]
        return { lowerBoundMinutes: 1, upperBoundMinutes: 5 };
    } else if (durationInMs <= 30 * TimeConstants.MillisecondsIn1Min) {
        // Bucket 3: (5 min, 30 min]
        return { lowerBoundMinutes: 5, upperBoundMinutes: 30 };
    } else if (durationInMs <= TimeConstants.MillisecondsIn1Hour) {
        // Bucket 4: (30 min, 60 min]
        return { lowerBoundMinutes: 30, upperBoundMinutes: 60 };
    } else if (durationInMs <= 2 * TimeConstants.MillisecondsIn1Hour) {
        // Bucket 5: (1 hr, 2 hr]
        return { lowerBoundMinutes: 60, upperBoundMinutes: 120 };
    } else if (durationInMs <= 4 * TimeConstants.MillisecondsIn1Hour) {
        // Bucket 6: (2 hr, 4 hr]
        return { lowerBoundMinutes: 120, upperBoundMinutes: 240 };
    } else if (durationInMs <= TimeConstants.MillisecondsInOneDay) {
        // Bucket 7: (4 hr, 1 day]
        return { lowerBoundMinutes: 240, upperBoundMinutes: 1440 };
    } else {
        // Bucket 8: (1 day, Infinity)
        return { lowerBoundMinutes: 1440, upperBoundMinutes: null };
    }
}
