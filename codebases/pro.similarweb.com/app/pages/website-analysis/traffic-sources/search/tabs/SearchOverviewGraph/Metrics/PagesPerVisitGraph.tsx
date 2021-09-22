import { numberFilter, i18nFilter } from "filters/ngFilters";
import { searchOverviewContext } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchOverviewGraph";
import React, { useContext } from "react";
import { BaseMetricGraph } from "../Components/BaseMetricGraph";
import { getBaseChartConfig } from "../Helpers/SearchOverviewGraphConfig";

export const PagesPerVisitGraph = () => {
    const numberFormatter = ({ value }) => numberFilter()(value, 2);
    const baseChartConfig = getBaseChartConfig(
        [numberFilter, 2],
        i18nFilter()("wa.ao.graph.pages"),
        numberFormatter,
        false,
        useContext(searchOverviewContext),
    );
    const rawDataMetricName = "PagesPerVisit";
    const legendsLabelsFormatter = numberFormatter;
    const chartType = "line";
    const getCurrentChartConfig = () => {
        return baseChartConfig;
    };
    const metricConfig = {
        getCurrentChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        showAllChannel: true,
        showTooltip: true,
        tooltipKey: "organic.search.overview.graph.page_visits.tooltip",
    };
    return <BaseMetricGraph metricConfig={metricConfig} />;
};
