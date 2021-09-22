import { now, addHours, today, differenceInSeconds } from 'owa-datetime';

export type TimeOfDay = 'Morning' | 'Evening' | 'Afternoon';

export function timeOfDay(): TimeOfDay {
    const timeNow = now();
    const noon = addHours(today(), 12);
    const evening = addHours(today(), 18);
    let timeOfDay: TimeOfDay = 'Evening';
    if (differenceInSeconds(noon, timeNow) > 0) {
        timeOfDay = 'Morning';
    } else if (differenceInSeconds(evening, timeNow) > 0) {
        timeOfDay = 'Afternoon';
    }
    return timeOfDay;
}
