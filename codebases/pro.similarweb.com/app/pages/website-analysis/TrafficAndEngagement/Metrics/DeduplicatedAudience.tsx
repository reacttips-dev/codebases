import { colorsPalettes } from "@similarweb/styles";
import { Legends } from "components/React/Legends/Legends";
import { GenericGraph } from "pages/website-analysis/TrafficAndEngagement/Components/GenericGraph";
import {
    parseDedupCompareModeData,
    parseSingleModeData,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/ParseServerData";
import {
    chartGranularityItemClickArea,
    defaultExcelEndPoint,
    getChartType,
    getGetExcel,
    isTimeGranularityDisabledOnlyMonth,
} from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import { CompareTooltip, Table } from "pages/website-analysis/components/dedupGraphConfig";
import React from "react";
import { tooltipPositioner } from "../MD/chartConfig";
import { ChartIds } from "components/Chart/src/components/annotations/Helpers/ChartIdsHelper";

export const DeduplicatedAudience = (props) => {
    const {
        name,
        meta: { isSingleMode, isOneWebSource, isSingleCompare },
    } = props;
    const i18n = i18nFilter();
    const endPoint = "widgetApi/TrafficAndEngagement/EngagementDedup/Graph";
    const yAxisLabelsFormatter = ({ value }) => minVisitsAbbrFilter()(value);
    const getExcelLink = getGetExcel(defaultExcelEndPoint);
    const getSites = ({ compareSites }) =>
        !isSingleMode
            ? compareSites
            : [
                  {
                      name: i18n("tae.dedup.legend.desktop.text"),
                      isSelected: true,
                      color: colorsPalettes.blue[400],
                      alias: "Desktop",
                      infoTooltip: i18n("tae.dedup.legend.desktop.tooltip"),
                  },
                  {
                      name: i18n("tae.dedup.legend.mobileweb.text"),
                      isSelected: true,
                      color: colorsPalettes.sky[300],
                      alias: "Mobile Web",
                      infoTooltip: i18n("tae.dedup.legend.mobileweb.tooltip"),
                  },
                  {
                      name: i18n("tae.dedup.legend.dedup.text"),
                      isSelected: true,
                      color: colorsPalettes.orange[300],
                      alias: "Dedup",
                      infoTooltip: i18n("tae.dedup.legend.dedup.tooltip"),
                  },
              ];

    const getGraphData = ({
        data,
        sites,
        chosenSite,
        timeGranularity,
        lastSupportedDate,
        chartType,
    }) => {
        let metricData = data.Data;
        if (isSingleMode) {
            return parseSingleModeData({
                sites,
                metricData,
                chosenSite,
                timeGranularity,
                lastSupportedDate,
                chartType,
            });
        }
        if (isSingleCompare) {
            metricData = Object.entries(metricData).reduce((acc, [key, gData]: [string, any]) => {
                acc[key] = gData;
                if (!gData.Total) {
                    const aggPoints = Object.values(gData).reduce<any>((accPoints, [points]) => {
                        points.forEach((p) => {
                            accPoints[p.Key] = [...(accPoints[p.Key] ?? []), p.Value];
                        });
                        return accPoints;
                    }, {});
                    const listPoints = Object.entries(aggPoints).map(
                        ([key, keyValues]: [string, any]) => ({
                            Key: key,
                            Value: keyValues.reduce((acc, v) => acc + v, 0),
                        }),
                    );
                    listPoints.sort(({ Key: keyA }, { Key: keyB }) => (keyA > keyB ? 1 : -1));
                    acc[key] = {
                        ...gData,
                        Total: [listPoints],
                    };
                }
                return acc;
            }, {});
        }
        return parseDedupCompareModeData({ sites, metricData });
    };
    const chartTooltip = ({ points, x, graphData }) => {
        if (isSingleMode) {
            const pointsData = points[0].series.chart.series.flatMap((s) =>
                s.data.filter((p) => p.x === x),
            );
            pointsData[0].series.name = "Desktop";
            pointsData[1].series.name = "Mobile Web";
            pointsData[2].series.name = "Desktop & Mobile Web";
            return <Table pointsData={pointsData} />;
        }
        return <CompareTooltip pointsData={points} graphData={graphData} />;
    };

    const singleModeLegends = (props) => (
        <Legends {...props} textMaxWidth="300px" showLegendsData={false} />
    );
    const legends = isSingleMode ? singleModeLegends : undefined;
    const chartTooltipPositioner = isSingleMode ? tooltipPositioner : undefined;
    const metricData = {
        endPoint,
        isTimeGranularityDisabled: isTimeGranularityDisabledOnlyMonth,
        getChartType,
        yAxisLabelsFormatter,
        getExcelLink,
        getSites,
        getGraphData,
        chartTooltip,
        name,
        legends,
        chartGranularityItemClick:
            isSingleMode && !isOneWebSource ? chartGranularityItemClickArea : undefined,
        tooltipPositioner: chartTooltipPositioner,
    };
    return (
        <GenericGraph
            metric={metricData}
            {...props}
            chartIdForAnnotations={`${ChartIds["TrafficAndEngagementDeduplicatedAudience"]}`}
        />
    );
};
