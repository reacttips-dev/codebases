import angular from "angular";
import _ from "lodash";
import dayjs from "dayjs";
import DurationService from "services/DurationService";
import { ServerUrl } from "../exporters/HighchartExport";
import CountryService from "services/CountryService";
import { CHART_COLORS } from "constants/ChartColors";

import { chosenItems } from "common/services/chosenItems";

/**
 * Created by Sahar.Rehani on 5/18/2016.
 */

declare let similarweb;
const tickIntervals = {
    daily: 24 * 3600 * 1000,
    weekly: 24 * 3600 * 1000 * 7,
    monthly: 24 * 3600 * 1000 * 30,
};

export enum SupportedModules {
    websites,
    industryAnalysis,
    apps,
    keywords,
    keywordAnalysis,
}

export const transformWebsource = (websource: string) => {
    switch (websource) {
        case "Total" || "Combined":
            return "All Traffic";
        case "MobileWeb" || "Mobile Web":
            return "Mobile Web Only";
        case "Desktop":
            return "Desktop Only";
        case "Google":
            return "Google Play";
        case "Apple":
            return "Apple Store";
        default:
            return websource;
    }
};

export class PngExportService {
    static $inject = ["swNavigator", "$injector"];

    constructor(private swNavigator, private $injector) {}

    export(chartConfig, chartTitle, extendedParams?, utilityData?) {
        // Optional: extendedParams & utilityData

        function fontStr(size, color) {
            return `font-size: ${size}; font-family: 'Roboto', sans-serif; font-weight: 300; color: ${
                color || "#2b3d52"
            };`;
        }

        const apiParams: any = Object.assign(this.swNavigator.getParams(), extendedParams);
        const currentModule = this.swNavigator.getCurrentModule();
        const chart = chartConfig.getHighcharts ? chartConfig.getHighcharts() : chartConfig;
        const sources = this.getExportSources(apiParams, currentModule, chart, utilityData);
        let sourceElements = "";
        const chartColors = angular.copy(CHART_COLORS.main);
        const durationForAPI = DurationService.getDurationData(
            this.swNavigator.getParams().duration,
        ).forAPI;

        apiParams.webSource = apiParams.webSource || "Desktop";
        const moduleKey =
            currentModule === SupportedModules[SupportedModules.apps]
                ? chosenItems[0].AppStore
                : currentModule === SupportedModules[SupportedModules.keywords]
                ? "Google"
                : apiParams.webSource;
        chartTitle =
            apiParams.duration.indexOf("d") !== -1
                ? chartTitle.replace("Monthly", "Daily")
                : chartTitle;
        //sources = module === SupportedModules[SupportedModules.apps] ? _.map(this.chosenItems, 'Title') : sources;

        const title = `<div style="width: 1285px; padding-bottom: 18px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4;" >
                        <span style="${fontStr("35px", "#2b3d52")}" >${chartTitle}</span >
                        <span style="${fontStr(
                            "18px",
                            "#2b3d52",
                        )} padding-left: 24px;" >${transformWebsource(moduleKey)} | ${
            CountryService.countriesById[apiParams.country].text
        }</span >
                    </div >`;

        if (sources.length == 1) {
            if (currentModule === SupportedModules[SupportedModules.industryAnalysis]) {
                sources[0] = sources[0]
                    .replace("*", "")
                    .replace("$", "")
                    .replace(/_/g, " ")
                    .replace("~", " > ");
                if (sources[0] === "All") {
                    sources[0] = "All Categories";
                }
            }
            sourceElements = `<div style="margin-top: 20px;"><span style="${fontStr(
                "24px",
                "#2b3d52",
            )}">${sources[0]}</span>`;
            if (utilityData && utilityData.length > 0) {
                sourceElements += `<span style="${fontStr(
                    "24px",
                    "#3b71b8",
                )} padding-left: 8px; padding-right: 8px;">${utilityData[0] || "N/A"}</span>`;
            }
            sourceElements += `</div>`;
        } else if (sources.length > 1 && utilityData && utilityData.length > 0) {
            sources.forEach((item, index) => {
                const series = this.getSeriesByItemName(item, chart); // fixes #SIM-15660
                if (series) {
                    let opacity = !chart.legend.options.enabled && !series.visible ? 0.3 : 1;
                    if (utilityData[index].icon) {
                        opacity = !series.visible ? 0.3 : 1;
                        const imageBase64 = similarweb.utils.getBase64Image(
                            document.getElementById(utilityData[index].id),
                        );
                        sourceElements += `<div style="opacity: ${opacity}; display: inline-block; margin-right: 36px; margin-top: 20px;">
                                                <span>
                                                    <img src="${imageBase64}" style="display: inline-block; height: 16px;width: 16px;" />        
                                                    <div style="display: inline-block; margin: 0 4px -5px -10px; width: 9px; height: 9px; border-radius: 50%; background-color: ${
                                                        utilityData[index].color
                                                    }"></div>
                                                    <div style="display: inline-block; ${fontStr(
                                                        "14px",
                                                        "#2b3d52",
                                                    )}">${item}</div>
                                                </span>
                                            </div>`;
                    } else {
                        sourceElements += `<div style="opacity: ${opacity}; display: inline-block; margin-right: 36px; margin-top: 20px;">
                                                <div style="${fontStr(
                                                    "26px",
                                                    "#4a86c5",
                                                )} padding-left: 11px;">${utilityData[index]}</div>
                                                <div style="display:inline-block;">
                                                    <div style="display: inline-block; margin-right: 4px; width: 9px; height: 9px; border-radius: 50%; background-color: ${
                                                        chartColors[index]
                                                    }"></div>
                                                    <div style="display: inline-block; ${fontStr(
                                                        "14px",
                                                        "#2b3d52",
                                                    )}">${item}</div>
                                                </div>
                                            </div>`;
                    }
                }
            });
        }

        const options = {
            type: "image/png",
            filename: `${chartTitle.trim().replace(/[\s\.:,]/g, "_")} (${
                durationForAPI.from + "_" + durationForAPI.to
            })`,
        };
        const chartOptions = {
            title: {
                text: title + sourceElements,
            },
        };

        try {
            if (chartConfig.options.exporting.chartOptions.title.getTitle) {
                chartOptions.title.text = chartConfig.options.exporting.chartOptions.title.getTitle();
            }
        } catch (e) {}

        if (chart.series && chart.series.length > 0 && !chart.noDataLabel) {
            chart.exportChart(options, chartOptions);
        } else {
        }
    }

