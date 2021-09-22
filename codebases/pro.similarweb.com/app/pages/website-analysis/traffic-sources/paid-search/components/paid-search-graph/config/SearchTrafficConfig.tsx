import {
    abbrNumberFilter,
    i18nFilter,
    minVisits,
    minVisitsAbbrFilter,
    percentageSignFilter,
    tinyFractionApproximationFilter,
} from "filters/ngFilters";
import React from "react";
import { getPaidSearchChartConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PaidSearchGraphConfig";
import { numbers } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const SearchTrafficConfig = ({
    rawData,
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    graphType,
    isMonthsToDateActive,
    isSingle,
}) => {
    const chartType = graphType.value === numbers ? chartTypes.LINE : chartTypes.AREA;
    const isPercents = chartType !== chartTypes.LINE;
    const metricName = i18nFilter()("search.trafficandengagement.searchtraffic");
    const yAxisLabelsFormatter = ({ value }) => {
        return chartType === chartTypes.LINE
            ? abbrNumberFilter()(value)
            : percentageSignFilter()(value, 2);
    };
    const tooltipFormatter =
        chartType === chartTypes.LINE ? minVisitsAbbrFilter : percentageSignFilter;
    const yTooltipFormatter = (value) =>
        chartType === chartTypes.LINE
            ? minVisitsAbbrFilter()(value)
            : percentageSignFilter()(value, 2);
    const legendsLabelsFormatter = ({ value }) => {
        return chartType === chartTypes.LINE
            ? minVisits(value, 5000, abbrNumberFilter())
            : tinyFractionApproximationFilter()(percentageSignFilter()(value, 2), 2);
    };
    const rawDataMetricName = "TrafficShare";
    const baseChartConfig = getPaidSearchChartConfig(
        [tooltipFormatter, 2],
        metricName,
        rawDataMetricName,
        yAxisLabelsFormatter,
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
        !isPercents,
    );
    if (chartType === chartTypes.LINE) {
        baseChartConfig.stacked = false;
    } else if (chartType === chartTypes.AREA) {
        baseChartConfig.stacked = true;
        baseChartConfig.yAxis.max = 1;
    }
    const isGranularitySupported = () => true;
    return {
        baseChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        isGraphTypeEnabled: !isSingle,
        isGranularitySupported,
    };
};
