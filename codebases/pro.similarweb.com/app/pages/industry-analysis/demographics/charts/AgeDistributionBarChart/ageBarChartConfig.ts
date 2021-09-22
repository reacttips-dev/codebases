import { Injector } from "common/ioc/Injector";
import { percentageSignOnlyFilter } from "filters/ngFilters";
import { PngExportService } from "services/PngExportService";

import combineConfigs from "../../../../../../.pro-features/components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../../../.pro-features/components/Chart/src/configs/legend/noLegendConfig";

const X_AXIS_AGE = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export const getAgeBarChartConfig = ({ type }) => {
    const yAxisFormatter = ({ value }) => (value ? `${value}%` : "0%");
    return combineConfigs({ type }, [
        noLegendConfig,
        {
            chart: {
                type: "column",
                animation: true,
                borderColor: "#ffffff",
                height: 240,
                margin: [20, 0, 35, 35],
                style: {
                    fontFamily: "Arial",
                    fontSize: "11px",
                },
            },
            tooltip: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
                column: {
                    groupPadding: 0.45,
                    grouping: true,
                    maxPointWidth: 48,
                    minPointLength: 3,
                    pointPadding: 0.1,
                    pointWidth: 80,
                    dataLabels: {
                        color: "#38536b",
                        crop: false,
                        enabled: true,
                        formatter() {
                            return percentageSignOnlyFilter()(this.y, 0);
                        },
                        overflow: "none",
                        style: {
                            fontSize: "14px",
                            fontFamily: "Roboto",
                            fontWeight: "",
                        },
                    },
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                plotLines: [
                    {
                        color: "#AAB2BA",
                        width: 0,
                        value: 0,
                    },
                ],
                labels: {
                    format: "{value}%",
                    x: -5,
                    style: {
                        fontSize: "12px",
                        fontFamily: "Roboto",
                    },
                },
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                categories: X_AXIS_AGE,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "12px",
                        color: "#556575",
                        fontFamily: "Roboto",
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
            exporting: Injector.get<PngExportService>("pngExportService").getSettings({
                chartOptions: {
                    yAxis: [
                        {
                            labels: {
                                formatter() {
                                    return yAxisFormatter(this);
                                },
                            },
                        },
                    ],
                    xAxis: {
                        labels: {
                            formatter() {
                                return this.value;
                            },
                        },
                    },
                    title: {
                        text: null,
                        style: {
                            display: "block",
                        },
                    },
                },
            }),
        },
    ]);
};
