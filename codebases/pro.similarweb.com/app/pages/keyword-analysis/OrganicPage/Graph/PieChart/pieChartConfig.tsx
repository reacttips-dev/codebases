import { colorsPalettes } from "@similarweb/styles";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import { percentageSignFilter } from "filters/ngFilters";
import { ChartTooltip } from "pages/keyword-analysis/common/ChartTooltip";
import { graphGranularityToString } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import * as React from "react";
import ReactDOMServer from "react-dom/server";

let currentHoverSeries;

export const getChartConfig = (chartData, lastSupportedDate, timeGranularity, animation) => ({
    ...noLegendConfig(),
    plotOptions: {
        pie: {
            shadow: false,
            borderWidth: 0,
        },
        series: {
            animation,
        },
    },
    series: [
        {
            innerSize: "65%",
            showInLegend: true,
            dataLabels: {
                enabled: false,
            },
            data: chartData,
        },
    ],
    tooltip: {
        shared: true,
        outside: true,
        useHTML: true,
        backgroundColor: colorsPalettes.carbon[0],
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
        borderWidth: 0,
        borderRadius: "6px",
        boxShadow: `0 6px 6px 0 ${colorsPalettes.carbon[200]}`,
        formatter: function () {
            return ReactDOMServer.renderToString(
                <ChartTooltip
                    timeGranularity={graphGranularityToString[timeGranularity]}
                    points={chartData.map((dataItem) => ({
                        ...dataItem,
                        series: { name: dataItem.name, y: dataItem.y, color: dataItem.color },
                    }))}
                    point={this.point}
                    yFormatter={({ value }) => percentageSignFilter()(value, 2)}
                    lastSupportedDate={lastSupportedDate}
                />,
            );
        },
        positioner: function () {
            const { name } = this.chart.hoverPoint;
            if (currentHoverSeries?.name !== name) {
                const { pageX, pageY } = (window as any).event;
                const SMALL_OFFSET = 200;
                const tooltipPosition = {
                    x: pageX - 2 * SMALL_OFFSET,
                    y: pageY - SMALL_OFFSET,
                    name,
                };
                currentHoverSeries = tooltipPosition;
            }
            return currentHoverSeries;
        },
    },
});
