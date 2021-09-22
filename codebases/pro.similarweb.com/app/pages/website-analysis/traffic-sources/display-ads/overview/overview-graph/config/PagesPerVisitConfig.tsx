import { i18nFilter, numberFilter } from "filters/ngFilters";
import React from "react";
import { getDisplayAdsGraphConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/DisplayAdsGraphConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const PagesPerVisitConfig = ({ duration, isWindow, granularity, webSource, to, from }) => {
    const rawDataMetricName = "PagesPerVisit";
    const legendsLabelsFormatter = ({ value }) => numberFilter()(value, 2);
    const yAxisLabelsFormatter = ({ value }) => numberFilter()(value, 0);
    const yTooltipFormatter = (value) => numberFilter()(value, 2);
    const chartType = chartTypes.LINE;
    const metricName = i18nFilter()("wa.ao.graph.pages");
    const baseChartConfig = getDisplayAdsGraphConfig({
        metricName,
        rawDataMetricName,
        yAxisLabelsFormatter,
        yTooltipFormatter,
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