    private getSeriesByItemName(itemName, chart) {
        return chart.series.find(({ name }) => name === itemName);
    }

    getExportSources(params: any, currentModule: string, chart: any, utilityData) {
        const sourcesKey = params.key ? "key" : params.keys ? "keys" : "";
        let sources = params[sourcesKey] ? params[sourcesKey].split(",") : []; // can be websites / industries / apps
        sources =
            currentModule === SupportedModules[SupportedModules.apps]
                ? _.map(chosenItems, "Title")
                : sources;
        sources =
            currentModule === SupportedModules[SupportedModules.keywordAnalysis]
                ? _.map(utilityData, "name")
                : sources;
        return sources;
    }

    getSettings(extendedSettings?, extendedParams?) {
        // Optional: all arguments
        const config = _.clone(this.getMarkerAndXAxis(extendedParams));
        const defaultSettings = _.cloneDeep(this.getDefaultSettings());

        defaultSettings.chartOptions.xAxis[0].tickInterval = config.xAxisTickInterval;
        defaultSettings.chartOptions.xAxis[0].labels.formatter = config.xAxisLabelFormatter;
        defaultSettings.chartOptions.plotOptions.line.marker.enabled = config.isMarker;
        defaultSettings.chartOptions.plotOptions.area.marker.enabled = config.isMarker;

        return $.extend(true, defaultSettings, extendedSettings);
    }

