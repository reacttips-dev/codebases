import { colorsPalettes } from "@similarweb/styles";
import {
    ISeries,
    ILineChartData,
} from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartTypes";
import {
    normalizeChartXData,
    processDataForLineInChart,
} from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartDataProcessor";
import { buildPointConfidence } from "components/Chart/src/data/confidenceProcessor";

export const generateLineChartData = (chartTitles: string[], dataSeries: ISeries[]) => {
    const chartColors: Array<string> = [colorsPalettes.orange[400], colorsPalettes.blue[400]];

    // Convert the chart data into a temporary format
    // so that we could process its confidence data properly
    let graphPoint: ILineChartData = null;
    const firstLinePoints: ILineChartData[] = dataSeries.map((item) => {
        const prevPoint = graphPoint;
        graphPoint = {
            x: normalizeChartXData(item.Values[0].Key),
            y: item.Values[1].Value,
            change: item.Change,
            originalX: normalizeChartXData(item.Values[1].Key),
            confidenceData: buildPointConfidence(
                item.Values[1].Confidence,
                prevPoint?.confidenceData,
            ),
        };
        return graphPoint;
    });

    graphPoint = null;
    const secondLinePoints: ILineChartData[] = dataSeries.map((item) => {
        const prevPoint = graphPoint;
        graphPoint = {
            x: normalizeChartXData(item.Values[0].Key),
            y: item.Values[0].Value,
            change: item.Change,
            confidenceData: buildPointConfidence(
                item.Values[0].Confidence,
                prevPoint?.confidenceData,
            ),
        };

        return graphPoint;
    });

    const data = [
        processDataForLineInChart(chartTitles[0], chartColors[0], firstLinePoints),
        processDataForLineInChart(chartTitles[0], chartColors[1], secondLinePoints),
    ];

    return data;
};

export const generateColumnChartData = (chartTitles: string[], dataSeries: ISeries[]) => {
    const data = [
        {
            name: chartTitles[0],
            color: colorsPalettes.orange[400],
            data: dataSeries.map((item) => ({
                name: normalizeChartXData(item.Values[1].Key),
                y: item.Values[1].Value,
                change: item.Change,
            })),
        },
        {
            name: chartTitles[0],
            color: colorsPalettes.blue[400],
            data: dataSeries.map((item) => ({
                name: normalizeChartXData(item.Values[0].Key),
                y: item.Values[0].Value,
                change: item.Change,
            })),
        },
    ];
    return data;
};

export const generateStackedColumnChartData = (
    chartTitles: string[],
    chartDataSeries1: ISeries[],
    chartDataSeries2: ISeries[],
) => {
    const data = [
        {
            name: chartTitles[1],
            color: colorsPalettes.orange[200],
            stack: 0,
            data: chartDataSeries2.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[0].Value,
                change: item.Change,
            })),
        },
        {
            name: chartTitles[1],
            color: colorsPalettes.blue[200],
            stack: 1,
            data: chartDataSeries2.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[1].Value,
                change: item.Change,
            })),
        },
        {
            name: chartTitles[0],
            color: colorsPalettes.orange[400],
            stack: 0,
            data: chartDataSeries1.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[0].Value,
                change: item.Change,
                originalX: normalizeChartXData(item.Values[1].Key),
            })),
        },
        {
            name: chartTitles[0],
            color: colorsPalettes.blue[400],
            stack: 1,
            data: chartDataSeries1.map((item) => ({
                x: normalizeChartXData(item.Values[0].Key),
                y: item.Values[1].Value,
                change: item.Change,
            })),
        },
    ];

    return data;
};
