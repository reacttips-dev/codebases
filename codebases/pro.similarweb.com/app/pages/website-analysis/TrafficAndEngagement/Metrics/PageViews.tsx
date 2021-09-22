import { PopTooltipSingle } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import { CompareModeTooltip } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/CommonChartTooltip";
import { GenericGraph } from "pages/website-analysis/TrafficAndEngagement/Components/GenericGraph";
import { PopSingleModeLegends } from "pages/website-analysis/TrafficAndEngagement/Legends/PopSingleModeLegends";
import {
    parseData,
    parsePOPSingleModeDataWithMTD,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    dateFormatter,
    defaultExcelEndPoint,
    getGetExcel,
    getrInitPOPItemsSingleModeWebSources,
    isTimeGranularityDisabled,
    isTimeGranularityDisabledOnlyMonth,
    popSingleChartType,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { minVisitsAbbrFilter } from "filters/ngFilters";
import React from "react";
import { tooltipPositioner } from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const PageViews = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP },
    } = props;
    let metricData;
    const numberFormatter = ({ value }) => minVisitsAbbrFilter()(value, 2);
    if (!isPOP) {
        const addToDashboardName = "EngagementTotalPagesViews";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementTotalPagesViews/Graph";
        const getChartType = () => "line";
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getGraphData = parseData;
        const chartTooltip = (props) => (
            <CompareModeTooltip
                {...props}
                xFormatter={dateFormatter}
                yFormatter={numberFormatter}
                name={name}
            />
        );

        metricData = {
            endPoint,
            isTimeGranularityDisabled,
            getChartType,
            yAxisLabelsFormatter: numberFormatter,
            getExcelLink,
            addToDashboardName,
            getGraphData,
            chartTooltip,
            tooltipPositioner,
        };
    } else if (isSingleMode) {
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementTotalPagesViews/GraphPOP";
        const addToDashboardName = "EngagementTotalPagesViews";
        const getGraphData = parsePOPSingleModeDataWithMTD;
        const isStacking = () => false;
        const yAxisLabelsFormatter = ({ value }) => value;
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getChartType = () => "line";
        const chartType = popSingleChartType;
        const getWebSourceForApi = ({ webSource }) => webSource;
        const getSites = (props) => getrInitPOPItemsSingleModeWebSources(props);
        const legends = (props) => <PopSingleModeLegends {...props} />;
        const chartTooltip = (props) => (
            <PopTooltipSingle
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={numberFormatter}
            />
        );
        metricData = {
            endPoint,
            isTimeGranularityDisabled: isTimeGranularityDisabledOnlyMonth,
            getChartType,
            yAxisLabelsFormatter,
            getExcelLink,
            getGraphData,
            getWebSourceForApi,
            hideLegendsData: true,
            getSites,
            legends,
            chartTooltip,
            isStacking,
            addToDashboardName,
            chartType,
            tooltipPositioner,
        };
    }
    return (
        <GenericGraph
            metric={metricData}
            {...props}
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementPages"]}`}
        />
    );
};