    private getDefaultSettings() {
        return {
            enabled: true,
            url: ServerUrl,
            buttons: {
                contextButton: {
                    enabled: false,
                },
            },
            scale: 1,
            allowHTML: true,
            chartOptions: {
                chart: {
                    spacingLeft: 0,
                    spacingRight: 0,
                    spacingTop: 36,
                    spacingBottom: 0,
                    width: 1400,
                    height: 600,
                    marginLeft: 80,
                    marginRight: 80,
                    marginBottom: 60,
                    marginTop: 208,
                },
                title: {
                    useHTML: true,
                    align: "left",
                    x: 27,
                },
                xAxis: [
                    {
                        type: "datetime",
                        gridLineWidth: 0,
                        gridLineDashStyle: "dash",
                        isDirty: true,
                        tickInterval: undefined,
                        labels: {
                            style: {
                                textTransform: "uppercase",
                                fontSize: "11px",
                                color: "#919191",
                            },
                            formatter: function () {
                                return this.value;
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        isDirty: true,
                        gridLineWidth: 0.5,
                        min: 0,
                        title: {
                            text: null,
                        },
                        tickInterval: undefined,
                        labels: {
                            style: {
                                textTransform: "uppercase",
                                fontSize: "11px",
                                color: "#919191",
                            },
                            formatter: function () {
                                return this.value;
                            },
                        },
                    },
                ],
                plotOptions: {
                    line: {
                        marker: {
                            enabled: true,
                        },
                    },
                    area: {
                        marker: {
                            enabled: true,
                        },
                    },
                },
                legend: {
                    x: 12,
                    symbolWidth: 0,
                    symbolHeight: 0,
                    align: "left",
                    layout: "horizontal",
                    verticalAlign: "top",
                    itemDistance: 30,
                    floating: false,
                    y: -20,
                    itemMarginTop: 30,
                    itemMarginBottom: 5,
                    itemStyle: {
                        fontFamily: "sans serif",
                        fontSize: "14px",
                        fontWeight: "200",
                    },
                    useHTML: true,
                    labelFormatter: function () {
                        //cleaning the 'old algorithm' from the name
                        const opacity = this.visible ? 1 : 0.3;
                        let name =
                            this.name.indexOf("Old Algorithm") > 0
                                ? this.name.substring(
                                      0,
                                      this.name.indexOf("[") > 0
                                          ? this.name.indexOf("[") - 1
                                          : undefined,
                                  )
                                : this.name;
                        name = name
                            .replace("*", "")
                            .replace("$", "")
                            .replace(/_/g, " ")
                            .replace("~", " > ");

                        // hiding svg bullets on export
                        if (this.legendSymbol) {
                            this.legendSymbol.hide();
                        }
                        if (this.legendLine) {
                            this.legendLine.hide();
                        }

                        return `<div style="display: inline-block; margin-right: 6px;">
                                <span style="background-color: ${this.color}; opacity: ${opacity}; display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px;"></span>
                                <span>${name}</span></div>`;
                    },
                },
            },
        };
    }

    private getMarkerAndXAxis(extendedParams) {
        // Optional: all arguments
        const params: any = Object.assign(this.swNavigator.getParams(), extendedParams),
            from = params.from || DurationService.getDurationData(params.duration).forAPI.from,
            to = params.to || DurationService.getDurationData(params.duration).forAPI.to,
            isWindow = params.isWindow || params.duration === "28d",
            durationInMonths = DurationService.getMonthsFromApiDuration(from, to, isWindow),
            config = {
                "0": {
                    // last 28 days
                    Daily: {
                        xAxisTickInterval: tickIntervals.daily * 2,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.daily * 2,
                        isMarker: true,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "1": {
                    // last 1 month
                    Daily: {
                        xAxisTickInterval: tickIntervals.daily * 2,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.daily * 2,
                        isMarker: true,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "2": "1",
                "3": {
                    // last 3 months
                    Daily: {
                        xAxisTickInterval: tickIntervals.weekly,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.weekly,
                        isMarker: true,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "4": "3",
                "5": "3",
                "6": {
                    // last 6 months
                    Daily: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "12": {
                    // last 12 months
                    Daily: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: false,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "18": "12",
                "24": {
                    // last 24 months
                    Daily: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: false,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly,
                        isMarker: true,
                    },
                },
                "24+": {
                    // last 24 months
                    Daily: {
                        xAxisTickInterval: tickIntervals.monthly * 2,
                        isMarker: false,
                    },
                    Weekly: {
                        xAxisTickInterval: tickIntervals.monthly * 2,
                        isMarker: false,
                    },
                    Monthly: {
                        xAxisTickInterval: tickIntervals.monthly * 2,
                        isMarker: true,
                    },
                },
            };

        if (!params.timeGranularity) {
            params.timeGranularity = "Monthly";
        } // for cases which there isn't a granularity
        if (typeof config[durationInMonths] === "string") {
            // cases like 2/4/5 months duration
            config[durationInMonths] = config[config[durationInMonths]];
        } else if (!config[durationInMonths]) {
            // cases when duration isn't described in "config"
            config[durationInMonths] = config["6"];
            if (durationInMonths > 24) {
                config[durationInMonths] = config["24+"];
            }
        }

        // xAxisLabelFormatter
        const format =
            durationInMonths < 12 && params.timeGranularity != "Monthly" ? "D MMM." : `MMM'YY`;
        config[durationInMonths][params.timeGranularity]["xAxisLabelFormatter"] = function () {
            // don't change syntax to arrow function for "this" scope reasons
            return dayjs.utc(this.value).format(format);
        };

        return config[durationInMonths][params.timeGranularity];
    }
}

angular.module("sw.common").service("pngExportService", PngExportService);
