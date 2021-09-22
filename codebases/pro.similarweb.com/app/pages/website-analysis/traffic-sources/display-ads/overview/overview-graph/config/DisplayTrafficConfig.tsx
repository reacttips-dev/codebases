import {
    abbrNumberFilter,
    i18nFilter,
    minAbbrNumberFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    tinyFractionApproximationFilter,
} from "filters/ngFilters";
import React from "react";
import { getDisplayAdsGraphConfig } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/config/DisplayAdsGraphConfig";
import { numbers } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const DisplayTrafficConfig = ({
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    graphType,
    isSingle,
}) => {
    const chartType = graphType.value === numbers ? chartTypes.LINE : chartTypes.AREA;
    const isPercents = chartType !== chartTypes.LINE;
    const metricName = i18nFilter()("wa.ao.graph.trafficshare");
    const yAxisLabelsFormatter = ({ value }) => {
        return chartType === chartTypes.LINE
            ? abbrNumberFilter()(value)
            : percentageSignFilter()(value, 0);
    };
    const yTooltipFormatter = (value) =>
        chartType === chartTypes.LINE
            ? minVisitsAbbrFilter()(value)
            : percentageSignFilter()(value, 2);
    const legendsLabelsFormatter = ({ value }) => {
        return chartType === chartTypes.LINE
            ? minAbbrNumberFilter()(value)
            : tinyFractionApproximationFilter()(percentageSignFilter()(value, 2), 2);
    };
    const rawDataMetricName = "TrafficShare";
    const isGranularitySupported = () => true;
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
        showChangeColumn: !isPercents,
    });
    if (chartType === chartTypes.AREA) {
        baseChartConfig.yAxis.max = 1;
    }
    return {
        baseChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        isGraphTypeEnabled: !isSingle,
        isGranularitySupported,
    };
};
