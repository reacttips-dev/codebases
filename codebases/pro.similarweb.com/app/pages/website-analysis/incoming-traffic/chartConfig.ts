import dayjs from "dayjs";
import monthlyIntervalConfig from "../../../../.pro-features/components/Chart/src/configs/granularity/monthlyIntervalConfig";
import combineConfigs from "../../../../.pro-features/components/Chart/src/combineConfigs";
import xAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { minVisitsAbbrFilter, percentageFilter } from "filters/ngFilters";
import sharedTooltipWithData from "../../../../.pro-features/components/Chart/src/configs/tooltip/sharedTooltipWithData";
import noMarginConfig from "../../../../.pro-features/components/Chart/src/configs/margin/noMarginConfig";
import xAxisCrosshair from "../../../../.pro-features/components/Chart/src/configs/xAxis/xAxisCrosshair";
import { Injector } from "common/ioc/Injector";
import { PngExportService } from "services/PngExportService";
import { watermarkService } from "common/services/watermarkService";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import ChangeBellWithoutTooltip from "components/Chart/src/configs/plotLines/ChangeBellWithoutTooltip";
import { swSettings } from "common/services/swSettings";

export const getChartConfig = ({ type, filter, isDaily, isSingle, data, webSource, from }) => {
    const format = isDaily ? "D.MMM" : "MMM YY";
    const newMMXAlgoStartDate = dayjs(swSettings.current.resources.NewAlgoMMX);
    const currentGranularity = monthlyIntervalConfig;
    const yAxisFormatter = ({ value }) => filter[0]()(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    const configs = [
        sharedTooltipWithData({ filter, xAxisFormat: format, data }),
        currentGranularity,
        yAxisLabelsConfig,
        xAxisLabelsConfig /*, noLegendConfig*/,
    ];
    if (isSingle) {
        configs.push(xAxisCrosshair);
    }
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        ...configs,
        webSource !== devicesTypes.DESKTOP &&
            from.format("YYYY-MM-DD") !== newMMXAlgoStartDate.format("YYYY-MM-DD") &&
            ChangeBellWithoutTooltip(newMMXAlgoStartDate),
        {
            chart: {
                height: null,
                type,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {
                    load: function () {
                        watermarkService.add.call(this);
                    },
                },
                margin: [35, 41, 50, 80],
            },
            plotOptions: {
                series: {
                    turboThreshold: 1000,
                },
                area: {
                    fillOpacity: 1,
                },
                line: {
                    lineWidth: 2,
                    connectNulls: false,
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
                labels: {
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        color: "#919191",
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
            legend: {
                floating: true,
                x: 0,
                y: -20,
                borderRadius: 0,
                borderWidth: 0,
                symbolWidth: 20,
                symbolRadius: 10,
                useHTML: true,
                align: "left",
                layout: "horizontal",
                verticalAlign: "top",
                enabled: false,
            },
            exporting: Injector.get<PngExportService>("pngExportService").getSettings({
                chartOptions: {
                    chart: {
                        marginLeft: 100,
                    },
                    yAxis: [
                        {
                            labels: {
                                formatter: function () {
                                    return yAxisFormatter(this);
                                },
                            },
                        },
                    ],
                    xAxis: {
                        minPadding: 0,
                    },
                    title: {
                        text: null,
                        style: {
                            display: "block",
                        },
                    },
                    legend: {
                        enabled: true,
                    },
                },
            }),
        },
    ]);
};

export const getPieConfig = ({ type, filter }) => {
    const format = "MMM YY";
    const yAxisFormatter = ({ value }) => filter[0]()(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format(format);
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        noMarginConfig,
        {
            chart: {
                type,
                plotBackgroundColor: "transparent",
                events: {},
            },
            plotOptions: {
                pie: {
                    innerSize: "60%",
                    dataLabels: true,
                },
            },
            legend: {
                enabled: false,
            },
            exporting: {
                enabled: false,
                chartOptions: {
                    chart: {
                        backgroundColor: "#FFFFFF",
                        margin: [80, 150, 80, 150],
                        spacing: 10,
                    },
                    legend: {
                        enabled: true,
                        margin: 50,
                        labelFormatter: function () {
                            return `<b>${this.options.name}</b>: ${minVisitsAbbrFilter()(
                                this.options.searchTotal,
                            )} (${this.options.percent}%)`;
                        },
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                color: "transparent",
                                connectorColor: "transparent",
                                enabled: true,
                                formatter: function () {
                                    return "";
                                },
                                showInLegend: true,
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
            },
            tooltip: {
                formatter: function () {
                    return (
                        this.key +
                        "<br /><b>" +
                        percentageFilter()(this.percentage / 100, 2) +
                        "%</b>"
                    );
                },
            },
        },
    ]);
};

export const dateToUTC = (dateString) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};
