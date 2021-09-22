import dayjs from "dayjs";
import {
    firstAvailableDateForData,
    FORMAT_DATA,
} from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { apiFormat, customRangeFormat } from "services/DurationService";
import { swSettings } from "common/services/swSettings";

// In single, the domain is irrelevant therefore we place
// the array of data directly on the key representing the tier.
export const transformData = (dataToTransform, range) => {
    const dataKeys = Object.keys(dataToTransform);
    const innerKey = Object.keys(dataToTransform[dataKeys[0]])[0];
    dataKeys.forEach((key) => {
        dataToTransform[key] = dataToTransform[key][innerKey].slice(-range);
    });
};

// these are used as labels for the x axis of the chart in single mode
export const getCategories = (data: Record<string, any[]>) => {
    return Object.values(data)[0].map((v) => v[0]);
};

export const getMaxColumnValue = (data, dataKeys, filter) => {
    let max = 0;
    let counter = 0;
    const filteredKeys = dataKeys.filter((key) => filter.includes(key));
    for (let i = 0; i < data[filteredKeys[0]].length; i++) {
        counter = 0;
        for (let j = 0; j < filteredKeys.length; j++) {
            counter += data[filteredKeys[j]][i][1];
        }
        max = Math.max(max, counter);
    }
    return max;
};

export const buildSeriesForChart = (data = {}, baseSeries = [], isFiltered = false) => {
    const dataKeys = Object.keys(data);
    if (!dataKeys?.length) return undefined;
    let maxSeriesValue;
    if (isFiltered) {
        maxSeriesValue = getMaxColumnValue(
            data,
            dataKeys,
            baseSeries.map((s) => s.key),
        );
    }
    // divide by maxSeriesValue in order to normalize the columns relative to the largest column.
    baseSeries.forEach((seriesItem) => {
        seriesItem.data = data[seriesItem.key].map((v) => {
            const dataPoint = v[1];
            return dataPoint !== undefined
                ? isFiltered
                    ? dataPoint / maxSeriesValue
                    : dataPoint
                : 0;
        });
    });
    baseSeries.filter((seriesItem) => seriesItem.data.length);
    return baseSeries.length ? baseSeries : undefined;
};
// range =< (maxDate - minDate) ? range : maxDate
const validateRange = (range) => {
    const maxDate = swSettings.components.RankingDistribution.endDate;
    const minDate = dayjs.utc(firstAvailableDateForData, FORMAT_DATA);
    const diffIncludingEndDate = maxDate.diff(minDate, "months") + 1;

    return range <= diffIncludingEndDate ? range : diffIncludingEndDate;
};

// chosen + (12 - min(12, (chosen - start)))
export const getDurationValueForDataFetching = (chosenDate: string, range = 24) => {
    const validRange = validateRange(range);
    const monthInSeconds = 31 * 24 * 3600 * 1000;
    const chosenDateTimestamp = dayjs.utc(chosenDate, customRangeFormat);
    const earliestStartDateTimestamp = dayjs.utc(firstAvailableDateForData, FORMAT_DATA);

    // "+ 1" because the diff is the net difference in months between the start and end date
    // so for example: oct - jan = 9, yet we need to subtract from the range the actual diff
    // including the chosen month.
    const toValueTimestamp =
        chosenDateTimestamp.valueOf() +
        (validRange -
            Math.min(
                validRange,
                chosenDateTimestamp.diff(earliestStartDateTimestamp, "months") + 1,
            )) *
            monthInSeconds;

    const returnValue = dayjs.utc(toValueTimestamp).format(apiFormat);

    return { from: returnValue, to: returnValue };
};

export const selectedRangeDataExists = (chosenDate: string, range = 12) => {
    const chosenDateTimestamp = dayjs.utc(chosenDate, customRangeFormat);
    const earliestStartDateTimestamp = dayjs.utc(firstAvailableDateForData, FORMAT_DATA);
    const diff = chosenDateTimestamp.diff(earliestStartDateTimestamp, "months");
    return diff + 1 >= range;
};

// set the plotband around the chosen date on the x axis
export const getPlotBandRange = (categories, duration) => {
    const indexOfDuration = categories.findIndex((c) =>
        dayjs.utc(c, FORMAT_DATA).isSame(dayjs.utc(duration, customRangeFormat), "month"),
    );
    return {
        from: indexOfDuration - 0.5,
        to: indexOfDuration + 0.5,
    };
};

// methods for graph tooltips
export const calculateChange = (currentMonthsValue, previousMonthsValue, percentageFilter) => {
    if (!previousMonthsValue || !currentMonthsValue) return "N/A";
    const difference = currentMonthsValue - previousMonthsValue;
    if (difference === 0) return difference;
    return percentageFilter(difference / previousMonthsValue);
};

export const getSingleTierChange = (point, category, percentageFilter) => {
    const previousMonthObject = point.series.data.find((f) => f.category === category);
    return calculateChange(point.y, previousMonthObject?.y, percentageFilter);
};

export const getPreviousTotalOfVisibleTiers = (data, category) => {
    const total = data.reduce((acc, t) => {
        const val = t.series.data.find((f) => f.category === category);
        return (acc += val ? val.y : -1);
    }, 0);
    return total >= 0 && total;
};

export const getTotalOfVisibleTiers = (data) => {
    return data.reduce((acc, d) => {
        return (acc += d.y);
    }, 0);
};
