import { DefaultFetchService } from "services/fetchService";
import { IIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import dayjs from "dayjs";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const getRawData = (
    industryAnalysisOverviewHighLevelMetricsContext: IIndustryAnalysisOverviewHighLevelMetricsContext,
) => {
    const {
        queryParams,
        selectedMetric,
        isPeriodOverPeriod,
    } = industryAnalysisOverviewHighLevelMetricsContext;
    const { getEndpoint } = selectedMetric;
    const endpoint = getEndpoint({ isPeriodOverPeriod });
    const fetchService = DefaultFetchService.getInstance();
    const webSource =
        queryParams.webSource === devicesTypes.TOTAL && !isPeriodOverPeriod
            ? "Combined"
            : queryParams.webSource;
    const rawDataPromise = fetchService.get(endpoint, { ...queryParams, webSource });
    return rawDataPromise;
};

const getApiWebSource = (webSource, selectedMetric) => {
    const { mobileWebApiName = webSource } = selectedMetric;
    const apiWebSource = webSource === devicesTypes.MOBILE ? mobileWebApiName : webSource;
    return apiWebSource;
};

const getSeries = (webSource, legendItems) => {
    const visibleLegends = legendItems.filter(({ visible }) => visible);
    const series =
        webSource === devicesTypes.TOTAL
            ? visibleLegends
            : legendItems.filter(({ metric }) => metric === webSource);
    return series;
};

export const parseServerDataBase = (
    rawData,
    industryAnalysisOverviewHighLevelMetricsContext: IIndustryAnalysisOverviewHighLevelMetricsContext,
) => {
    const { legendItems, params, selectedMetric } = industryAnalysisOverviewHighLevelMetricsContext;
    const { Data: data } = rawData;
    const { webSource } = params;
    const categoryData = Object.values(data)?.[0];
    const series = getSeries(webSource, legendItems);
    const chartData = series.map((legendItem) => {
        const apiWebSource = getApiWebSource(legendItem.metric, selectedMetric);
        const itemsData = categoryData[apiWebSource]?.[0];
        const { name, color } = legendItem;
        return {
            name,
            color,
            data: itemsData?.map((item) => ({
                x: dayjs.utc(item.Key).valueOf(),
                y: item.Value,
            })),
        };
    });
    return chartData.reverse();
};

export const parseServerDataPeriodOverPeriod = (
    rawData,
    industryAnalysisOverviewHighLevelMetricsContext: IIndustryAnalysisOverviewHighLevelMetricsContext,
) => {
    const {
        legendItems,
        queryParams,
        selectedMetric,
    } = industryAnalysisOverviewHighLevelMetricsContext;
    const { webSource } = queryParams;
    const apiWebSource = getApiWebSource(webSource, selectedMetric);
    const { Data: data } = rawData;
    const itemsData = Object.values(data)?.[0][apiWebSource];
    const chartData = [
        {
            name: legendItems[0].name,
            color: legendItems[0].color,
            data: itemsData?.map((item) => ({
                x: dayjs.utc(item.Values[0].Key).valueOf(),
                y: item.Values[1].Value,
                values: item.Values,
            })),
        },
        {
            name: legendItems[1].name,
            color: legendItems[1].color,
            data: itemsData?.map((item) => ({
                x: dayjs.utc(item.Values[0].Key).valueOf(),
                y: item.Values[0].Value,
                values: item.Values,
            })),
        },
    ];

    return chartData.reverse();
};
