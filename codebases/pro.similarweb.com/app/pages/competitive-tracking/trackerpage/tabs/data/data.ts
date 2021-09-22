import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import { CHART_COLORS } from "constants/ChartColors";
import { colorsPalettes } from "@similarweb/styles";
import {
    EChartViewType,
    ICompetitiveTrackerHighLevelMetricsContext,
    ITrackerData,
    TrackerMetricType,
} from "../../context/types";
import { getTabsMD } from "../tabsMD";
import { IMetric } from "../../metrics/types";
import {
    ITrackerHeaderData,
    ITrackerMetricData,
} from "pages/competitive-tracking/trackerpage/context/types";
import { isNumberAndNotNan } from "filters/ngFilters";

const MAX_COMPETITORS_TO_DISPLAY = 5;
import dayjs from "dayjs";

export const fetchData = async (
    competitiveTrackerHighLevelMetricsContext: ICompetitiveTrackerHighLevelMetricsContext,
) => {
    const {
        queryParams: { trackerId },
        endpoint,
    } = competitiveTrackerHighLevelMetricsContext;
    const fetchService = DefaultFetchService.getInstance();
    const queryParams = { trackerId };
    const rawDataPromise = fetchService.get(endpoint, queryParams, { headers: NoCacheHeaders });
    return rawDataPromise;
};

export const parseData = (
    rawData,
    competitiveTrackerHighLevelMetricsContext: ICompetitiveTrackerHighLevelMetricsContext,
): ITrackerData => {
    const chartData = getChartData(rawData, competitiveTrackerHighLevelMetricsContext);
    const headerData = getHeaderData(rawData);

    // Fetch one of the metrics from the chart data, and check how many months does a single entity cover
    // this will mark what's the duration for the entire chart data. (since all other entities / metrics will be
    // have the same data records count)
    const firstMetricKey = Object.keys(chartData)[0];
    const duration = chartData[firstMetricKey][0].data?.length;
    return { chartData, headerData, duration };
};

const getChartData = (
    rawData,
    competitiveTrackerHighLevelMetricsContext,
): Record<TrackerMetricType, ITrackerMetricData[]> => {
    const tabs = getTabsMD();
    const chartData = tabs.reduce(
        getMetricData(rawData, competitiveTrackerHighLevelMetricsContext),
        {},
    );
    return chartData;
};

const getMetricData = (rawData, competitiveTrackerHighLevelMetricsContext) => (metrics, metric) => {
    const metricRawData = rawData[metric.metric];
    const { chartViewType } = competitiveTrackerHighLevelMetricsContext;
    const { Graph: graph } = metricRawData;
    const competitors = Object.keys(graph);
    const competitorsWithData = competitors.filter((competitor) => graph[competitor].length);
    const metricData =
        chartViewType === EChartViewType.ABSOLUTE
            ? competitorsWithData.map(
                  getCompetitorData(graph, competitiveTrackerHighLevelMetricsContext),
              )
            : getPercentageData(
                  competitorsWithData,
                  graph,
                  competitiveTrackerHighLevelMetricsContext,
              );
    return { ...metrics, [metric.metric]: metricData };
};

const getCompetitorData = (graph, competitiveTrackerHighLevelMetricsContext) => (
    competitor,
    index,
) => {
    const competitorRawData = graph[competitor];
    const data = competitorRawData.map(getAbsoluteNumbersData);
    const legendData = data.reduce(
        (average, current) =>
            average + isNumberAndNotNan(current.y) ? current.y : 0 / data.length,
        0,
    );
    const competitorData = {
        name: getCompetitorDisplayName(competitor, competitiveTrackerHighLevelMetricsContext),
        color: getColorByIndex(index),
        data,
        legendData,
    };
    return competitorData;
};

const getPercentageData = (competitors, graph, competitiveTrackerHighLevelMetricsContext) => {
    const dateSum = competitors.reduce((result, c) => {
        graph[c].map(({ Key: key, Value: value }) => {
            result[key] ? (result[key] += value) : (result[key] = value);
        });
        return result;
    }, {});

    return competitors.map((competitor, index) => {
        const data = graph[competitor].map(({ Key: key, Value: value }) => {
            return {
                x: dayjs.utc(key).valueOf(),
                y: value / dateSum[key],
            };
        });
        const absData = graph[competitor].map(getAbsoluteNumbersData);

        const legendData = absData.reduce(
            (average, current) =>
                average + (isNumberAndNotNan(current.y) ? current.y : 0) / absData.length,
            0,
        );
        return {
            name: getCompetitorDisplayName(competitor, competitiveTrackerHighLevelMetricsContext),
            color: getColorByIndex(index),
            data,
            legendData,
        };
    });
};

const getColorByIndex = (index) =>
    index < MAX_COMPETITORS_TO_DISPLAY
        ? CHART_COLORS.chartMainColors[index]
        : colorsPalettes.carbon[50];

const getAbsoluteNumbersData = ({ Key, Value }) => {
    return {
        x: dayjs.utc(Key).valueOf(),
        y: isNumberAndNotNan(Value) ? Value : null,
    };
};

const getHeaderData = (rawData): Record<TrackerMetricType, ITrackerHeaderData> => {
    const tabs = getTabsMD();
    const headersData = tabs.reduce(getTabHeader(rawData), {});
    return headersData;
};

const getDataPointSum = (rawData, metric, index): number => {
    return Object.values(rawData[metric].Graph).reduce(
        (sum, current) =>
            sum + (isNumberAndNotNan(current[index]?.Value) ? current[index]?.Value : 0),
        0,
    ) as number;
};

const getTabHeader = (rawData) => (tabHeaders, tab: IMetric) => {
    const { metric } = tab;
    const firstDataPointSum = getDataPointSum(rawData, metric, 0);
    const lastDataPointSum = getDataPointSum(
        rawData,
        metric,
        (Object.values(rawData[metric].Graph)[0] as Array<any>)?.length - 1,
    );
    const change = (lastDataPointSum - firstDataPointSum) / lastDataPointSum;
    const tabHeader = {
        [metric]: {
            average: rawData[metric]?.Average,
            change,
        },
    };
    return { ...tabHeaders, ...tabHeader };
};

const getCompetitorDisplayName = (competitor, competitiveTrackerHighLevelMetricsContext) => {
    const { segmentsModule } = competitiveTrackerHighLevelMetricsContext;
    const { customSegmentsMeta = {} } = segmentsModule;
    const { Segments = [], AccountSegments = [] } = customSegmentsMeta;
    const segments = [...Segments, ...AccountSegments];
    const segment = segments.find(({ id }) => id === competitor);
    return segment ? `${segment.segmentName} | ${segment.domain}` : competitor;
};
