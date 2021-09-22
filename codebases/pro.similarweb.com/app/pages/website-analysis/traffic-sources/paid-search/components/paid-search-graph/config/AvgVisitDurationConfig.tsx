import { i18nFilter, timeFilter } from "filters/ngFilters";
import React from "react";
import { getPaidSearchChartConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PaidSearchGraphConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const AvgVisitDurationConfig = ({
    rawData,
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    isMonthsToDateActive,
}) => {
    const timeFormatter = ({ value }) => timeFilter()(value, null);
    const rawDataMetricName = "AverageDuration";
    const legendsLabelsFormatter = timeFormatter;
    const chartType = chartTypes.LINE;
    const isPercents = chartType !== chartTypes.LINE;
    const metricName = i18nFilter()("wa.ao.graph.avgduration");
    const yTooltipFormatter = (value) => timeFilter()(value, null);
    const baseChartConfig = getPaidSearchChartConfig(
        [timeFilter, 2],
        metricName,
        rawDataMetricName,
        timeFormatter,
        yTooltipFormatter,
        isPercents,
        isWindow,
        duration,
        granularity,
        isMonthsToDateActive,
        webSource,
        rawData,
        null,
        to,
        from,
        true,
    );
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
