import { VennDiagramBaseTooltip } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/Tooltip";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { colorsPalettes } from "@similarweb/styles";

export const getChartConfig = (chartData) => ({
    plotOptions: {
        venn: {
            borderColor: "white",
        },
        series: {
            cursor: "pointer",
            animation: false,
        },
    },
    series: [
        {
            data: chartData,
        },
    ],
    tooltip: {
        shared: true,
        outside: false,
        useHTML: true,
        backgroundColor: colorsPalettes.carbon[0],
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
        borderWidth: 0,
        borderRadius: "6px",
        boxShadow: `0 6px 6px 0 ${colorsPalettes.carbon[200]}`,
        positioner: function tooltipPositioner(boxWidth, boxHeight, point) {
            const { chart } = this;
            const { plotWidth, plotHeight } = chart;
            const { plotX, plotY } = point;
            const SMALL_PADDING = 100;
            const tooltipPosition = {
                x: plotWidth - plotX,
                y: plotY > plotHeight / 2 ? 0 : plotHeight - SMALL_PADDING,
            };
            return tooltipPosition;
        },
        formatter: (args) => {
            const { chart } = args;
            const { hoverPoint } = chart;
            return ReactDOMServer.renderToString(
                <VennDiagramBaseTooltip hoverPoint={hoverPoint} />,
            );
        },
    },
});
