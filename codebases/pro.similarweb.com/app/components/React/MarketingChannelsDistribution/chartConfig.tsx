import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import noZoomConfig from "components/Chart/src/configs/zoom/noZoomConfig";
import { ChartTooltip } from "components/React/MarketingChannelsDistribution/ChartTooltip";
import React from "react";
import ReactDOMServer from "react-dom/server";
import combineConfigs from "components/Chart/src/combineConfigs";

export const getChartConfig = (chartData, enableTooltip = true) => {
    return combineConfigs(null, [
        noLegendConfig,
        noZoomConfig,
        {
            chart: {
                backgroundColor: null,
            },
            xAxis: {
                visible: false,
            },
            yAxis: {
                visible: false,
            },
            series: [
                {
                    data: chartData,
                    animation: false,
                },
            ],
            plotOptions: {
                series: {
                    pointWidth: 8,
                },
            },
            tooltip: {
                enabled: enableTooltip,
                backgroundColor: "none",
                borderWidth: 0,
                outside: true,
                useHTML: true,
                shared: true,
                shadow: false,
                formatter: ({ chart }) => {
                    return ReactDOMServer.renderToString(<ChartTooltip chart={chart} />);
                },
                positioner: () => {
                    const { pageX, pageY } = (window as any).event;
                    const SMALL_OFFSET = 200;
                    const tooltipPosition = {
                        x: pageX - SMALL_OFFSET,
                        y: pageY,
                    };
                    return tooltipPosition;
                },
            },
        },
    ]);
};
