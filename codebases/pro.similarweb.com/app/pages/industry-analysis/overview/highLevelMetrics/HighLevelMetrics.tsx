import React from "react";
import { ExpandedTableRowLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { DefaultFetchService } from "services/fetchService";
import { IMetricSummaryData, Tabs } from "./Tabs";
import { EMetrics } from "pages/industry-analysis/overview/highLevelMetrics/tabsMD";
import { timeGranularity as granularities } from "components/widget/widget-utilities/time-granularity";
import categoryService from "common/services/categoryService";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { BasicDurations } from "services/DurationService";

interface IMetricSummaryDataPromise {
    Data: {
        Source: string;
        AvgMonthVisits: number;
        AvgVisitDuration: number;
        PagesPerVisit: number;
        BounceRate: number;
    }[];
}

const METRICS_SUMMARY_ENDPOINT = "widgetApi/TrafficAndEngagement/EngagementOverview/Table";

const DEFAULT_QUERY_PARAMS = {
    includeSubdomains: true,
};

export const HighLevelMetrics = () => {
    const { params, durations } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [metricSummaryData, setMetricSummaryData] = React.useState<IMetricSummaryData>();
    const { category, country, webSource, duration } = params;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(String(category));
    const { from, to, isWindow, compareFrom, compareTo } = durations.forAPI;
    const { forDisplayApi, categoryHash, forApi } = categoryObject;
    const is28d = duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const queryParams = {
        category: forDisplayApi,
        categoryHash,
        country,
        isWindow,
        keys: forApi,
        from,
        to,
        webSource,
        compareFrom,
        compareTo,
        timeGranularity: is28d ? granularities.daily : granularities.monthly,
        ...DEFAULT_QUERY_PARAMS,
    };
    const fetchMetricSummaryData = async () => {
        !isLoading && setIsLoading(true);
        const fetchService = DefaultFetchService.getInstance();
        const metricSummaryPromise = fetchService.get<IMetricSummaryDataPromise>(
            METRICS_SUMMARY_ENDPOINT,
            queryParams,
        );
        try {
            const metricSummaryDataRaw = await metricSummaryPromise;
            const {
                AvgMonthVisits,
                AvgVisitDuration,
                PagesPerVisit,
                BounceRate,
            } = metricSummaryDataRaw.Data.find(({ Source }) => Source === webSource);
            const metricSummaryData = {
                [EMetrics.AvgMonthVisits]: AvgMonthVisits,
                [EMetrics.PagesPerVisit]: PagesPerVisit,
                [EMetrics.BounceRate]: BounceRate,
                [EMetrics.AvgVisitDuration]: AvgVisitDuration,
            };
            setMetricSummaryData(metricSummaryData);
        } finally {
            setIsLoading(false);
        }
    };
    React.useEffect(() => {
        fetchMetricSummaryData();
    }, []);
    return (
        <>{isLoading ? <ExpandedTableRowLoader /> : <Tabs enrichmentData={metricSummaryData} />}</>
    );
};
