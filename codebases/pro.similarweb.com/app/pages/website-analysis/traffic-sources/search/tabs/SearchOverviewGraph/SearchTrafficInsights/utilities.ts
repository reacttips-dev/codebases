import dayjs, { Dayjs } from "dayjs";
import { timeGranularityList } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import {
    EInsightTypes,
    IFilters,
    IInsight,
    IInsightsMetaData,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/typesAndConstants";
import { granularityNameToMomentUnit } from "UtilitiesAndConstants/Constants/Moment";
import { sortByProperty } from "UtilitiesAndConstants/UtilityFunctions/sort";
import {
    getAverage,
    getStandardDeviation,
} from "UtilitiesAndConstants/UtilityFunctions/statistics";

const MINIMUM_NEW_CHANNEL_VALUE = 100;
const MAXIMUM_NEW_CHANNEL_VALUE = 5000;
const MINIMUM_DATA_POINTS = 3;
const LAST_DATA_POINTS = 3;

const sortByDate = sortByProperty("x");

export const sortByPriorityAndGranularityDesc = (insights: IInsight[]) =>
    insights.sort(
        ({ priority, granularity }, { priority: priorityB, granularity: granularityB }) => {
            const isGranularityEqual = granularity === granularityB;
            if (isGranularityEqual) return priorityB - priority;
            return granularity === timeGranularityList.monthly.name ? -1 : 1;
        },
    );

export const getInsights = (insightsMetaData: IInsightsMetaData, rawData, filters: IFilters) => {
    return Object.keys(insightsMetaData).map((insightKey) =>
        getInsight(insightKey, insightsMetaData, rawData, filters),
    );
};

export const getInsight = (insightKey, insightsMetaData, rawData, filters) => {
    return insightsMetaData[insightKey].getInsight(rawData, insightKey, filters);
};

export const getConsolidateDataStructure = (CHANNEL_TYPE) => (dataBreakDown) =>
    Object.keys(dataBreakDown).map((key) => ({
        x: dayjs.utc(key),
        y: dataBreakDown[key][CHANNEL_TYPE],
    }));

const getChangeValue = (valueA, valueB) => valueB - valueA;

const getChangePercentage = (valueA, valueB) => (valueB - valueA) / valueA;

export const getChangeValues = (dataBreakDown: { x: Dayjs; y: number }[]) => {
    const sortedDataBreakDown = sortByDate(dataBreakDown);
    const { length: dataBreakDownLength } = dataBreakDown;
    const lastDataPointValue = sortedDataBreakDown[dataBreakDownLength - 1].y;
    const lastDataPointValuePredecessor = sortedDataBreakDown[dataBreakDownLength - 2].y;
    const lastDataPointValuePredecessorPredecessor = sortedDataBreakDown[dataBreakDownLength - 3].y;
    const changeValuePeriodOverPeriod = getChangeValue(
        lastDataPointValue,
        lastDataPointValuePredecessor,
    );
    const changePercentagePeriodOverPeriod = getChangePercentage(
        lastDataPointValuePredecessor,
        lastDataPointValue,
    );
    const changeValuePeriodOverPeriodOverPeriod = getChangeValue(
        lastDataPointValuePredecessor,
        lastDataPointValuePredecessorPredecessor,
    );
    const changePercentagePeriodOverPeriodOverPeriod = getChangePercentage(
        lastDataPointValuePredecessorPredecessor,
        lastDataPointValuePredecessor,
    );
    return {
        changeValuePeriodOverPeriod,
        changePercentagePeriodOverPeriod,
        changeValuePeriodOverPeriodOverPeriod,
        changePercentagePeriodOverPeriodOverPeriod,
    };
};

const isAboveThreshold = (change: number, threshold: number) => Math.abs(change) > threshold;
const isAboveStdThreshold = (
    lastDataPointValue: number,
    average: number,
    std: number,
    stdAmount: number,
) =>
    lastDataPointValue > average + std * stdAmount ||
    lastDataPointValue < average - std * stdAmount;

const getNewChannelLastDataPoint = (sortedDataBreakDown, minThreshold, maxThreshold) => {
    const newChannelLastDataPoint = sortedDataBreakDown.reduce(
        (results, { y: currentValue }, index) => {
            if (index === 0) {
                return results;
            }
            const previousDataPoint = sortedDataBreakDown[index - 1];
            const { y: previousValue } = previousDataPoint;
            const isNewChannel =
                results || (currentValue > maxThreshold && previousValue < minThreshold);
            return isNewChannel ? previousDataPoint : results;
        },
        null,
    );
    return newChannelLastDataPoint;
};

const removePartialDataPoints = (sortedBreakDown, lastSupportedDate, granularity) => {
    const sortedBreakDownWithoutPartial = sortedBreakDown.filter((dataPointItem) => {
        const isPartial = dayjs
            .utc(dataPointItem.x)
            .add(1, granularityNameToMomentUnit[granularity])
            .subtract(1, "days")
            .isAfter(dayjs.utc(lastSupportedDate));
        return !isPartial;
    });
    return sortedBreakDownWithoutPartial;
};

const isBothPositiveOrNegative = (valA, valB) => (valA < 0 && valB < 0) || (valA > 0 && valB > 0);

const getSortedBreakDownWithoutPartial = (
    channelType,
    dataBreakDown,
    lastSupportedDate,
    granularity,
    dataParser,
) => {
    const consolidateDataStructure = dataParser(channelType)(dataBreakDown);
    const sortedBreakDown = sortByDate(consolidateDataStructure);
    const sortedBreakDownWithoutPartial = removePartialDataPoints(
        sortedBreakDown,
        lastSupportedDate,
        granularity,
    );
    return sortedBreakDownWithoutPartial.filter(({ y }) => y);
};

const isNotValidData = (granularity, dataPointsAmount) =>
    granularity === timeGranularityList.daily.name || dataPointsAmount < MINIMUM_DATA_POINTS;

const isTrendingAboveThreshold = (
    changePercentagePeriodOverPeriod,
    changePercentagePeriodOverPeriodOverPeriod,
    isPeriodOverPeriodAboveThreshold,
    periodOverPeriodOverPeriodThreshold,
) => {
    return (
        isBothPositiveOrNegative(
            changePercentagePeriodOverPeriod,
            changePercentagePeriodOverPeriodOverPeriod,
        ) &&
        isPeriodOverPeriodAboveThreshold &&
        isAboveThreshold(changePercentagePeriodOverPeriod, periodOverPeriodOverPeriodThreshold) &&
        isAboveThreshold(
            changePercentagePeriodOverPeriodOverPeriod,
            periodOverPeriodOverPeriodThreshold,
        )
    );
};

export const isAboveTrafficThreshold = (
    rawData,
    trafficThreshold,
    channelType,
    lastSupportedDate,
    granularity,
    dataParser,
) => {
    const TRAFFIC_SHARE_API_ENTRY = "TrafficShare";
    const { BreakDown: dataBreakDown } = rawData[TRAFFIC_SHARE_API_ENTRY].Data;
    const sortedBreakDownWithoutPartial = getSortedBreakDownWithoutPartial(
        channelType,
        dataBreakDown,
        lastSupportedDate,
        granularity,
        dataParser,
    ).slice(-LAST_DATA_POINTS);
    const trafficShareSum = sortedBreakDownWithoutPartial.reduce((sum, { y }) => sum + y, 0);
    return trafficShareSum > trafficThreshold;
};

export const commonInsightsValueCalculator = (
    rawData,
    id,
    insightMetaData,
    filters,
    customIsAboveTrafficThreshold = null,
) => {
    const {
        apiEntry,
        channelType,
        dataParser = getConsolidateDataStructure,
        minThreshold = MINIMUM_NEW_CHANNEL_VALUE,
        maxThreshold = MAXIMUM_NEW_CHANNEL_VALUE,
        supportNewChannel,
    } = insightMetaData;
    if (!rawData || !rawData[apiEntry]) return {};
    const { BreakDown: dataBreakDown } = rawData[apiEntry].Data;
    const { granularity, lastSupportedDate, trafficThreshold } = filters;
    const aboveTrafficThreshold =
        customIsAboveTrafficThreshold ??
        isAboveTrafficThreshold(
            rawData,
            trafficThreshold,
            channelType,
            lastSupportedDate,
            granularity,
            dataParser,
        );

    const sortedBreakDownWithoutPartial = getSortedBreakDownWithoutPartial(
        channelType,
        dataBreakDown,
        lastSupportedDate,
        granularity,
        dataParser,
    );

    const { length: dataPointsAmount } = sortedBreakDownWithoutPartial;
    if (isNotValidData(granularity, dataPointsAmount)) {
        return {};
    }
    const lastDataPoint = sortedBreakDownWithoutPartial[dataPointsAmount - 1];
    const isWeekly = granularity === timeGranularityList.weekly.name;
    const getJumpResults = isWeekly ? getWeeklyJumpResults : getMonthlyJumpResults;
    const getTrendingResults = isWeekly ? getWeeklyTrendingResults : getMonthlyTrendingResults;
    const jumpResults = getJumpResults(insightMetaData, sortedBreakDownWithoutPartial);
    const tendingResults = getTrendingResults(insightMetaData, sortedBreakDownWithoutPartial);
    const newChannelLastDataPoint =
        supportNewChannel &&
        getNewChannelLastDataPoint(sortedBreakDownWithoutPartial, minThreshold, maxThreshold);
    const isNewChannel = Boolean(newChannelLastDataPoint);
    return {
        ...insightMetaData,
        ...(aboveTrafficThreshold && { ...jumpResults, ...tendingResults }),
        isNewChannel,
        id,
        lastDataPoint: isNewChannel ? newChannelLastDataPoint : lastDataPoint,
        granularity,
    };
};

const getMonthlyJumpResults = (insightMetaData, sortedBreakDownWithoutPartial) => {
    const { monthlyJumpThreshold } = insightMetaData;
    const { changePercentagePeriodOverPeriod } = getChangeValues(sortedBreakDownWithoutPartial);
    const isMonthlyAboveThreshold = isAboveThreshold(
        changePercentagePeriodOverPeriod,
        monthlyJumpThreshold,
    );
    const results = {
        isPeriodOverPeriodAboveThreshold: isMonthlyAboveThreshold,
        value: changePercentagePeriodOverPeriod,
    };
    return isMonthlyAboveThreshold ? results : null;
};

export const commonIsJumpAboveThreshold = (changeThreshold, standardDeviationAmount) => (
    average,
    standardDeviation,
    lastDataPointValue,
) => {
    const changeFromAverage = getChangePercentage(average, lastDataPointValue);
    return (
        isAboveThreshold(changeFromAverage, changeThreshold) &&
        isAboveStdThreshold(lastDataPointValue, average, standardDeviation, standardDeviationAmount)
    );
};

const getWeeklyJumpResults = (insightMetaData, sortedBreakDownWithoutPartialArg) => {
    const { isJumpAboveThreshold } = insightMetaData;
    if (!isJumpAboveThreshold) return null;
    const { length: dataPointsAmount } = sortedBreakDownWithoutPartialArg;
    const sortedBreakDownWithoutPartial = sortedBreakDownWithoutPartialArg.slice(
        dataPointsAmount > LAST_DATA_POINTS ? -LAST_DATA_POINTS - 1 : LAST_DATA_POINTS,
        -1,
    );
    const average = getAverage(sortedBreakDownWithoutPartial);
    const standardDeviation = getStandardDeviation(sortedBreakDownWithoutPartial);
    const lastDataPoint =
        sortedBreakDownWithoutPartialArg[sortedBreakDownWithoutPartialArg.length - 1];
    const isAboveThreshold = isJumpAboveThreshold(average, standardDeviation, lastDataPoint.y);
    const { changePercentagePeriodOverPeriod } = getChangeValues(sortedBreakDownWithoutPartialArg);
    const results = {
        isPeriodOverPeriodAboveThreshold: isAboveThreshold,
        value: changePercentagePeriodOverPeriod,
    };
    return isAboveThreshold ? results : null;
};

const getWeeklyTrendingResults = (insightMetaData, sortedBreakDownWithoutPartial) => {
    const { weeklyTrendingThreshold } = insightMetaData;
    return geTrendingResults(sortedBreakDownWithoutPartial, weeklyTrendingThreshold);
};

const getMonthlyTrendingResults = (insightMetaData, sortedBreakDownWithoutPartial) => {
    const { monthlyTrendingThreshold } = insightMetaData;
    return geTrendingResults(sortedBreakDownWithoutPartial, monthlyTrendingThreshold);
};

const geTrendingResults = (sortedBreakDownWithoutPartial, trendingThreshold) => {
    const {
        changePercentagePeriodOverPeriod,
        changePercentagePeriodOverPeriodOverPeriod,
    } = getChangeValues(sortedBreakDownWithoutPartial);
    const isPeriodOverPeriodAboveThreshold = isAboveThreshold(
        changePercentagePeriodOverPeriod,
        trendingThreshold,
    );
    const isWeeklyAboveThreshold = isTrendingAboveThreshold(
        changePercentagePeriodOverPeriod,
        changePercentagePeriodOverPeriodOverPeriod,
        isPeriodOverPeriodAboveThreshold,
        trendingThreshold,
    );
    const results = {
        isPeriodOverPeriodOverPeriodAboveThreshold: isWeeklyAboveThreshold,
        value: changePercentagePeriodOverPeriodOverPeriod,
    };
    return isWeeklyAboveThreshold ? results : null;
};

export const getInsightType = (
    isNewChannel,
    isPeriodOverPeriodAboveThreshold,
    isPeriodOverPeriodOverPeriodAboveThreshold,
    changeValue,
) => {
    if (isNewChannel) {
        return EInsightTypes.NEW_CHANNEL;
    }
    if (isPeriodOverPeriodOverPeriodAboveThreshold) {
        return changeValue > 0 ? EInsightTypes.TRENDING_UP : EInsightTypes.TRENDING_DOWN;
    }
    if (isPeriodOverPeriodAboveThreshold) {
        return changeValue > 0 ? EInsightTypes.INCREASING : EInsightTypes.DECREASING;
    }
    return null;
};
