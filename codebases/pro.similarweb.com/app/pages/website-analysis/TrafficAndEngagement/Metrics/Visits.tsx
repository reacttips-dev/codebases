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
    parsePOPSingleModeData,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    chartGranularityItemClickArea,
    dateFormatter,
    defaultExcelEndPoint,
    getChartType,
    getGetExcel,
    getrInitPOPItemsSingleModeWebSources,
    getWebSourceForApiPOP,
    isTimeGranularityDisabled,
    isTimeGranularityDisabledOnlyMonth,
    minVisitsAbbrFormatter,
    neverStacking,
    popCompareEndPoint,
    popCompareExcelEndPoint,
    popSingleChartType,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { i18nFilter, minVisitsAbbrFilter, percentageSignFilter } from "filters/ngFilters";
import React from "react";
import {
    tooltipPositioner,
    POPAndCompareTooltipPositioner,
} from "pages/website-analysis/TrafficAndEngagement/MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const Visits = (props) => {
    const {
        name,
        meta: { isSingleMode, isPOP, isOneWebSource },
    } = props;
    let metricData;
    if (!isPOP) {
        const getTooltipHeader = (timeGranularity) => {
            const i18n = i18nFilter();
            if (timeGranularity === "Monthly") {
                return name;
            }
            if (timeGranularity === "Weekly") {
                return i18n("wa.ao.graph.avgvisits.tooltip.weekly");
            }
            return i18n("wa.ao.graph.avgvisits.tooltip.daily");
        };
        const addToDashboardName = "EngagementVisits";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementVisits/Graph";
        const chartTooltip = (props) => (
            <CompareModeTooltip
                {...props}
                xFormatter={dateFormatter}
                yFormatter={minVisitsAbbrFormatter}
                name={getTooltipHeader(props.timeGranularity)}
                totalAggregate={(...values) => values.reduce((acc, v) => acc + v, 0)}
            />
        );
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const yAxisLabelsFormatter = ({ value }) => minVisitsAbbrFilter()(value);
        metricData = {
            endPoint,
            isTimeGranularityDisabled,
            getChartType,
            yAxisLabelsFormatter,
            addToDashboardName,
            getExcelLink,
            chartTooltip,
            parseData,
            getGraphData: parseData,
            chartGranularityItemClick:
                isSingleMode && !isOneWebSource ? chartGranularityItemClickArea : undefined,
            tooltipPositioner,
        };
    } else if (isSingleMode) {
        const addToDashboardName = "EngagementVisits";
        const endPoint = "widgetApi/TrafficAndEngagement/EngagementVisits/GraphPOP";
        const legends = (props) => <PopSingleModeLegends {...props} customLegends={true} />;
        const chartTooltip = (props) => (
            <PopTooltipSingle
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={minVisitsAbbrFormatter}
            />
        );
        const getExcelLink = getGetExcel(defaultExcelEndPoint);
        const getGraphData = parsePOPSingleModeData;
        const yAxisLabelsFormatter = minVisitsAbbrFormatter;
        const getChartType = () => "line";
        const chartType = popSingleChartType;
        const getWebSourceForApi = getWebSourceForApiPOP;
        const getSites = (props) => getrInitPOPItemsSingleModeWebSources(props);
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
            addToDashboardName,
            chartTooltip,
            legends,
            chartType,
            tooltipPositioner,
        };
    } else {
        const endPoint = popCompareEndPoint;
        const yAxisLabelsFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const chartTooltip = (props) => (
            <PopTooltip
                pointsData={props.points}
                xFormatter={dateFormatter}
                yFormatter={minVisitsAbbrFormatter}
            />
        );
        const getGraphData = parsePOPCompareModeDataWithMTD;
        const getExcelLink = getGetExcel(popCompareExcelEndPoint);
        const popApiResponseName = "Visits";
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
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementVisits"]}`}
        />
    );
};
