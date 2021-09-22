import { numberFilter, i18nFilter } from "filters/ngFilters";
import React from "react";
import { getPaidSearchChartConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PaidSearchGraphConfig";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const PagesPerVisitConfig = ({
    rawData,
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    isMonthsToDateActive,
}) => {
    const numberFormatter = ({ value }) => numberFilter()(value, 2);
    const rawDataMetricName = "PagesPerVisit";
    const legendsLabelsFormatter = numberFormatter;
    const yTooltipFormatter = (value) => numberFilter()(value, 2);
    const chartType = chartTypes.LINE;
    const metricName = i18nFilter()("wa.ao.graph.pages");
    const baseChartConfig = getPaidSearchChartConfig(
        [numberFilter, 2],
        metricName,
        rawDataMetricName,
        numberFormatter,
        yTooltipFormatter,
        false,
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
