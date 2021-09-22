import type SeriesTime from '../schema/SeriesTime';

export default function isValidSeriesTime(seriesTime: SeriesTime): boolean {
    if (!seriesTime) {
        return false;
    }

    if (!isValidDate(seriesTime.startYear, seriesTime.startMonth, seriesTime.startDay)) {
        return false;
    }

    if (!seriesTime.noEndDate) {
        if (!isValidDate(seriesTime.endYear, seriesTime.endMonth, seriesTime.endDay)) {
            return false;
        }
        var startDate = createDate(
            seriesTime.startYear,
            seriesTime.startMonth,
            seriesTime.startDay
        );
        var endDate = createDate(seriesTime.endYear, seriesTime.endMonth, seriesTime.endDay);

        if (startDate >= endDate) {
            return false;
        }
    }

    if (seriesTime.startTimeMin < 0 || seriesTime.durationMin < 0) {
        return false;
    }

    return true;
}

function isValidDate(year: number, month: number, day: number): boolean {
    return year >= 1601 && month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

function createDate(year: number, month: number, day: number): Date {
    var date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    return date;
}
