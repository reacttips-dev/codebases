import type { OwaDate } from '../schema';

/** Determines if a date is within the given range, with start and end being inclusive values. */
export default (date: OwaDate, start: OwaDate, end: OwaDate) => {
    const d = +date;
    const s = +start;
    const e = +end;

    if (s > e) {
        throw new Error('Invalid Range');
    }

    return d >= s && d <= e;
};
