import combineConfigs from "../combineConfigs";
import noLegendConfig from "./legend/noLegendConfig";
import noTooltipConfig from "./tooltip/noTooltipConfig";

export default (params) =>
    combineConfigs(params, [
        noTooltipConfig,
        noLegendConfig,
        {
            xAxis: {
                tickLength: 0,
                minPadding: 0,
                title: {
                    text: null,
                },
                lineColor: "rgba(0, 0, 0, 0.12)",
                lineWidth: 1,
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false,
                },
            },
            plotOptions: {
                [params.type]: {
                    lineWidth: 2,
                    shadow: false,
                    threshold: null,
                },
                series: {
                    marker: {
                        states: {
                            hover: {
                                enabled: true,
                                lineWidth: 0,
                                radius: 5,
                            },
                        },
                    },
                },
            },
        },
    ]);
