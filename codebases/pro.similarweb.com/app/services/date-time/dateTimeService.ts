import dayjs, { Dayjs } from "dayjs";

type TimeDurationParts = {
    hours: number;
    minutes: number;
    seconds: number;
};

// TODO: Add tests
// TODO: Add date formatting ability (could be used instead of moment.js)
const dateTimeService = {
    MINUTES_IN_AN_HOUR: 60,
    SECONDS_IN_A_MINUTE: 60,
    SECONDS_IN_AN_HOUR: 3600,

    /**
     * Retrieves hours, minutes and seconds from given value
     *
     * @param duration - number of seconds
     * @example
     * `
     *  splitDurationIntoParts(59) -> { hours: 0, minutes: 0, seconds: 59 }
     *  splitDurationIntoParts(345) -> { hours: 0, minutes: 5, seconds: 45 }
     *  splitDurationIntoParts(3661) -> { hours: 1, minutes: 1, seconds: 0 }
     * `
     */
    splitDurationIntoParts(duration: number): TimeDurationParts {
        if (duration <= 0) {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        const hours = Math.floor(duration / this.SECONDS_IN_AN_HOUR);
        const minutes = Math.floor(
            (duration - hours * this.SECONDS_IN_AN_HOUR) / this.MINUTES_IN_AN_HOUR,
        );
        const seconds = Math.round(
            duration - hours * this.SECONDS_IN_AN_HOUR - minutes * this.SECONDS_IN_A_MINUTE,
        );

        return {
            hours,
            minutes,
            seconds,
        };
    },
    /**
     * Format date string using moment.js
     * @param date
     * @param format
     */
    formatWithMoment(date: string | Date | Dayjs, format: string) {
        return dayjs(date).format(format);
    },
    getDateDiffFromNow(date: string | Date | Dayjs, unitOfTime: dayjs.OpUnitType) {
        return dayjs().diff(dayjs(date), unitOfTime);
    },
    getMoment(date: string | Date | Dayjs) {
        return dayjs(date);
    },
};

export default dateTimeService;
