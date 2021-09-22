import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import { getDisplayAdsGraphConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/DisplayAdsGraphConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const BounceRateConfig = ({ duration, isWindow, granularity, webSource, to, from }) => {
    const rawDataMetricName = "BounceRate";
    const metricName = i18nFilter()("wa.ao.graph.bounce");
    const legendsLabelsFormatter = ({ value }) => percentageSignFilter()(value, 2);
    const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
    const yTooltipFormatter = (value) => percentageSignFilter()(value, 2);
    const chartType = chartTypes.LINE;
    const baseChartConfig = getDisplayAdsGraphConfig({
        metricName,
        rawDataMetricName,
        yAxisLabelsFormatter,
        yTooltipFormatter,
        isPercents: true,
        isWindow,
        duration,
        granularity,
        webSource,
        to,
        from,
    });
    const isGranularitySupported = () => true;
    return {
        baseChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        isGraphTypeEnabled: false,
        isGranularitySupported,
    };
};
