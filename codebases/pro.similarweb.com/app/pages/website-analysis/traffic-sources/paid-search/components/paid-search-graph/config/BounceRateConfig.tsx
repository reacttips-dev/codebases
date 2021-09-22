import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import { getPaidSearchChartConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PaidSearchGraphConfig";
import { colorsPalettes } from "@similarweb/styles";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

export const BounceRateConfig = ({
    rawData,
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    isMonthsToDateActive,
}) => {
    const percentageFormatter = ({ value }) => percentageSignFilter()(value, 2);
    const getChangeColor = (isDecrease, isNan) =>
        !isNan
            ? !isDecrease
                ? colorsPalettes.red.s100
                : colorsPalettes.green.s100
            : colorsPalettes.carbon[500];
    const rawDataMetricName = "BounceRate";
    const metricName = i18nFilter()("wa.ao.graph.bounce");
    const legendsLabelsFormatter = percentageFormatter;
    const yTooltipFormatter = (value) => percentageSignFilter()(value, 0);
    const chartType = chartTypes.LINE;
    const baseChartConfig = getPaidSearchChartConfig(
        [percentageSignFilter, 2],
        metricName,
        rawDataMetricName,
        percentageFormatter,
        yTooltipFormatter,
        true,
        isWindow,
        duration,
        granularity,
        isMonthsToDateActive,
        webSource,
        rawData,
        getChangeColor,
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
