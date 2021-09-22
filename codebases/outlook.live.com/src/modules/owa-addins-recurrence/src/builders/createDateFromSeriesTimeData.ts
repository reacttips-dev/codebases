const MINUTES_PER_HOUR = 60;

export default function createDateFromSeriesTimeData(
    year: number,
    month: number,
    day: number,
    minutes: number
): Date {
    const hours = Math.floor(minutes / MINUTES_PER_HOUR);
    minutes -= hours * MINUTES_PER_HOUR;

    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}
