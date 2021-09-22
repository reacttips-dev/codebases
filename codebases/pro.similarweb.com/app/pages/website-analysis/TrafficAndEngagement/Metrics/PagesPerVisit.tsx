import {
    PopTooltip,
    PopTooltipSingle,
} from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/ChartTooltips";
import { CompareModeTooltip } from "pages/website-analysis/TrafficAndEngagement/ChartTooltips/CommonChartTooltip";
import { GenericGraph } from "pages/website-analysis/TrafficAndEngagement/Components/GenericGraph";
import { PopSingleModeLegends } from "pages/website-analysis/TrafficAndEngagement/Legends/PopSingleModeLegends";
import {
    parseData,
    parsePOPCompareModeDataWithMTD,
    parsePOPSingleModeDataWithMTD,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    dateFormatter,
    defaultExcelEndPoint,
    getChartType,
    getGetExcel,
    getrInitPOPItemsSingleModeWebSources,
    isTimeGranularityDisabled,
    isTimeGranularityDisabledOnlyMonth,
    neverStacking,
    popCompareEndPoint,
    popCompareExcelEndPoint,
    popSingleChartType,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { numberFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import {
    tooltipPositioner,
    POPAndCompareTooltipPositioner,
} from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const PagesPerVisit = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP },
    } = props;
    let metricData;
    const numberFormatter = ({ value }) => numberFilter()(value, 2);
    if (!isPOP) {
        const addToDashboardName = "EngagementPagesPerVisit";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementPagesPerVisit/Graph";
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
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementPagesPerVisit/GraphPOP";
        const addToDashboardName = "EngagementPagesPerVisit";
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
    } else {
        const endPoint = popCompareEndPoint;
        const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const getExcelLink = getGetExcel(popCompareExcelEndPoint);
        const getGraphData = parsePOPCompareModeDataWithMTD;
        const chartTooltip = (props) => (
            <PopTooltip
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={numberFormatter}
            />
        );
        const popApiResponseName = "PagesPerVisit";
        metricData = {
            endPoint,
            isTimeGranularityDisabled: isTimeGranularityDisabledOnlyMonth,
            getChartType,
            yAxisLabelsFormatter,
            getExcelLink,
            getGraphData,
            name,
            chartTooltip,
            popApiResponseName,
            isStacking: neverStacking,
            hideLegendsData: true,
            tooltipPositioner: POPAndCompareTooltipPositioner,
        };
    }
    return (
        <GenericGraph
            metric={metricData}
            {...props}
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementPagesPerVisit"]}`}
        />
    );
};
