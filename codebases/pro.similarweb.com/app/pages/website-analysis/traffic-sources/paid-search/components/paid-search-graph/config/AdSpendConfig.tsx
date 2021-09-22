import { abbrNumberWithPrefixFilter, i18nFilter } from "filters/ngFilters";
import React from "react";
import { getPaidSearchChartConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/config/PaidSearchGraphConfig";
import { PaidSearchGraphTooltip } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/PaidSearchGraphTooltip";
import { swSettings } from "common/services/swSettings";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";

const dateToUTC = (dateString) => {
    const date = dateString.split("T")[0].split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};

export const AdSpendConfig = ({
    rawData,
    duration,
    isWindow,
    granularity,
    webSource,
    to,
    from,
    graphType,
}) => {
    const chartType = chartTypes.LINE;
    const isPercents = chartType !== chartTypes.LINE;
    const legendsLabelsFormatter = ({ value }) => abbrNumberWithPrefixFilter()(value, "$");
    const metricName = i18nFilter()("analysis.search.adspend.metrics.title");
    const rawDataMetricName = "Ad Spend";
    const tooltipFormatter = PaidSearchGraphTooltip;
    const adspendAlgoStartDate = dateToUTC(
        swSettings.components.AdSpend.resources.FirstAvailableDate,
    );

    const yAxisLabelsFormatter = ({ value }) => abbrNumberWithPrefixFilter()(value, "$");

    const yTooltipFormatter = (value) => abbrNumberWithPrefixFilter()(value, "$");

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
        false,
        webSource,
        rawData,
        null,
        to,
        from,
        !isPercents,
        true,
        adspendAlgoStartDate,
    );
    baseChartConfig.stacked = false;

    const isGranularitySupported = (gran) => gran === "monthly";

    return {
        baseChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        isGraphTypeEnabled: false,
        isGranularitySupported,
    };
};
