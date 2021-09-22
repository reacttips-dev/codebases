import dayjs from "dayjs";
import {
    allChannels,
    brandedNonBranded,
    EGraphTabs,
    organicPaid,
    timeGranularityList,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import {
    channels,
    EInsightsTypes,
    EInsightTypes,
    EPriorities,
    formatters,
    GREEN,
    IInsightsMetaData,
    IInsightsProps,
    legends,
    RED,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/typesAndConstants";
import {
    commonInsightsValueCalculator,
    commonIsJumpAboveThreshold,
    getConsolidateDataStructure,
    isAboveTrafficThreshold,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/utilities";

export const insightsMetaData: IInsightsMetaData = {
    [EInsightsTypes.ORGANIC_CHANNEL]: {
        priority: EPriorities.VERY_IMPORTANT,
        apiEntry: "TrafficShare",
        monthlyJumpThreshold: 0.1,
        weeklyTrendingThreshold: 0.1,
        monthlyTrendingThreshold: 0.05,
        channelType: channels.ORGANIC,
        displayName: "search.overview.insights.organic.display.name",
        selectedTabOnClick: EGraphTabs.TrafficShare,
        unSelectedLegend: legends.PAID,
        selectedLegend: legends.ORGANIC,
        selectedCategoryOnClick: organicPaid,
        formatter: formatters.PERCENTAGE,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.2, 2),
        supportNewChannel: true,
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.PAID_CHANNEL]: {
        priority: EPriorities.SOMEWHAT_IMPORTANT,
        monthlyJumpThreshold: 0.1,
        weeklyTrendingThreshold: 0.1,
        monthlyTrendingThreshold: 0.05,
        apiEntry: "TrafficShare",
        channelType: channels.PAID,
        displayName: "search.overview.insights.paid.display.name",
        selectedTabOnClick: EGraphTabs.TrafficShare,
        unSelectedLegend: legends.ORGANIC,
        selectedLegend: legends.PAID,
        selectedCategoryOnClick: organicPaid,
        formatter: formatters.PERCENTAGE,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.2, 2),
        supportNewChannel: true,
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.BRANDED_TRAFFIC]: {
        priority: EPriorities.EXTREMELY_IMPORTANT,
        monthlyJumpThreshold: 0.1,
        weeklyTrendingThreshold: 0.1,
        monthlyTrendingThreshold: 0.05,
        apiEntry: "TrafficShare",
        channelType: channels.BRANDED,
        displayName: "search.overview.insights.branded.display.name",
        selectedTabOnClick: EGraphTabs.TrafficShare,
        selectedCategoryOnClick: brandedNonBranded,
        formatter: formatters.PERCENTAGE,
        dataParser: (channelType) => (dataBreakDown) =>
            Object.entries(dataBreakDown).map((a) => ({
                x: dayjs.utc(a[0]),
                y: a[1][channelType] / a[1][allChannels],
            })),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData.Monthly.brandedNonBrandedData?.Data;
            const isWeekly = filters.granularity === timeGranularityList.weekly.name;
            const trafficData = rawData.enrichedData.Monthly.organicPaidData?.Data;
            const { apiEntry } = insightsMetaData[id];
            if (isWeekly || !trafficData[apiEntry]) return {};

            const { granularity, lastSupportedDate, trafficThreshold } = filters;
            const aboveTrafficThreshold = isAboveTrafficThreshold(
                rawData.enrichedData.Monthly.organicPaidData?.Data,
                trafficThreshold,
                channels.ALL,
                lastSupportedDate,
                granularity,
                getConsolidateDataStructure,
            );
            return commonInsightsValueCalculator(
                channelData,
                id,
                insightsMetaData[id],
                filters,
                aboveTrafficThreshold,
            );
        },
    },
    [EInsightsTypes.VISIT_DURATION_ORGANIC]: {
        priority: EPriorities.NOT_VERY_IMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        getValue: (changeValue, lastDataPointValue) => lastDataPointValue,
        apiEntry: "AverageDuration",
        channelType: channels.ORGANIC,
        displayName: "search.overview.insights.visit.duration.organic.display.name",
        selectedTabOnClick: EGraphTabs.AverageDuration,
        unSelectedLegend: legends.PAID,
        selectedLegend: legends.ORGANIC,
        getInsightProps: (insightType) => {
            return pagePerVisitsAndVisitDurationDefaultInsightsProps[insightType];
        },
        formatter: formatters.TIME,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.VISIT_DURATION_PAID]: {
        priority: EPriorities.NOT_VERY_IMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        getValue: (changeValue, lastDataPointValue) => lastDataPointValue,
        apiEntry: "AverageDuration",
        channelType: channels.PAID,
        displayName: "search.overview.insights.visit.duration.paid.display.name",
        selectedTabOnClick: EGraphTabs.AverageDuration,
        unSelectedLegend: legends.ORGANIC,
        selectedLegend: legends.PAID,
        getInsightProps: (insightType) => {
            return pagePerVisitsAndVisitDurationDefaultInsightsProps[insightType];
        },
        formatter: formatters.TIME,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.PAGE_PER_VISIT_ORGANIC]: {
        priority: EPriorities.NOT_AT_ALL_IMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        apiEntry: "PagesPerVisit",
        getValue: (changeValue, lastDataPointValue) => lastDataPointValue,
        channelType: channels.ORGANIC,
        displayName: "search.overview.insights.page.per.visit.organic.display.name",
        selectedTabOnClick: EGraphTabs.PagesPerVisit,
        unSelectedLegend: legends.PAID,
        selectedLegend: legends.ORGANIC,
        getInsightProps: (insightType) => {
            return pagePerVisitsAndVisitDurationDefaultInsightsProps[insightType];
        },
        formatter: formatters.NUMBERS,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.PAGE_PER_VISIT_PAID]: {
        priority: EPriorities.NOT_AT_ALL_IMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        apiEntry: "PagesPerVisit",
        getValue: (changeValue, lastDataPointValue) => lastDataPointValue,
        channelType: channels.PAID,
        displayName: "search.overview.insights.page.per.visit.paid.display.name",
        selectedTabOnClick: EGraphTabs.PagesPerVisit,
        unSelectedLegend: legends.ORGANIC,
        selectedLegend: legends.PAID,
        getInsightProps: (insightType) => {
            return pagePerVisitsAndVisitDurationDefaultInsightsProps[insightType];
        },
        formatter: formatters.NUMBERS,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.BOUNCE_RATE_ORGANIC]: {
        priority: EPriorities.SOMEWHAT_UNIMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        apiEntry: "BounceRate",
        channelType: channels.ORGANIC,
        displayName: "search.overview.insights.bounce.rate.organic.display.name",
        selectedTabOnClick: EGraphTabs.BounceRate,
        unSelectedLegend: legends.PAID,
        selectedLegend: legends.ORGANIC,
        getInsightProps: (insightType) => {
            return bounceRateDefaultInsightsProps[insightType];
        },
        formatter: formatters.PERCENTAGE,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
    [EInsightsTypes.BOUNCE_RATE_PAID]: {
        priority: EPriorities.SOMEWHAT_UNIMPORTANT,
        monthlyJumpThreshold: 0.3,
        weeklyTrendingThreshold: 0.15,
        monthlyTrendingThreshold: 0.1,
        apiEntry: "BounceRate",
        channelType: channels.PAID,
        displayName: "search.overview.insights.bounce.rate.paid.display.name",
        selectedTabOnClick: EGraphTabs.BounceRate,
        unSelectedLegend: legends.ORGANIC,
        selectedLegend: legends.PAID,
        isJumpAboveThreshold: commonIsJumpAboveThreshold(0.3, 2),
        getInsightProps: (insightType) => {
            return bounceRateDefaultInsightsProps[insightType];
        },
        formatter: formatters.PERCENTAGE,
        getInsight: (rawData, id, filters) => {
            const channelData = rawData.enrichedData[filters.granularity].organicPaidData?.Data;
            return commonInsightsValueCalculator(channelData, id, insightsMetaData[id], filters);
        },
    },
};

export const defaultInsightsProps: IInsightsProps = {
    [EInsightTypes.NEW_CHANNEL]: {
        headerColor: GREEN,
        headerKey: "search.overview.insights.new.channel.header",
        bodyKey: (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.new.channel.body.weekly"
                : "search.overview.insights.new.channel.body",
        headerIcon: "new",
    },
    [EInsightTypes.TRENDING_UP]: {
        headerColor: GREEN,
        headerKey: "search.overview.insights.trend.up.header",
        bodyKey: (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.trend.up.body.weekly"
                : "search.overview.insights.trend.up.body",
        headerIcon: "trend-up",
    },
    [EInsightTypes.TRENDING_DOWN]: {
        headerColor: RED,
        headerKey: "search.overview.insights.trend.down.header",
        bodyKey: (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.trend.down.body.weekly"
                : "search.overview.insights.trend.down.body",
        headerIcon: "trend-down",
    },
    [EInsightTypes.INCREASING]: {
        headerColor: GREEN,
        headerKey: "search.overview.insights.increasing.header",
        bodyKey: (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.increasing.body.weekly"
                : "search.overview.insights.increasing.body",
        headerIcon: "arrow-up",
    },
    [EInsightTypes.DECREASING]: {
        headerColor: RED,
        headerKey: "search.overview.insights.decreasing.header",
        bodyKey: (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.decreasing.body.weekly"
                : "search.overview.insights.decreasing.body",
        headerIcon: "arrow-down",
    },
};

const pagePerVisitsAndVisitDurationDefaultInsightsProps = Object.fromEntries(
    Object.entries(defaultInsightsProps).map((defaultInsightProps) => {
        const insightType = Number(defaultInsightProps[0]);
        const decreasingBodyKey = (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.decreasing.body.weekly.abs"
                : "search.overview.insights.decreasing.body.abs";
        const increasingBodyKey = (duration: string) =>
            duration === timeGranularityList.weekly.name
                ? "search.overview.insights.increasing.body.weekly.abs"
                : "search.overview.insights.increasing.body.abs";
        const defaultBodyKey = defaultInsightProps[1].bodyKey;
        const bodyKey =
            insightType === EInsightTypes.DECREASING
                ? decreasingBodyKey
                : insightType === EInsightTypes.INCREASING
                ? increasingBodyKey
                : defaultBodyKey;
        return [defaultInsightProps[0], { ...defaultInsightProps[1], bodyKey }];
    }),
);

const bounceRateDefaultInsightsProps = Object.fromEntries(
    Object.entries(defaultInsightsProps).map((defaultInsightProps) => {
        // bounce rate colors are opposite
        const headerColor = defaultInsightProps[1].headerColor === GREEN ? RED : GREEN;
        return [defaultInsightProps[0], { ...defaultInsightProps[1], headerColor }];
    }),
);
