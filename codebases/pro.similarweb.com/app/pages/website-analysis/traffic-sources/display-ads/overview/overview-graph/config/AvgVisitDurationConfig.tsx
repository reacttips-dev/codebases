import { i18nFilter, timeFilter } from "filters/ngFilters";
import React from "react";
import { getDisplayAdsGraphConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/DisplayAdsGraphConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const AvgVisitDurationConfig = ({
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
}) => {
    const timeFormatter = ({ value }) => timeFilter()(value, null);
    const rawDataMetricName = "AverageDuration";
    const legendsLabelsFormatter = timeFormatter;
    const yAxisLabelsFormatter = timeFormatter;
    const chartType = chartTypes.LINE;
    const isPercents = chartType !== chartTypes.LINE;
    const metricName = i18nFilter()("wa.ao.graph.avgduration");
    const yTooltipFormatter = (value) => timeFilter()(value, null);
    const baseChartConfig = getDisplayAdsGraphConfig({
        metricName,
        rawDataMetricName,
        yAxisLabelsFormatter,
        yTooltipFormatter,
        isPercents,
        isWindow,
        duration,
        granularity,
        webSource,
        to,
        from,
    });
    baseChartConfig.stacked = false;
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
