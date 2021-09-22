import { icons } from "@similarweb/icons";
import { Highcharts } from "libraries/reactHighcharts";
import swLog from "@similarweb/sw-log";
import angular from "angular";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { ServerUrl } from "../exporters/HighchartExport";
import { ChartMarkerService } from "./ChartMarkerService";
import { tooltipPositioner } from "./HighchartsPositioner";
import { watermarkService } from "../../scripts/common/services/watermarkService";
import { CHART_COLORS } from "constants/ChartColors";
import { INTERVALS } from "constants/Intervals";
import { CHART_ICONS } from "../constants/ChartIcons";
import { GRAPH_ZOOM_PNG } from "constants/GraphZoomPng";
import { SwTrack } from "services/SwTrack";

declare let similarweb;

angular.module("sw.common").service("ngHighchartsConfig", function ($filter, pngExportService) {
    const BENCHMARK_COLOR = CHART_COLORS.benchmark,
        DEFAULT_COLORS = CHART_COLORS.main,
        MOBILEWEB_COLORS = CHART_COLORS.mobileWeb,
        MOBILEWEB_ICONS = CHART_ICONS.mobileWeb,
        ORGANICPAID_COLORS = undefined,
        ORGANICPAID_ICONS = CHART_ICONS.organicPaid,
        NEW_COLOR_PALETTE = CHART_COLORS.compareMainColors,
        MALE_FEMALE_COLORS = CHART_COLORS.maleFemaleColors,
        MALE_FEMALE_ICONS = CHART_ICONS.maleFemaleIcons,
        AUDIENCE_OVERVIEW_COLORS = CHART_COLORS.compareMainColors;

    /**
     * Label styling for the axis
     */
    const labelsStyle = {
        fontSize: "13px",
        fontFamily: '"Roboto", sans-serif',
        color: "#707070",
    };

    /**
     * Default highcharts tooltip positioner modified to show tooltip on the right above the point
     */

    /**
     * Default highcharts tick positioner modified not to show 0 tick
     */
    const linearTickPositioner = function (min, max) {
        const getMagnitude = function (num) {
                return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
            },
            normalizeTickInterval = function (interval, multiples, magnitude) {
                // round to a tenfold of 1, 2, 2.5 or 5
                const normalized = interval / magnitude;
                // normalize the interval to the nearest multiple
                if (magnitude === 1) {
                    multiples = [1, 2, 5, 10];
                } else if (magnitude <= 0.1) {
                    multiples = [1 / magnitude];
                }
                for (let i = 0; i < multiples.length; i++) {
                    interval = multiples[i];
                    if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
                        break;
                    }
                }
                // multiply back to the correct magnitude
                interval *= magnitude;
                return interval;
            },
            multiples = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500], // highcharts defaults
            tickPixelIntervalOption = 72, // highcharts defaults
            len = this.len, //axis length
            // Calculation of interval taken from highcharts code
            interval =
                ((max - min) * tickPixelIntervalOption) / Math.max(len, tickPixelIntervalOption),
            tickInterval = normalizeTickInterval(interval, multiples, getMagnitude(interval));
        // Call highcharts default linearTickPositioner
        let ticks = this.__proto__.getLinearTickPositions(tickInterval, min, max);
        // Remove ticks with negative values
        ticks = _.filter(ticks, function (num) {
            return num >= 0;
        });
        // If tick interval is 5 or more and first tick is 0 change it to 1
        if (ticks[0] == 0 && ticks[1] >= 5) {
            ticks[0] = 1;
        }
        // If tick interval is less than 5 remove 0 tick
        else if (ticks[0] == 0) {
            ticks.shift();
        }
        return ticks;
    };

    const legendItemClick = function (legendItem, e, trackName) {
        let action;
        if (!legendItem) {
            return false;
        }
        if (legendItem.visible) {
            $(e.browserEvent.target).parents(".highcharts-legend-item").css("opacity", 0.3);
            action = "remove";
        } else {
            $(e.browserEvent.target).parents(".highcharts-legend-item").css("opacity", 1);
            action = "add";
        }
        SwTrack.all.trackEvent("Graph filter", action, trackName + "/" + legendItem.name);
        return true;
    };

    const origRenderer = Highcharts.Renderer.prototype.image;
    Highcharts.Renderer.prototype.image = function () {
        const imageElem = origRenderer.apply(this, arguments);
        imageElem.attr("preserveAspectRatio", "xMinYMin");
        return imageElem;
    };

    const chartColors = function (mobileWebColor, mapFromSource, path) {
        if (mapFromSource) {
            return _.cloneDeep(CHART_COLORS[path]);
        }
        return _.cloneDeep(mobileWebColor ? MOBILEWEB_COLORS : DEFAULT_COLORS);
    };

    const mobileWebColors = function (webSource) {
        return iconColorMobileWebMapper(webSource, MOBILEWEB_COLORS);
    };

    const mobileWebIcons = function (webSource: string) {
        return iconColorMobileWebMapper(webSource, MOBILEWEB_ICONS);
    };

    const organicPaidColors = function (source) {
        return iconColorMobileWebMapper(source, ORGANICPAID_COLORS);
    };

    const organicPaidIcons = function (source: string) {
        return iconColorMobileWebMapper(source, ORGANICPAID_ICONS);
    };

    const maleFemaleColors = function (gender: string) {
        return iconColorGenderMapper(gender, MALE_FEMALE_COLORS);
    };

    const maleFemaleIcons = function (gender: string) {
        return iconColorGenderMapper(gender, MALE_FEMALE_ICONS);
    };

    const iconColorGenderMapper = function (gender: string, iconOrColorArray: string[]) {
        switch (gender) {
            case "Male":
                return [iconOrColorArray[0]];
            case "Female":
                return [iconOrColorArray[1]];
            default:
                return _.cloneDeep(iconOrColorArray);
        }
    };

    const iconColorMobileWebMapper = function (webSource: string, iconOrColorArray: string[]) {
        switch (webSource) {
            case "Desktop":
                return [iconOrColorArray[0]];
            case "MobileWeb":
            case "Mobile Web":
                return [iconOrColorArray[1]];
            default:
                return _.cloneDeep(iconOrColorArray);
        }
    };

    const audienceOverviewColors = function () {
        return _.cloneDeep(AUDIENCE_OVERVIEW_COLORS);
    };

    const newColorPaletteColors = function () {
        return _.cloneDeep(NEW_COLOR_PALETTE);
    };

    const gauge = function (data) {
        return {
            options: {
                chart: {
                    type: "solidgauge",
                },
                pane: {
                    size: "160%",
                    center: ["50%", "90%"],
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: "#EEE",
                        innerRadius: "60%",
                        outerRadius: "100%",
                        shape: "arc",
                    },
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: -30,
                            borderWidth: 0,
                            useHTML: true,
                        },
                    },
                },
                yAxis: {
                    min: 1,
                    max: 100,
                    lineWidth: 0,
                    tickInterval: 100,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    startOnTick: true,
                    stops: [
                        [0, CHART_COLORS.chartMainColors[0]],
                        [1, CHART_COLORS.chartMainColors[0]],
                        // [0, '#DF5353'], // red
                        // [0.2, '#DE8938'], // orange
                        // [0.45, '#DDDF0D'], // yellow
                        // [0.75, '#A0D122'], // light green
                        // [0.9, '#55BF3B']  // green
                    ],
                    labels: {
                        enabled: false,
                    },
                },
                credits: {
                    enabled: false,
                },
                exporting: {
                    enabled: false,
                },
                lang: {
                    noData: "",
                },
                noData: {
                    style: {
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#545454",
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            title: { text: null },
            series: [
                {
                    data: [data],
                    dataLabels: false,
                },
            ],
        };
    };

    const column = function (type, compare) {
        const appTrafficSources = {
            "In-Store Search": {
                title: "utils.apps.trafficSources.inStoreSearch",
                priority: 0,
            },
            "Referring Apps": {
                title: "utils.apps.trafficSources.referringApps",
                priority: 1,
            },
            Categories: {
                title: "utils.apps.trafficSources.categories",
                priority: 2,
            },
            Charts: {
                title: "utils.apps.trafficSources.charts",
                priority: 2,
            },
            Featured: {
                title: "utils.apps.trafficSources.featured",
                priority: 3,
            },
            "Developer Pages": {
                title: "utils.apps.trafficSources.developerPages",
                priority: 4,
            },
            "My Apps": {
                title: "utils.apps.trafficSources.myApps",
                priority: 5,
            },
            Wishlist: {
                title: "utils.apps.trafficSources.wishlist",
                priority: 6,
            },
            "Playstore (Misc)": {
                title: "utils.apps.trafficSources.playstoreMisc",
                priority: 7,
            },
            "iTunes (Misc)": {
                title: "utils.apps.trafficSources.iTunesMisc",
                priority: 7,
            },
        };
        const webTrafficSources = {
            Direct: {
                title: "utils.direct",
                color: "#069",
                priority: 0,
            },
            Mail: {
                title: "utils.mail",
                color: "#8E70E0",
                priority: 1,
            },
            Referrals: {
                title: "utils.referrals",
                state: "websites-trafficReferrals",
                color: "#71CA2F",
                priority: 2,
            },
            Search: {
                title: "utils.search",
                state: "websites-trafficSearch",
                color: "#F60",
                priority: 3,
            },
            Social: {
                title: "utils.social",
                state: "websites-trafficSocial",
                color: "#00B5F0",
                priority: 4,
            },
            "Display Ads": {
                title: "utils.displayads",
                state: "websites-trafficDisplay-overview",
                icon: "display-ads",
                color: "#F3C",
                priority: 5,
            },
        };
        const trafficSources = type == "web" ? webTrafficSources : appTrafficSources;
        const setCategories = function (categories) {
            const iconClass = function (key, val) {
                return (
                    "sw-icon-" +
                    ((val && val.icon) || key.toLowerCase())
                        .replace(/\s/g, "-")
                        .replace(/[^a-z0-9-]/gim, "")
                );
            };
            return _.map(categories, function (key: string) {
                return (
                    '<div class="label-icon">' +
                    (_.isUndefined(trafficSources[key].priority) || compare
                        ? '<i class="' +
                          iconClass(key, trafficSources[key]) +
                          '" style="color: #abb1b8;"></i>'
                        : '<i class="' +
                          iconClass(key, trafficSources[key]) +
                          '" style="color: ' +
                          CHART_COLORS.chartMainColors[trafficSources[key].priority] +
                          ';"></i>') +
                    "</div>" +
                    $filter("i18n")(trafficSources[key].title)
                );
            });
        };
        const transformData = function (data) {
            const total = _.reduce(
                data,
                function (memo: number, num: number) {
                    return memo + num;
                },
                0,
            );
            const mappedData = _.map(data, function (val: number, key) {
                return {
                    key,
                    y: (val / total) * 100,
                };
            });
            return _.sortBy(mappedData, function (source) {
                return trafficSources[source.key].priority;
            });
        };
        const tooltipFormatter = function (text) {
            return text;
        };
        const chartConfig = {
            exportPng: (title: string) => {},
            options: {
                colors: compare ? CHART_COLORS.compareMainColors : CHART_COLORS.chartMainColors,
                chart: {
                    type: "column",
                    animation: true,
                    height: 255,
                    spacing: [40, 10, 15, 10],
                    margin: [40, 10, 65, 40],
                    events: {
                        load() {
                            watermarkService.add.call(this, { position: "center" });
                        },
                        redraw() {
                            if (!this.series || this.series.length == 0) {
                                watermarkService.remove(this);
                            }
                        },
                    },
                },
                plotOptions: {
                    column: {
                        //pointPadding: 0.3,
                        groupPadding: 0.1,
                        borderWidth: 0,
                        pointWidth: compare ? null : 50,
                        minPointLength: 2,
                        dataLabels: {
                            enabled: !compare,
                            color: "#707070",
                            useHTML: true,
                            y: -25,
                            style: {
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "14px",
                                fontWeight: "bold",
                            },
                            formatter() {
                                return (Math.round(this.point.y * 100) / 100).toFixed(2) + "%";
                            },
                        },
                    },
                },
                xAxis: {
                    //categories: categories(),
                    tickWidth: 0,
                    labels: {
                        align: "center",
                        useHTML: true,
                        style: {
                            fontSize: "13px",
                            fontFamily: '"Roboto", sans-serif',
                            color: "#707070",
                        },
                    },
                },
                yAxis: {
                    gridLineColor: "#e4e4e4",
                    min: 0,
                    max: 105,
                    startOnTick: false,
                    endOnTick: false,
                    title: null,
                    tickInterval: 25,
                    showLastLabel: true,
                    labels: {
                        align: "left",
                        enabled: true,
                        useHTML: true,
                        x: -30,
                        format: "{value}%",
                        style: {
                            fontSize: "12px",
                            textTransform: "uppercase",
                            fontFamily: '"Roboto", sans-serif',
                            color: "#aaa",
                        },
                    },
                },
                legend: {
                    enabled: compare,
                    floating: true,
                    useHTML: true,
                    align: "left",
                    borderRadius: 0,
                    borderWidth: 0,
                    verticalAlign: "top",
                    //rtl: true,
                    //width: 600,
                    y: -45,
                    labelFormatter() {
                        return `<span class="sw-default-cursor">${this.name}</span>`;
                    },
                    itemStyle: {
                        fontSize: "12px",
                        fontWeight: 300,
                        fontFamily: "Roboto, sans-serif",
                        color: "#545454",
                    },
                    symbolHeight: 8,
                    symbolWidth: 8,
                    symbolRadius: 4,
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    backgroundColor: "#fff",
                    borderWidth: 0,
                    borderColor: "#AAA",
                    crosshairs: {
                        width: 1,
                        dashStyle: "dot",
                        color: "#18A3FC",
                    },
                    style: {
                        color: "#707070",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "14px",
                    },
                    formatter() {
                        const lines = [];
                        // For retention chart prepend "Days since install: " string
                        _.isNumber(this.x)
                            ? lines.push(
                                  '<div class="date">Days since install: ' + this.x + "</div>",
                              )
                            : lines.push('<div class="date"' + this.x + "</div>");
                        this.points?.forEach((point) => {
                            lines.push(`<div>
                                                    <span class="item-marker" style="vertical-align: bottom; background-image: ${
                                                        ChartMarkerService.createMarkerStyle(
                                                            point.series.color,
                                                        ).background
                                                    };"></span>
                                                    <span style="line-height: 24px;">${
                                                        point.series.name
                                                    }: <b style="color: ${
                                point.series.color
                            }">${$filter("swNumber")(
                                tooltipFormatter(point.point.y),
                                2,
                            )}%</b></span>
                                                </div>`);
                        });
                        return lines.join("");
                    },
                    positioner: tooltipPositioner,
                },
                credits: {
                    enabled: false,
                },
                exporting: {
                    enabled: false,
                },
                lang: {
                    noData: $filter("i18n")("mobileApps.overview.ranking.chart.filter.nodata"),
                },
                noData: {
                    style: {
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#545454",
                    },
                },
            },
            title: { text: null },
            func(chart) {
                // during export, Chart.getSVG() is called, where the chart is cloned. ignore it.
                // http://api.highcharts.com/highcharts#Chart.getSVG
                // https://code.highcharts.com/modules/exporting.src.js
                if (chart.options.chart.forExport) {
                    return;
                }
                // expose exportPng functionality outside of chart object
                chartConfig.exportPng = function (chartTitle) {
                    if (chart.series && chart.series.length > 0) {
                        chart.exportChart(
                            {
                                type: "image/png",
                                filename: chartTitle.trim().replace(/[\s\.:,]/g, "_"),
                            },
                            { title: { text: chartTitle } },
                        );
                    } else {
                        swLog.info("No chart data, cancelling export");
                    }
                };
            },
        };
        return {
            chartConfig,
            transformData,
            setCategories,
        };
    };

    /**
     * Create a chart config for a Line Chart
     * @param _options
     * options to configure the line
     * @returns {{ config }}
     *
     * */
    const line: any = function (_options) {
        _options = _options || {};
        const defaults = {
            tooltipFormatter(text) {
                return $filter("number")(text);
            },
            xAxisFormatter() {
                let format = "D MMM.",
                    xAxis,
                    intervalYears;
                try {
                    xAxis = this.chart.xAxis[0];
                    if (xAxis.tickInterval === INTERVALS.monthly) {
                        format = "MMM'YY";
                    }
                } catch (e) {}
                return dayjs(this.value).utc().format(format);
            },
            yAxisFormatter() {
                return this.value;
            },
        };

        const options: any = _.defaults(_options, defaults);

        const config = {
            exportPng: (title: string) => {},
            options: {
                colors: _.take(CHART_COLORS.chartMainColors, 8),
                plotOptions: {
                    line: {
                        shadow: {
                            color: "rgba(0,0,0,0.2)",
                            offsetX: 0,
                            offsetY: 2,
                            opacity: 0.5,
                            width: 3,
                        },
                        marker: {
                            enabled: true,
                            lineWidth: 2,
                            fillColor: null,
                            lineColor: "transparent",
                            radius: 4,
                            states: {
                                hover: {
                                    enabled: true,
                                },
                            },
                        },
                        events: {
                            legendItemClick(e) {
                                return legendItemClick(
                                    this,
                                    e,
                                    options.viewOptions.trackName || "Line Graph",
                                );
                            },
                        },
                    },
                },
                chart: {
                    type: "line",
                    zoomType: "x",
                    resetZoomButton: {
                        position: {
                            verticalAlign: "bottom",
                            x: -8,
                            y: -36,
                        },
                        theme: {
                            fill: "#687487",
                            stroke: "#687487",
                            r: 2,
                            style: {
                                color: "#fff",
                            },
                            states: {
                                hover: {
                                    fill: "#2b3d52",
                                    r: 2,
                                    style: {
                                        color: "#fff",
                                    },
                                },
                            },
                        },
                    },
                    animation: true,
                    height: 329,
                    spacingTop: 10,
                    //marginTop: 70,
                    fillOpacity: 1,
                    plotBackgroundColor: "transparent", // a 'must' property for zoom cursor
                    events: {
                        load() {
                            const chart = this;
                            if (chart.options.chart.forExport) {
                                // for exporting to png - override series object (regular way doesn't work)
                                _.each(this.series, function (series) {
                                    series.update(
                                        {
                                            shadow: false,
                                        },
                                        false,
                                    );
                                });
                                chart.redraw();
                            } else {
                                chart.plotBackground.css({
                                    cursor: `url(${GRAPH_ZOOM_PNG}), col-resize`,
                                });
                            }
                            watermarkService.add.call(this);
                        },
                        selection(event) {
                            if (!event.xAxis) {
                                SwTrack.all.trackEvent("Reset", "click", "Reset Zoom");
                            }
                        },
                    },
                },
                legend: {
                    floating: false,
                    x: "-50%",
                    //y: -20,
                    borderRadius: 0,
                    borderWidth: 0,
                    symbolWidth: 20,
                    symbolRadius: 10,
                    useHTML: true,
                    align: "center",
                    layout: "horizontal",
                    verticalAlign: "top",
                    enabled: true,
                },
                tooltip: {
                    useHTML: true,
                    shared: true,
                    backgroundColor: "#fff",
                    borderWidth: 0,
                    borderColor: "#AAA",
                    style: {
                        color: "#707070",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "14px",
                    },
                    formatter() {
                        const date = dayjs.utc(this.x).format("dddd, MMM DD, YYYY"),
                            lines = [];
                        lines.push('<div class="date">' + date + "</div>");
                        this.points?.forEach((point) => {
                            lines.push(`<div>
                                                    <span class="item-marker" style="vertical-align: bottom;  background-image: ${
                                                        ChartMarkerService.createMarkerStyle(
                                                            point.series.color,
                                                        ).background
                                                    };"></span>
                                                    <span style="line-height: 24px;">${
                                                        point.series.name
                                                    }: <b style="color: ${
                                point.series.color
                            }">${options.tooltipFormatter(point.point.y)}</b></span>
                                                </div>`);
                        });
                        return lines.join("");
                    },
                    positioner: tooltipPositioner,
                },
                credits: {
                    enabled: false,
                },
                exporting: pngExportService.getSettings(options.exporting, options.params),
                lang: {
                    noData: $filter("i18n")("mobileApps.overview.ranking.chart.filter.nodata"),
                },
                noData: {
                    style: {
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#545454",
                    },
                },
            },
            xAxis: {
                title: { text: null },
                type: "datetime",
                gridLineWidth: 0,
                gridLineDashStyle: "solid",
                gridLineColor: "#e2e2e2",
                lineWidth: 1,
                tickWidth: 1,
                minPadding: 0,
                minorGridLineWidth: 0,
                labels: {
                    useHTML: true,
                    style: labelsStyle,
                    formatter: options.xAxisFormatter,
                },
                crosshair: {
                    width: 1,
                    dashStyle: "dash",
                    color: "#18A3FC",
                    zIndex: 2,
                },
            },
            yAxis: {
                title: { text: null },
                gridLineColor: "rgba(200,200,200,0.4)",
                gridLineWidth: 1,
                gridLineDashStyle: "solid",
                lineWidth: 0,
                reversed: true,
                allowDecimals: true,
                startOnTick: false,
                endOnTick: true,
                tickPositioner: linearTickPositioner,
                labels: {
                    useHTML: true,
                    style: labelsStyle,
                    formatter: options.yAxisFormatter,
                },
            },
            title: { text: null },
            series: [],
            func(chart) {
                // during export, Chart.getSVG() is called, where the chart is cloned. ignore it.
                // http://api.highcharts.com/highcharts#Chart.getSVG
                // https://code.highcharts.com/modules/exporting.src.js
                if (chart.options.chart.forExport) {
                    return;
                }
                // expose exportPng functionality outside of chart object
                config.exportPng = function (chartTitle) {
                    pngExportService.export(chart, chartTitle);
                };
            },
        };

        return config;
    };

    /* Used with the trend-line cell template in the single metric widget */
    const trendLineWidget = function (data, format) {
        return {
            options: {
                chart: {
                    type: "area",
                    spacing: [24, 0, 24, 0],
                    backgroundColor: "transparent",
                    style: {
                        overflow: "visible",
                    },
                    skipClone: true,
                    height: 100,
                },
                credits: { enabled: false },
                plotOptions: {
                    area: {
                        fillColor: "#f1f8fe",
                        lineColor: "#0999e1",
                        marker: { enabled: false },
                    },
                    series: {
                        states: {
                            hover: {
                                halo: {
                                    size: 0,
                                },
                            },
                        },
                    },
                },
                legend: {
                    enabled: false,
                },
                exporting: {
                    enabled: false,
                },
                tooltip: {
                    enabled: true,
                    useHTML: true,
                    shared: true,
                    backgroundColor: "#fff",
                    borderWidth: 0,
                    borderColor: "#AAA",
                    outside: true,
                    crosshairs: {
                        width: 1,
                        dashStyle: "dot",
                        color: "#18A3FC",
                        zIndex: 5,
                    },
                    style: {
                        color: "#707070",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "12px",
                    },
                    formatter() {
                        return $filter(format)(this.y);
                    },
                },
            },
            series: [
                {
                    data,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                radius: 3,
                            },
                        },
                    },
                },
            ],
            title: {
                text: null,
            },
            size: {
                width: 190,
                height: 100,
            },
            // the following styles hide the x and y axis completely
            xAxis: {
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: "transparent",
                labels: {
                    enabled: false,
                },
                minorTickLength: 0,
                tickLength: 0,
            },
            yAxis: {
                lineWidth: 0,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                lineColor: "transparent",
                labels: {
                    enabled: false,
                },
                minorTickLength: 0,
                tickLength: 0,
                title: { text: null },
            },
        };
    };

    const lineGraphWidget = function (options, data) {
        const stackedGraph = options.stacked && data.length > 1 && options.showStacked;
        const isEnabledForOnePoint = data[0].data && data[0].data.length === 1; //SIM-6782
        const legendAlignTopLeft = options.legendAlign === "left";
        const legendTop = _.isNumber(options.viewOptions.legendTop)
            ? options.viewOptions.legendTop
            : legendAlignTopLeft
            ? 10
            : 20;
        const daily =
            (options.viewOptions.hideMarkersOnDaily || options.hideMarkersOnDaily) &&
            options.timeGranularity === "Daily";
        const isEnabled =
            (options.viewOptions.showMarkersOnSingle &&
                data[0].data &&
                data[0].data.length === 1) ||
            !daily; // && (options.markerEnabled !== false);
        const zoomEnabled = options.timeGranularity === "Monthly" ? null : "x";
        const legendWrap =
            options.viewOptions.legendWrap &&
            window.innerWidth > 1204 &&
            window.innerWidth < 1480 &&
            legendAlignTopLeft;
        const formatParam = _.isNumber(options.formatParameter)
            ? options.formatParameter
            : options.yPercentPrecision;
        if (options.viewOptions.sortByTrafficSources) {
            data = _.sortBy(data, similarweb.utils.volumesAndSharesSplited.sort);
            data = _.map(data, (item: any, index) => {
                item.color = newColorPaletteColors()[index];
                item.shadow = false;
                item.marker.symbol = ChartMarkerService.createMarkerStyle(item.color).background;
                return item;
            });
        }

        const config = {
            exportPng: (title: string) => {},
            options: {
                chart: _.merge(
                    {},
                    {
                        type: stackedGraph ? "area" : "line",
                        zoomType: zoomEnabled,
                        animation: true,
                        spacing: [0, 10, 0, 0],
                        height: parseInt(options.height) || 200,
                        plotBackgroundColor: "transparent", // a 'must' property for zoom cursor
                        events: _.merge(
                            {
                                load() {
                                    const chart = this;
                                    if (chart.options.chart.forExport) {
                                        // for exporting to png - override series object (regular way doesn't work)
                                        _.each(this.series, function (series) {
                                            series.update(
                                                {
                                                    shadow: false,
                                                },
                                                false,
                                            );
                                        });
                                        chart.redraw();
                                    } else {
                                        if (zoomEnabled) {
                                            chart.plotBackground.css({
                                                cursor: `url(${GRAPH_ZOOM_PNG}), col-resize`,
                                            });
                                            if (stackedGraph) {
                                                chart.seriesGroup.css({
                                                    cursor: `url(${GRAPH_ZOOM_PNG}), col-resize`,
                                                });
                                            }
                                        }
                                        setTimeout(function () {
                                            //fix for chart width
                                            try {
                                                chart.reflow();
                                            } catch (e) {}
                                        }, 300);
                                    }
                                    if (stackedGraph) {
                                        watermarkService.add.call(chart, { opacity: 0.1 });
                                    } else {
                                        watermarkService.add.call(chart);
                                    }
                                },
                                redraw(event) {
                                    // for SQS & Partial data info tips
                                    // check if getting here every time to reset zoom

                                    if (
                                        this.options &&
                                        this.options.chart &&
                                        this.options.chart.forExport
                                    ) {
                                        return;
                                    }
                                    if (_.isUndefined(event.target.xAxis)) {
                                        return;
                                    }
                                    const xAxis = event.target.xAxis[0];
                                    const plotElements = xAxis.plotLinesAndBands;
                                    if (xAxis && plotElements && plotElements.length > 0) {
                                        options.viewOptions.plotLines = [];
                                        plotElements.forEach(function (item) {
                                            // ignore plotlines with labels
                                            if (item.options.label) {
                                                return;
                                            }
                                            if (item.svgElem) {
                                                const chartInfotipPos = {
                                                    position: "absolute",
                                                    bottom: item.svgElem.getBBox().height + 14,
                                                    left: item.svgElem.getBBox().x - 13,
                                                };
                                                const styleObj = {
                                                    position: chartInfotipPos,
                                                    infoClass: item.options.infoClass,
                                                    infoTemplate: item.options.infoTemplate,
                                                    infoText: item.options.infoText,
                                                    isShown: true,
                                                };
                                                options.iconInfoCtrl(styleObj);
                                            }
                                        });
                                    }
                                },
                                selection(event) {
                                    if (!event.xAxis) {
                                        SwTrack.all.trackEvent("Reset", "click", "Reset Zoom");
                                    }
                                },
                            },
                            options.events || {},
                        ),
                        marginTop: legendWrap ? 80 : legendAlignTopLeft ? 50 : 10,
                    },
                    options.chart,
                ),
                lang: _.merge(
                    {},
                    {
                        noData: $filter("i18n")("home.dashboards.widget.graph.nodata"),
                    },
                    options.lang,
                ),
                legend: _.merge(
                    {
                        enabled: options.showLegend ? true : false,
                        layout: legendAlignTopLeft ? "horizontal" : "vertical",
                        verticalAlign: "top",
                        align: options.legendAlign ? options.legendAlign : "right",
                        useHTML: true,
                        floating: legendAlignTopLeft,
                        padding: 5,
                        itemMarginTop: 5,
                        itemMarginBottom: 5,
                        x: legendAlignTopLeft ? 6 : -10,
                        y: legendTop,
                        symbolPadding: 10,
                        symbolWidth: 0,
                        symbolRadius: 0,
                        squareSymbol: false,
                        itemStyle: {
                            fontFamily: "Roboto, sans-serif",
                            textOverflow: null,
                        },
                        labelFormatter: function () {
                            const markerClass = legendAlignTopLeft ? "horizontal" : "vertical";
                            return `<div class="ariaStack-legend">
                                                <span class="item-marker ${markerClass}" style="background-image: ${
                                ChartMarkerService.createMarkerStyle(this.color).background
                            };"></span>
                                                <span class="legend-name-text ${markerClass}" title="${
                                this.name
                            }">${this.name}</span>
                                            </div>`;
                        },
                    },
                    options.legend || {},
                ),
                plotOptions: _.merge(
                    {
                        line: {
                            marker: {
                                enabled: isEnabled,
                            },
                            events: {
                                legendItemClick(e) {
                                    return legendItemClick(
                                        this,
                                        e,
                                        options.viewOptions.trackName || "Line Graph",
                                    );
                                },
                            },
                        },
                        area: {
                            stacking: "normal",
                            fillOpacity: 1,
                            lineWidth: 0.5,
                            connectNulls: true,
                            showInLegend: options.showInLegend,
                            marker: {
                                enabled: isEnabledForOnePoint,
                                states: {
                                    hover: {
                                        enabled: true,
                                    },
                                },
                            },
                            events: {
                                legendItemClick(e) {
                                    return legendItemClick(
                                        this,
                                        e,
                                        options.viewOptions.trackName || "Stacked Graph",
                                    );
                                },
                            },
                        },
                    },
                    options.plotOptions || {},
                ),
                tooltip: _.merge(
                    {
                        borderColor: "#4a86c5",
                        borderWidth: 1,
                        positioner: tooltipPositioner,
                        shadow: false,
                        formatter() {
                            const from = dayjs.utc(this.x),
                                to = from.clone();
                            let date;
                            const lines = [];
                            let markersSum = "",
                                sum = 0;
                            const isTooltipSum =
                                    stackedGraph &&
                                    options.viewOptions.sumTooltipValues &&
                                    this.points.length > 1,
                                emptyMarker = isTooltipSum
                                    ? '<span class="item-marker" style="background: transparent"></span>'
                                    : "";

                            switch (options.timeGranularity) {
                                case "Daily":
                                    date = from.format("dddd, MMM DD, YYYY");
                                    break;
                                case "Weekly":
                                    const t: any = _.last(this.points[0].series.points);
                                    const isLast: boolean = t.x == this.x;
                                    let toWeek = to.add(6, "days");
                                    // show partial week in case of last point when start of week and end of week aren't in the same month.
                                    if (isLast && !options.params.isWindow) {
                                        if (from.month() != toWeek.month()) {
                                            toWeek = from
                                                .clone()
                                                .endOf("month")
                                                .startOf("day")
                                                .utc();
                                        }
                                    }
                                    date =
                                        "From " +
                                        from.format("MMM DD, YYYY") +
                                        " to " +
                                        toWeek.format("MMM DD, YYYY");
                                    break;
                                case "Monthly":
                                    date = from.format("MMMM YYYY");
                                    break;
                            }
                            lines.push(
                                '<div class="date">' +
                                    date +
                                    "</div>" +
                                    '<div class="line-seperator"></div>',
                            );
                            this.points?.forEach((point) => {
                                const seriesName =
                                    point.series.name.indexOf("$") != -1
                                        ? point.series.name
                                              .replace("*", "")
                                              .replace("$", "")
                                              .replace(/_/g, " ")
                                              .replace("~", " > ")
                                        : point.series.name;
                                sum += point.point.y;
                                markersSum +=
                                    '<span class="item-marker" style="background: ' +
                                    point.series.color +
                                    '"></span>';

                                lines.push(
                                    "<div>" +
                                        emptyMarker +
                                        '<span class="item-marker" style="background: ' +
                                        point.series.color +
                                        '"></span>' +
                                        '<span class="item-name">' +
                                        seriesName +
                                        '<span class="item-value" style="margin-left:4px;color: ' +
                                        point.series.color +
                                        ';">' +
                                        $filter(options.tooltipFormat || options.format)(
                                            point.point.y,
                                            formatParam,
                                        ) +
                                        "</span></span></div>",
                                );
                            });

                            if (isTooltipSum) {
                                lines.push(
                                    "<div>" +
                                        markersSum +
                                        '<span style="margin-left: 2px;font-size: 12px;vertical-align: middle;"><b>Total</b> ' +
                                        $filter(options.format)(sum, formatParam) +
                                        "</b></span></div>",
                                );
                            }

                            return lines.join("");
                        },
                        style: {
                            // forcing refresh on tooltip due to a bug in highcharts-ng
                            // https://github.com/pablojim/highcharts-ng/issues/335
                            id: options.metric,
                            opacity: 0.85,
                        },
                        format: options.format,
                        shape: "square",
                        timeGranularity: options.timeGranularity,
                    },
                    options.tooltip || {},
                ),
                exporting: pngExportService.getSettings(options.exporting, options.params),
                func(chart) {
                    // during export, Chart.getSVG() is called, where the chart is cloned. ignore it.
                    // http://api.highcharts.com/highcharts#Chart.getSVG
                    // https://code.highcharts.com/modules/exporting.src.js
                    if (chart.options.chart.forExport) {
                        return;
                    }
                    // expose exportPng functionality outside of chart object
                    config.exportPng = function (chartTitle) {
                        if (chart.series && chart.series.length > 0) {
                            chart.exportChart(
                                {
                                    type: "image/png",
                                    url: ServerUrl,
                                    filename: chartTitle.trim().replace(/[\s\.:,]/g, "_"),
                                },
                                { title: { text: chartTitle } },
                            );
                        } else {
                            swLog.info("No chart data, cancelling export");
                        }
                    };
                },
            },
            series: data,
            xAxis: _.merge(
                {
                    gridLineWidth: 0,
                    gridLineDashStyle: "dash",
                    id: options.metric,
                    isDirty: true,
                    plotLines: options.plotLines,
                    tickInterval: options.xAxisTickInterval,
                    labels: {
                        formatter: options.xAxisLabelFormatter,
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                    lineColor: "#D3D3D3",
                    tickColor: "#D3D3D3",
                    minPadding: 0,
                    maxPadding: 0,
                },
                options.xAxis || {},
            ),
            yAxis: _.merge(
                {
                    showFirstLabel: options.reversed,
                    showLastLabel: !options.reversed,
                    reversed: options.reversed,
                    max: options.yAxisMax,
                    tickInterval: options.yAxisTickInterval,
                    isDirty: true,
                    gridZIndex: options.stacked ? 4 : 1,
                    reversedStacks: !stackedGraph, // For area stacked graph to show mobileweb above desktop series
                    min: 0,
                    // forcing refresh on yAxis label due to a bug in highcharts-ng
                    // https://github.com/pablojim/highcharts-ng/issues/335
                    id: options.metric,
                    tickPositioner: options.reversed ? linearTickPositioner : null,
                    labels: {
                        formatter() {
                            if (options.format == "decimalNumber") {
                                return $filter("decimalNumber")(this.value, true);
                            } else if (options.format == "number") {
                                return $filter("abbrNumber")(this.value, true);
                            } else if (options.format == "minVisitsAbbr" && this.value <= 5000) {
                                return $filter("number")(this.value);
                            } else {
                                return $filter(options.format)(this.value, formatParam);
                            }
                        },
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                },
                options.yAxis || {},
            ),
        };

        return _.merge({}, line(), config);
    };

    const stackedGraphWidget = function (options, data, userConfig) {
        const isEnabledForOnePoint = data && data[0] && data[0].data && data[0].data.length === 1; //SIM-6782
        const legendAlignTopLeft = true;
        const legendTop = _.isNumber(options.viewOptions.legendTop)
            ? options.viewOptions.legendTop
            : legendAlignTopLeft
            ? 10
            : 20;
        const isEnabled = options.viewOptions.showMarkersOnSingle;
        //var daily = (options.viewOptions.hideMarkersOnDaily || options.hideMarkersOnDaily) && options.timeGranularity === "Daily";
        const zoomEnabled = options.timeGranularity === "Monthly" ? null : "x";
        //var legendWrap = options.viewOptions.legendWrap && (window.innerWidth > 1204 && window.innerWidth < 1480 && legendAlignTopLeft);
        const formatParam = _.isNumber(options.formatParameter)
            ? options.formatParameter
            : options.yPercentPrecision;
        if (options.viewOptions.sortByTrafficSources) {
            data = _.sortBy(data, similarweb.utils.volumesAndSharesSplited.sort);
            data = _.map(data, (item: any, index) => {
                item.color = newColorPaletteColors()[index];
                item.marker.symbol = ChartMarkerService.createMarkerStyle(item.color).background;
                return item;
            });
        }
        const config = {
            exportPng: (title: string) => {},
            options: {
                chart: _.merge(
                    {},
                    {
                        type: "area",
                        marker: {
                            enabled: isEnabled,
                        },
                        zoomType: zoomEnabled,
                        animation: true,
                        spacing: [0, 10, 0, 0],
                        height: parseInt(options.height) || 200,
                        plotBackgroundColor: "transparent", // a 'must' property for zoom cursor
                        events: _.merge(
                            {
                                load() {
                                    const chart = this;
                                    if (chart.options.chart.forExport) {
                                        // for exporting to png - override series object (regular way doesn't work)
                                        _.each(this.series, function (series) {
                                            series.update(
                                                {
                                                    shadow: false,
                                                },
                                                false,
                                            );
                                        });
                                        chart.redraw();
                                    } else {
                                        if (zoomEnabled) {
                                            chart.seriesGroup.css({
                                                cursor: `url(${GRAPH_ZOOM_PNG}), col-resize`,
                                            });
                                        }
                                        setTimeout(function () {
                                            //fix for chart width
                                            try {
                                                chart.reflow();
                                            } catch (e) {}
                                        }, options.reflowTimeout || 2000);
                                    }
                                    watermarkService.add.call(chart, { opacity: 0.1 });
                                },
                                redraw(event) {
                                    // for SQS & Partial data info tips
                                    if (
                                        this.options &&
                                        this.options.chart &&
                                        this.options.chart.forExport
                                    ) {
                                        return;
                                    }
                                    if (_.isUndefined(event.target.xAxis)) {
                                        return;
                                    }
                                    const xAxis = event.target.xAxis[0];
                                    const plotElements = xAxis.plotLinesAndBands;
                                    if (xAxis && plotElements && plotElements.length > 0) {
                                        options.viewOptions.plotLines = [];
                                        plotElements.forEach(function (item) {
                                            // ignore plotlines with labels
                                            if (item.options.label) {
                                                return;
                                            }
                                            if (item.svgElem) {
                                                const chartInfotipPos = {
                                                    position: "absolute",
                                                    bottom: item.svgElem.getBBox().height + 14,
                                                    left: item.svgElem.getBBox().x - 13,
                                                };
                                                const styleObj = {
                                                    position: chartInfotipPos,
                                                    infoClass: item.options.infoClass,
                                                    infoTemplate: item.options.infoTemplate,
                                                    infoText: item.options.infoText,
                                                    isShown: true,
                                                };
                                                options.iconInfoCtrl(styleObj);
                                            }
                                        });
                                    }
                                },
                            },
                            options.events || {},
                        ),
                        marginTop: 27,
                    },
                    options.chart,
                ),
                lang: _.merge(
                    {},
                    {
                        noData: $filter("i18n")("home.dashboards.widget.graph.nodata"),
                    },
                    options.lang,
                ),
                legend: _.merge(
                    {
                        enabled: !!options.showLegend,
                        layout: "horizontal",
                        verticalAlign: "top",
                        align: "left",
                        useHTML: true,
                        floating: legendAlignTopLeft,
                        padding: 5,
                        itemMarginTop: 5,
                        itemMarginBottom: 5,
                        x: legendAlignTopLeft ? 6 : -10,
                        y: legendTop,
                        symbolPadding: 10,
                        symbolWidth: 0,
                        symbolRadius: 0,
                        squareSymbol: false,
                        itemStyle: {
                            fontFamily: "Roboto, sans-serif",
                            textOverflow: null,
                        },
                        labelFormatter() {
                            const markerClass = legendAlignTopLeft ? "horizontal" : "vertical";
                            return `<div class="ariaStack-legend">
                                            <span class="item-marker ${markerClass}" style="background-image: ${
                                ChartMarkerService.createMarkerStyle(this.color).background
                            };"></span>
                                            <span class="legend-name-text ${markerClass}" title="${
                                this.name
                            }">${this.name}</span>
                                        </div>`;
                        },
                    },
                    options.legend || {},
                ),
                plotOptions: _.merge(
                    {
                        series: {
                            states: {
                                hover: {
                                    halo: {
                                        size: 8,
                                        attributes: {
                                            fill: "rgba(0,0,0,0.05)",
                                            "stroke-width": 4,
                                            stroke: "rgba(0,0,0,0.05)",
                                        },
                                    },
                                },
                            },
                        },
                        area: {
                            stacking: "normal",
                            fillOpacity: 1,
                            lineWidth: 0.5,
                            connectNulls: true,
                            showInLegend: options.showInLegend,
                            marker: {
                                enabled: isEnabledForOnePoint,
                                states: {
                                    hover: {
                                        enabled: true,
                                    },
                                },
                            },
                            events: {
                                legendItemClick(e) {
                                    return legendItemClick(
                                        this,
                                        e,
                                        options.viewOptions.trackName || "Stacked Graph",
                                    );
                                },
                            },
                        },
                    },
                    options.plotOptions || {},
                ),
                tooltip: _.merge(
                    {
                        borderColor: "#fff",
                        borderWidth: 1,
                        positioner: tooltipPositioner,
                        shadow: true,
                        formatter() {
                            const from = dayjs.utc(this.x),
                                to = from.clone();
                            let date;
                            const lines = [];
                            let sum = 0;
                            const isTooltipSum =
                                options.viewOptions.sumTooltipValues && this.points.length > 1;

                            switch (options.timeGranularity) {
                                case "Daily":
                                    date = from.format("dddd, MMM DD, YYYY");
                                    break;
                                case "Weekly":
                                    const t: any = _.last(this.points[0].series.points);
                                    const isLast = t.x == this.x;
                                    let toWeek = to.add(6, "days");
                                    // show partial week in case of last point when start of week and end of week aren't in the same month.
                                    if (isLast && !options.params.isWindow) {
                                        if (from.month() != toWeek.month()) {
                                            toWeek = from
                                                .clone()
                                                .endOf("month")
                                                .startOf("day")
                                                .utc();
                                        }
                                    }
                                    date =
                                        "From " +
                                        from.format("MMM DD, YYYY") +
                                        " to " +
                                        toWeek.format("MMM DD, YYYY");
                                    break;
                                case "Monthly":
                                    date = from.format("MMMM YYYY");
                                    break;
                            }
                            lines.push(
                                '<div class="date">' +
                                    date +
                                    "</div>" +
                                    '<div class="line-seperator"></div>',
                            );
                            let showOthers = false;
                            this.points?.forEach((point) => {
                                const seriesName =
                                    point.series.name.indexOf("$") != -1
                                        ? point.series.name
                                              .replace("*", "")
                                              .replace("$", "")
                                              .replace(/_/g, " ")
                                              .replace("~", " > ")
                                        : point.series.name;
                                if (seriesName === "Others") {
                                    showOthers = true;
                                    return;
                                }
                                sum += parseFloat(
                                    $filter(options.format)(point.point.y, formatParam),
                                );
                                lines.push(
                                    '<div><span class="item-marker" style="background: ' +
                                        point.series.color +
                                        '"></span>' +
                                        '<span class="item-name">' +
                                        seriesName +
                                        '<span class="item-value" style="margin-left:4px;color: ' +
                                        point.series.color +
                                        ';">' +
                                        $filter(options.format)(point.point.y, formatParam) +
                                        "</span></span></div>",
                                );
                            });
                            if (showOthers) {
                                lines.push(
                                    '<div class="legend-item-others"><span class="item-marker" style="background:#E6E6E6"></span><span class="item-name">others ' +
                                        $filter(options.format)(1 - sum / 100, formatParam) +
                                        "</span></div>",
                                );
                            }

                            if (isTooltipSum) {
                                lines.push(
                                    '<div><span style="margin-left: 2px;font-size: 12px;vertical-align: middle;"><b>Total</b> ' +
                                        $filter(options.format)(sum, formatParam) +
                                        "</b></span></div>",
                                );
                            }

                            return lines.join("");
                        },
                        style: {
                            // forcing refresh on tooltip due to a bug in highcharts-ng
                            // https://github.com/pablojim/highcharts-ng/issues/335
                            id: options.metric,
                            opacity: 1,
                        },
                        shape: "square",
                        format: options.format,
                        timeGranularity: options.timeGranularity,
                    },
                    options.tooltip || {},
                ),
                exporting: pngExportService.getSettings(options.exporting, options.params),
                func(chart) {
                    // during export, Chart.getSVG() is called, where the chart is cloned. ignore it.
                    // http://api.highcharts.com/highcharts#Chart.getSVG
                    // https://code.highcharts.com/modules/exporting.src.js
                    if (chart.options.chart.forExport) {
                        return;
                    }
                    // expose exportPng functionality outside of chart object
                    config.exportPng = function (chartTitle) {
                        if (chart.series && chart.series.length > 0) {
                            chart.exportChart(
                                {
                                    type: "image/png",
                                    url: ServerUrl,
                                    filename: chartTitle.trim().replace(/[\s\.:,]/g, "_"),
                                },
                                { title: { text: chartTitle } },
                            );
                        } else {
                            swLog.info("No chart data, cancelling export");
                        }
                    };
                },
            },
            series: data,
            xAxis: _.merge(
                {
                    gridLineWidth: 0,
                    gridLineDashStyle: "dash",
                    id: options.metric,
                    isDirty: true,
                    plotLines: options.plotLinesConfig,
                    tickInterval: options.xAxisTickInterval,
                    labels: {
                        y: 30,
                        formatter: options.xAxisLabelFormatter,
                        style: {
                            textTransform: "uppercase",
                            fontSize: "11px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                    lineColor: "#D3D3D3",
                    tickColor: "#D3D3D3",
                    minPadding: 0,
                    maxPadding: 0,
                    crosshair: {
                        color: "#9B9B9B",
                        zIndex: 3,
                    },
                },
                options.xAxis || {},
            ),
            yAxis: _.merge(
                {
                    gridZIndex: 4,
                    showFirstLabel: options.reversed,
                    showLastLabel: !options.reversed,
                    reversed: options.reversed,
                    ceiling: 1,
                    max: options.yAxisMax,
                    tickInterval: options.yAxisTickInterval,
                    isDirty: true,
                    min: 0,
                    // forcing refresh on yAxis label due to a bug in highcharts-ng
                    // https://github.com/pablojim/highcharts-ng/issues/335
                    id: options.metric,
                    tickPositioner: options.reversed ? linearTickPositioner : null,
                    labels: {
                        formatter() {
                            if (options.format == "decimalNumber") {
                                return $filter("decimalNumber")(this.value, true);
                            } else if (options.format == "number") {
                                return $filter("abbrNumber")(this.value, true);
                            } else {
                                return $filter(options.format)(this.value, formatParam);
                            }
                        },
                        style: {
                            textTransform: "uppercase",
                            fontSize: "11px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                },
                options.yAxis || {},
            ),
        };

        return _.merge({}, line(), config, userConfig || {});
    };

    const pie = function (options, data, chartConfig) {
        chartConfig = chartConfig || {};
        const format = $filter("number"),
            innerSize = options.viewOptions.innerSize ? options.viewOptions.innerSize : "60%",
            size = "85%",
            legendAlignTopLeft = options.legendAlign === "left",
            isLargeScreen = window.innerWidth > 1500,
            isOrganicPaidIcons = options.viewOptions.widgetIcons === "organicPaidIcons",
            isMobileWebIcons = options.viewOptions.widgetIcons === "mobileWebIcons",
            isSpecialIcons = isMobileWebIcons || isOrganicPaidIcons;
        let timeoutId = null;

        return {
            series: data,
            options: _.merge(
                {
                    //colors: _.take(similarweb.config.chartMainColors, 8),
                    credits: { enabled: false },
                    chart: {
                        type: "pie",
                        animation: true,
                        spacing: [0, 0, 0, 0],
                        marginBottom: parseInt(options.viewOptions.marginBottom) || 0,
                        marginTop: parseInt(options.viewOptions.marginTop) || 0,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: "transparent",
                        height:
                            parseInt(options.height) || parseInt(options.viewOptions.height) || 200,
                        isDirtyLegend: true,
                        isDirtyBox: true,
                        events: {
                            // enable data labels on export: workaround for https://github.com/highslide-software/highcharts.com/issues/1562
                            load() {
                                if (this.options.chart.forExport) {
                                    _.each(this.series, function (series) {
                                        series.update(
                                            {
                                                dataLabels: {
                                                    enabled: true,
                                                },
                                            },
                                            false,
                                        );
                                    });
                                    this.redraw();
                                }
                                setTimeout(() => {
                                    //fix for chart width
                                    try {
                                        this.reflow();
                                    } catch (e) {}
                                }, 1000);
                            },
                        },
                    },
                    title: { text: null },
                    legend: {
                        enabled: options.viewOptions.widgetIcons !== "maleFemaleIcons",
                        layout:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.layout
                                ? options.viewOptions.legendConfig.layout
                                : "vertical",
                        align:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.align
                                ? options.viewOptions.legendConfig.align
                                : "right",
                        verticalAlign:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.verticalAlign
                                ? options.viewOptions.legendConfig.verticalAlign
                                : "middle",
                        symbolWidth: 0,
                        symbolRadius: 0,
                        symbolHeight: 0,
                        squareSymbol: false,
                        itemMarginTop:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.itemMarginTop
                                ? options.viewOptions.legendConfig.itemMarginTop
                                : 2,
                        itemMarginBottom:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.itemMarginBottom
                                ? options.viewOptions.legendConfig.itemMarginBottom
                                : 2,
                        padding:
                            options.viewOptions.legendConfig &&
                            options.viewOptions.legendConfig.margin
                                ? options.viewOptions.legendConfig.margin
                                : 0,
                        margin: 0,
                        useHTML: true,
                        itemStyle: {
                            cursor: "text",
                            color: "#2b3d52",
                            fontFamily: "Roboto, sans-serif",
                            zIndex: -1,
                            textOverflow: null,
                        },
                        x: isMobileWebIcons ? (isLargeScreen ? -50 : -20) : 0,
                        y: 0,
                        labelFormatter() {
                            const gaVerifiedIcon = this.isGAVerified
                                ? `<div class="GAVerified-container GAVerified-container--SMALL"><div class="GAVerified-icon-container GAVerified-icon--SMALL GAVerified-icon--active"></div></div>`
                                : ``;
                            const itemMarkerClass = `item-marker-mobileweb ${this.iconClass}`;
                            if (isMobileWebIcons) {
                                return `
                                <div class="pieChart-legend" title="${this.name}">
                                    <div class="legend-text">
                                        <div class="${itemMarkerClass}">
                                            ${icons[this.iconClass]}
                                        </div>
                                        <span class="legend-name-mobileweb">${this.name}</span>
                                    </div>
                                    &nbsp<span class="legend-value-mobileweb" style="color: ${
                                        this.color
                                    };">${format(this.percentage, 2)} %
                                    </span>
                                </div>`;
                            } else {
                                return `<div class="pieChart-legend" title="${this.name}">
                                                <span class="legend-text">
                                                    <span class="item-marker" style="background-image: ${
                                                        ChartMarkerService.createMarkerStyle(
                                                            this.color,
                                                        ).background
                                                    };"></span>
                                                    <span class="legend-name">${this.name}</span>
                                                </span>&nbsp<span class="legend-value">${
                                                    options.format && options.format === "number"
                                                        ? $filter("abbrNumber")(this.y, true)
                                                        : format(this.percentage, 2) +
                                                          "%" +
                                                          gaVerifiedIcon
                                                }</span>
                                            </div>`;
                            }
                        },
                    },
                    exporting: {
                        enabled: false,
                        chartOptions: {
                            chart: {
                                margin: [80, 150, 80, 150],
                                spacing: 10,
                            },
                            legend: {
                                enabled: true,
                                margin: 50,
                            },
                            plotOptions: {
                                pie: {
                                    dataLabels: {
                                        enabled: true,
                                    },
                                },
                            },
                        },
                    },
                    tooltip: {
                        formatter(): any {
                            if (isMobileWebIcons) {
                                //hover makes a cool animation
                                const legendItems =
                                    this.key === "Desktop"
                                        ? ["front1", "back2"]
                                        : ["back1", "front2"];
                                if (timeoutId) {
                                    clearTimeout(timeoutId);
                                }
                                $(".pieChart-legend").removeClass("front1 front2 back1 back2");
                                $(".pieChart-legend:nth(0)").addClass(legendItems[0]);
                                $(".pieChart-legend:nth(1)").addClass(legendItems[1]);
                                return false;
                            }
                            if (options.format && options.format === "number") {
                                return (
                                    this.key +
                                    "<br /><b>" +
                                    $filter("abbrNumber")(this.y, true) +
                                    "</b>"
                                );
                            } else {
                                return (
                                    this.key + "<br /><b>" + format(this.percentage, 2) + "%</b>"
                                );
                            }
                        },
                    },
                    plotOptions: {
                        pie: {
                            animation: true,
                            showInLegend: true,
                            allowPointSelect: true,
                            innerSize,
                            size,
                            shadow: false,
                            cursor: "pointer",
                            slicedOffset: 2,
                            dataLabels: {
                                enabled: false,
                                color: "#000000",
                                connectorColor: "#000000",
                                formatter() {
                                    return (
                                        "<b>" +
                                        this.point.name +
                                        "</b>: " +
                                        format(this.percentage, 2) +
                                        " %"
                                    );
                                },
                            },
                            states: {
                                hover: {
                                    halo: {
                                        size: 7,
                                        opacity: 0.25,
                                    },
                                },
                            },
                            point: {
                                events: {
                                    legendItemClick(e) {
                                        const el: any = isSpecialIcons ? false : this;
                                        return legendItemClick(
                                            el,
                                            e,
                                            options.viewOptions.trackName || "Pie Chart",
                                        );
                                    },
                                },
                            },
                        },
                        series: {
                            events: {
                                mouseOut() {
                                    if (timeoutId) {
                                        clearTimeout(timeoutId);
                                    }
                                    timeoutId = setTimeout(function () {
                                        $(".pieChart-legend").removeClass(
                                            "front1 front2 back1 back2",
                                        );
                                    }, 500);
                                },
                            },
                        },
                    },
                },
                chartConfig,
            ), // allow overriding any chart config setting.
        };
    };

    const applyColorToData = function (data: any[]) {
        return _.map(data, function (item: { color?: string }, index: number) {
            if (_.isObject(item)) {
                item.color = CHART_COLORS.chartMainColors[index];
            }
            return item;
        });
    };

    const durationCompareBar = function (data, options) {
        // this requires support for "patterns" in defs
        // @ts-ignore
        if (!Highcharts.SVGRenderer.prototype.addPattern) {
            swLog.error("Missing pattern-fill support in Highcharts");
        }

        return {
            exportPng: (title: string) => {},
            options: {
                defs: {
                    patterns: [
                        {
                            id: "invalid-bar-pattern",
                            path: {
                                d: "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2",
                                stroke: "#c7c7c7",
                                strokeWidth: 1,
                            },
                        },
                    ],
                },
                chart: {
                    height: parseInt(options.height) || 200,
                    marginTop: 30,
                    type: "column",
                    events: {
                        // load() {
                        //     const chart = this;
                        //     setTimeout(function() { //fix for chart width
                        //         const series = chart.series;
                        //         const invalidSeries = series.filter((s: any) => s.options.hasInvalidPoints);
                        //         if (invalidSeries.length > 1) {
                        //             _.forEach(invalidSeries[0].data, (point, pointIndex) => {
                        //                 if (point.invalid) {
                        //                     point.showLockIcon = true;
                        //                     point.update(point.y + invalidSeries[1].data[pointIndex].y);
                        //                     invalidSeries[1].data[pointIndex].update(0);
                        //                 }
                        //             });
                        //         }
                        //
                        //         try {
                        //             chart.reflow();
                        //         } catch (e) {
                        //         }
                        //     }, 250);
                        // }
                    },
                },
                exporting: pngExportService.getSettings({
                    chartOptions: {
                        yAxis: {
                            stackLabels: {
                                formatter() {
                                    const matchedStack: any = _.find(this.axis.series, {
                                        options: { stack: this.stack },
                                    });
                                    const matchedPoint = matchedStack.userOptions.data[this.x];
                                    const result = {
                                        month: dayjs
                                            .utc(matchedPoint.key, "YYYY-MM-DD")
                                            .format("MMM")
                                            .toUpperCase(),
                                        year: dayjs
                                            .utc(matchedPoint.key, "YYYY-MM-DD")
                                            .format("YYYY"),
                                    };
                                    if (options.isOverlapping) {
                                        return `<span style="color: #a3a3a3;position: relative;top: 18px;">${result.year}</span>`;
                                    } else {
                                        return `<span style="color: #a3a3a3;position: relative;top: 18px;">${result.month}<br />${result.year}</span>`;
                                    }
                                },
                                style: {},
                                verticalAlign: "bottom",
                                useHTML: true,
                            },
                            reversedStacks: false,
                        },
                        xAxis: {
                            type: "category",
                            categories: options.categories,
                            labels: {
                                style: {
                                    style: {
                                        textTransform: "uppercase",
                                        fontSize: "10px",
                                        fontFamily: "'Roboto', sans-serif",
                                        color: "#A3A3A3",
                                    },
                                    y: 25,
                                    formatter() {
                                        return this.value;
                                    },
                                },
                            },
                        },
                    },
                }),
                lang: {
                    noData: $filter("i18n")("mobileApps.overview.ranking.chart.filter.nodata"),
                },
                noData: {
                    style: {
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#545454",
                    },
                },
                credits: {
                    enabled: false,
                },
                xAxis: {
                    type: "category",
                    categories: options.categories,
                    plotLines: [
                        {
                            color: "#ff9700", // Mobile web algorithm change tooltip
                            width: 2,
                            dashStyle: "Dash",
                            value: options.categories.indexOf(options.mobileWebAlgoChangePlotLine),
                            id: "plotLine-mw-algochange",
                            left: 11,
                            label: {
                                text: `<span class="item-marker mobileweb-algorithm-marker" style="background-image: url(${ChartMarkerService.createMarkerSrc(
                                    "ff9700",
                                )});">
                                            <div id="custom-tooltip" class="mobileweb-algorithm ${
                                                positionToolipLeft(
                                                    options.categories.length,
                                                    options.categories.indexOf(
                                                        options.mobileWebAlgoChangePlotLine,
                                                    ),
                                                )
                                                    ? "mobileweb-algorithm--left"
                                                    : "mobileweb-algorithm--right"
                                            }">
                                                    <div class="mobile-algorithm-date">${i18nFilter()(
                                                        "custom.tooltip.date",
                                                    )}</div>
                                                    <div class="mobile-algorithm-separator"></div>
                                                    <div class="mobile-algorithm-text mobile-algorithm-margin-top">${i18nFilter()(
                                                        "custom.tooltip.text",
                                                    )}</div>
                                                    <div class="mobile-algorithm-text">${i18nFilter()(
                                                        "custom.tooltip.text2",
                                                    )}</div>
                                            </div>
                                        </span>`,
                                useHTML: true,
                                x: -13,
                                y: 3,
                                rotation: 0,
                            },
                        },
                    ],
                    labels: {
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                            // we want to show xaxis labels only when the compared intervals are the same months
                            visibility: options.isOverlapping ? "visible" : "hidden",
                        },
                        y: 25,
                        formatter() {
                            return this.value;
                        },
                    },
                },

                yAxis: {
                    stackLabels: {
                        enabled: true,
                        // get the x axis value of the current bar's corresponding point
                        formatter() {
                            const matchedStack: any = _.find(this.axis.series, {
                                options: { stack: this.stack },
                            });
                            const matchedPoint = matchedStack.userOptions.data[this.x];
                            const result = {
                                month: dayjs
                                    .utc(matchedPoint.key, "YYYY-MM-DD")
                                    .format("MMM")
                                    .toUpperCase(),
                                year: dayjs.utc(matchedPoint.key, "YYYY-MM-DD").format("YYYY"),
                            };
                            if (options.isOverlapping) {
                                return `<span class="compared-duration-stack-label compared-duration-stack-label--' + matchedStack.stackKey + '">${result.year}</span>`;
                            } else {
                                return `<span class="compared-duration-stack-label compared-duration-stack-label--' + matchedStack.stackKey + '">${result.month}<br />${result.year}</span>`;
                            }
                        },
                        style: {},
                        verticalAlign: "bottom",
                        useHTML: true,
                    },
                    reversedStacks: false,
                    title: {
                        text: null,
                    },
                    labels: {
                        formatter() {
                            if (options.format == "decimalNumber") {
                                return $filter("decimalNumber")(this.value, true);
                            } else if (options.format == "number") {
                                return $filter("abbrNumber")(this.value, true);
                            } else if (options.format == "minVisitsAbbr" && this.value <= 5000) {
                                return $filter("number")(this.value);
                            } else {
                                return $filter(options.format)(this.value);
                            }
                        },
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                },
                legend: {
                    enabled: false,
                },
                tooltip: {
                    shared: true,
                    formatter(): boolean | string {
                        function calcTotals(devices) {
                            const arrs = _.map(_.values(devices), function (arr: any) {
                                return arr;
                            });

                            const zipped = _.zipWith(...arrs, function (a: any, b: any) {
                                return {
                                    key: a.key,
                                    y: a.y + b.y,
                                    point: { invalid: a.point.invalid || b.point.invalid },
                                };
                            });

                            _.forEach(zipped, function (item: any, index, items) {
                                const nextPoint = items[index + 1];
                                item.point.change = item.point.invalid
                                    ? "-"
                                    : nextPoint
                                    ? calcChange(item.y, nextPoint.y)
                                    : undefined;
                            });

                            return zipped;
                        }

                        function value(point) {
                            if (point === undefined) {
                                return undefined;
                            }
                            if (_.get(point, "[point][invalid]")) {
                                return "-";
                            } else {
                                return $filter(options.format)(point.y);
                            }
                        }

                        function calcChange(current, previous) {
                            const change = (previous - current) / current;
                            return change;
                        }

                        const firstPoint = _.head<any>(_.uniqBy(this.points, "series.stackKey"));
                        const lastPoint = _.last<any>(_.uniqBy(this.points, "series.stackKey"));
                        const changeTitle = $filter("i18n")("global.change");
                        const mainPeriod = {
                            date: dayjs.utc(lastPoint.point.key, "YYYY-MM-DD"),
                            color: lastPoint.color,
                        };
                        const comparedPeriod = {
                            date: dayjs.utc(firstPoint.point.key, "YYYY-MM-DD"),
                            color: firstPoint.point.invalid
                                ? firstPoint.point.series.color
                                : firstPoint.color,
                            invalid: firstPoint.point.invalid,
                        };

                        const devices = _.groupBy<any>(
                            this.points,
                            (point: any) => point.series.name,
                        );
                        if (options.showTotal) {
                            devices.Total = calcTotals(devices);
                        }

                        let result = `<div class="compare-table">
                                  <div class="compare-table-header">
                                    <div style="color: ${
                                        comparedPeriod.color
                                    };" class="compare-table-header-cell">${comparedPeriod.date.format(
                            "MMM YYYY",
                        )}</div>
                                    ${
                                        comparedPeriod.color !== mainPeriod.color
                                            ? `<div style="color: ${
                                                  mainPeriod.color
                                              };" class="compare-table-header-cell">${mainPeriod.date.format(
                                                  "MMM YYYY",
                                              )}</div>`
                                            : ""
                                    }
                                    ${
                                        firstPoint.point.invalid
                                            ? ""
                                            : "<div>" + changeTitle + "</div>"
                                    }
                                  </div>`;

                        for (const key in devices) {
                            const keyStr = $filter("i18n")(
                                "websources." + key.toLowerCase().replace(" ", ""),
                            );
                            let change = $filter("change")(devices[key][0].point.change);
                            let changeClass =
                                parseFloat(change) > 0
                                    ? "changePercentage positive"
                                    : parseFloat(change) < 0
                                    ? "changePercentage negative"
                                    : "";

                            // do not show change when one of the values is empty
                            if (
                                // @ts-ignore
                                _.get(devices, `[${key}][0].y`) === 0 ||
                                // @ts-ignore
                                _.get(devices, `[${key}][1].y`) === 0
                            ) {
                                change = "-";
                                changeClass = "";
                            }
                            result += `<div class="compare-table-row">
                                    <div>${keyStr}</div>
                                    <div class="compare-table-cell">${value(devices[key][0])}</div>
                                    ${
                                        comparedPeriod.color !== mainPeriod.color
                                            ? `<div class="compare-table-cell">${value(
                                                  devices[key][1],
                                              )}</div>`
                                            : ""
                                    }
                                    ${
                                        firstPoint.point.invalid
                                            ? ""
                                            : '<div class="compare-table-cell--change ' +
                                              changeClass +
                                              '">' +
                                              change +
                                              "</div>"
                                    }
                                  </div>`;
                        }

                        result += `<div class="arrow" style=""></div></div>`;

                        return result;
                    },
                    positioner(labelWidth, labelHeight, point) {
                        let tooltipX, tooltipY;
                        const chart = this.chart;
                        const hoverPoints = _.uniqBy(this.chart.hoverPoints, "key");
                        const x = _.head<any>(hoverPoints).barX;
                        const total =
                            _.last<any>(hoverPoints).barX + _.last<any>(hoverPoints).pointWidth;

                        const compareBarCenter = x + (total - x) / 2 + chart.plotLeft;

                        //align legend to the center
                        tooltipX = compareBarCenter - labelWidth / 2;

                        if (tooltipX + labelWidth > chart.plotWidth) {
                            tooltipX = this.chart.plotWidth + chart.plotLeft - labelWidth;
                        }

                        tooltipX = Math.max(tooltipX, chart.plotLeft);

                        angular
                            .element(this.label.div)
                            .find(".arrow")
                            .css({ left: compareBarCenter - tooltipX + 2 });
                        return {
                            x: tooltipX,
                            y: 40,
                        };
                    },
                    useHTML: true,
                    backgroundColor: "#fff",
                    borderWidth: 0,
                    borderColor: "#AAA",
                    padding: 0,
                    shape: "square",
                    style: {
                        padding: 0,
                        width: 304,
                        id: options.metric,
                    },
                },

                plotOptions: {
                    column: {
                        stacking: "normal",
                        borderWidth: 0,
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                        dataLabels: {
                            enabled: true,
                            formatter() {
                                let returnValue = "";
                                if (this.point.showLockIcon) {
                                    returnValue = `<span class="private-icon-hc">${icons.private}</span>`;
                                }

                                return returnValue;
                            },
                            useHTML: true,
                        },
                    },
                    series: {
                        events: {
                            click: options.onInvalidColumnClick,
                        },
                    },
                },
            },
            title: { text: null },
            series: data,
        };
    };

    const durationCompareLine = function (data, options) {
        const categories = options.categories;
        return {
            exportPng: (title: string) => {},
            options: {
                defs: {
                    patterns: [
                        {
                            id: "invalid-bar-pattern",
                            path: {
                                d: "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2",
                                stroke: "#c7c7c7",
                                strokeWidth: 1,
                            },
                        },
                    ],
                },
                chart: {
                    height: parseInt(options.height) || 200,
                    marginTop: 30,
                    type: "line",
                    events: {
                        load() {
                            const chart = this;
                            setTimeout(function () {
                                //fix for chart width
                                const series = chart.series;
                                const invalidSeries = series.filter(
                                    (s: any) => s.options.hasInvalidPoints,
                                );
                                if (invalidSeries.length > 1) {
                                    _.forEach(invalidSeries[0].data, (point, pointIndex) => {
                                        if (point.invalid) {
                                            point.showLockIcon = true;
                                            // point.update(point.y + invalidSeries[1].data[pointIndex].y);
                                            // invalidSeries[1].data[pointIndex].update(0);
                                        }
                                    });
                                }

                                try {
                                    chart.reflow();
                                } catch (e) {}
                            }, 250);
                        },
                    },
                },
                exporting: pngExportService.getSettings({
                    chartOptions: {
                        yAxis: {
                            stackLabels: {
                                formatter() {
                                    const matchedStack: any = _.find(this.axis.series, {
                                        options: { stack: this.stack },
                                    });
                                    const matchedPoint = matchedStack.userOptions.data[this.x];
                                    return (
                                        '<span style="color: #a3a3a3;position: relative;top: 18px;">' +
                                        matchedPoint.key.split("-")[0] +
                                        "</span>"
                                    );
                                },
                                style: {},
                                verticalAlign: "bottom",
                                useHTML: true,
                            },
                            reversedStacks: false,
                        },
                        xAxis: {
                            type: "category",
                            categories: options.categories,
                            labels: {
                                style: {
                                    style: {
                                        textTransform: "uppercase",
                                        fontSize: "10px",
                                        fontFamily: "'Roboto', sans-serif",
                                        color: "#A3A3A3",
                                    },
                                    y: 25,
                                    formatter() {
                                        return this.value;
                                    },
                                },
                            },
                        },
                    },
                }),
                lang: {
                    noData: $filter("i18n")("mobileApps.overview.ranking.chart.filter.nodata"),
                },
                noData: {
                    style: {
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#545454",
                    },
                },
                credits: {
                    enabled: false,
                },
                xAxis: {
                    tickInterval: 1,
                    minPadding: 0,
                    maxPadding: 0,
                    startOnTick: true,
                    labels: {
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                        y: 25,
                        formatter() {
                            return categories[this.value];
                        },
                    },
                    plotLines:
                        options.mobileWebAlgoChangePlotLine && options.plotLines[0]
                            ? [
                                  Object.assign(options.plotLines[0], {
                                      value: categories.indexOf(
                                          options.mobileWebAlgoChangePlotLine,
                                      ),
                                  }),
                              ]
                            : undefined,
                    crosshair: {
                        width: 1,
                        dashStyle: "dash",
                        color: "#18A3FC",
                        zIndex: 2,
                    },
                },
                yAxis: {
                    stackLabels: {
                        enabled: true,
                        // get the x axis value of the current bar's corresponding point
                        formatter() {
                            const matchedStack: any = _.find(this.axis.series, {
                                options: { stack: this.stack },
                            });
                            const matchedPoint = matchedStack.userOptions.data[this.x];
                            return (
                                '<span class="compared-duration-stack-label">' +
                                matchedPoint.key.split("-")[0] +
                                "</span>"
                            );
                        },
                        style: {},
                        verticalAlign: "bottom",
                        useHTML: true,
                    },
                    reversedStacks: false,
                    title: {
                        text: null,
                    },
                    labels: {
                        formatter() {
                            if (options.format == "decimalNumber") {
                                return $filter("decimalNumber")(this.value, true);
                            } else if (options.format == "number") {
                                return $filter("abbrNumber")(this.value, true);
                            } else if (options.format == "minVisitsAbbr" && this.value <= 5000) {
                                return $filter("number")(this.value);
                            } else {
                                return $filter(options.format)(this.value);
                            }
                        },
                        style: {
                            textTransform: "uppercase",
                            fontSize: "10px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#A3A3A3",
                        },
                    },
                },
                legend: {
                    enabled: false,
                },
                tooltip: {
                    shared: true,
                    formatter(): boolean | string {
                        function calcTotals(devices) {
                            const arrs = _.map(_.values(devices), function (arr: any) {
                                return arr;
                            });

                            const zipped = _.zipWith(...arrs, function (a: any, b: any) {
                                return {
                                    key: a.key,
                                    y: a.y + b.y,
                                    point: { invalid: a.point.invalid || b.point.invalid },
                                };
                            });

                            _.forEach(zipped, function (item: any, index, items) {
                                const nextPoint = items[index + 1];
                                item.point.change = item.point.invalid
                                    ? "-"
                                    : nextPoint
                                    ? calcChange(item.y, nextPoint.y)
                                    : undefined;
                            });

                            return zipped;
                        }

                        function value(point) {
                            if (!point || point.point.invalid) {
                                return "-";
                            } else {
                                return $filter(options.format)(point.y);
                            }
                        }

                        function calcChange(current, previous) {
                            const change = (previous - current) / current;
                            return change;
                        }

                        const firstPoint = _.head<any>(this.points);
                        const lastPoint = _.last<any>(this.points);
                        const changeTitle = $filter("i18n")("global.change");
                        const mainPeriod = {
                            date: dayjs.utc(lastPoint.point.key, "YYYY-MM-DD"),
                            color: lastPoint.color,
                        };
                        const comparedPeriod = {
                            date: dayjs.utc(firstPoint.point.key, "YYYY-MM-DD"),
                            color: firstPoint.point.invalid
                                ? firstPoint.point.series.color
                                : firstPoint.color,
                            invalid: firstPoint.point.invalid,
                        };

                        const devices = _.groupBy<any>(
                            this.points,
                            (point: any) => point.series.name,
                        );
                        if (options.showTotal) {
                            devices.Total = calcTotals(devices);
                        }

                        let result = `<div class="compare-table">
                                  <div class="compare-table-header">
                                    ${
                                        firstPoint !== lastPoint
                                            ? `<div style="color: ${
                                                  comparedPeriod.color
                                              };" class="compare-table-header-cell">${comparedPeriod.date.format(
                                                  "MMM YYYY",
                                              )}</div>`
                                            : ""
                                    }
                                    <div style="color: ${
                                        mainPeriod.color
                                    };" class="compare-table-header-cell">${mainPeriod.date.format(
                            "MMM YYYY",
                        )}</div>
                                    ${
                                        firstPoint.point.invalid
                                            ? ""
                                            : "<div>" + changeTitle + "</div>"
                                    }
                                  </div>`;

                        for (const key in devices) {
                            const keyStr = $filter("i18n")(
                                "websources." + key.toLowerCase().replace(" ", ""),
                            );
                            let change = $filter("change")(devices[key][0].point.change);
                            let changeClass =
                                parseFloat(change) > 0
                                    ? "changePercentage positive"
                                    : parseFloat(change) < 0
                                    ? "changePercentage negative"
                                    : "";

                            // do not show change when one of the values is empty
                            if (
                                (devices[key][0] && devices[key][0].y == 0) ||
                                (devices[key][1] && devices[key][1].y == 0)
                            ) {
                                change = "-";
                                changeClass = "";
                            }

                            result += `<div class="compare-table-row">
                                    <div>${keyStr}</div>
                                    <div class="compare-table-cell">${value(devices[key][0])}</div>
                                    ${
                                        firstPoint !== lastPoint
                                            ? `<div class="compare-table-cell">${value(
                                                  devices[key][1],
                                              )}</div>`
                                            : ""
                                    }
                                    ${
                                        firstPoint !== lastPoint
                                            ? firstPoint.point.invalid
                                                ? ""
                                                : '<div class="compare-table-cell--change ' +
                                                  changeClass +
                                                  '">' +
                                                  change +
                                                  "</div>"
                                            : ""
                                    }
                                  </div>`;
                        }

                        result += `</div>`;

                        return result;
                    },
                    positioner: tooltipPositioner,
                    useHTML: true,
                    backgroundColor: "#fff",
                    borderWidth: 0,
                    borderColor: "#AAA",
                    shape: "square",
                    padding: 0,
                    style: {
                        padding: 0,
                        width: 304,
                        id: options.metric,
                    },
                },

                plotOptions: {
                    line: {
                        marker: {
                            enabled: true,
                        },
                    },
                    series: {
                        events: {
                            click: options.onInvalidColumnClick,
                        },
                    },
                },
            },
            title: { text: null },
            series: data,
        };
    };

    function positionToolipLeft(arrLength, arrIndex) {
        return arrLength / 2 > arrIndex + 1;
    }

    const positionToolipLeftComplex = function (data, mobileWebDate) {
        if (_.isNull(mobileWebDate)) {
            return false;
        }
        const arrLength = data[0].data.length;
        const daysArray = data[0].data.map((item) => item[0]);
        let arrIndex = daysArray.indexOf(mobileWebDate);

        if (arrIndex === -1) {
            arrIndex = findFuzzyIndex(arrIndex, daysArray, mobileWebDate);
        }
        return positionToolipLeft(arrLength, arrIndex);
    };

    function findFuzzyIndex(arrIndex, array, mobileWebDay) {
        let index = arrIndex;
        const date = new Date(mobileWebDay).getDate();
        const month = new Date(mobileWebDay).getMonth();
        const year = new Date(mobileWebDay).getFullYear();
        const datesArray = array.map((day) => {
            const date = new Date(day);
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
            };
        });

        // adding up to 7 days to find the date in the array
        const max = date + 8;
        for (let i = date; index === -1 && i < max; i++) {
            index = _.findIndex(datesArray, { year, month, day: i });
        }
        return index;
    }

    return {
        chartColors,
        mobileWebColors,
        newColorPaletteColors,
        maleFemaleColors,
        maleFemaleIcons,
        mobileWebIcons,
        organicPaidColors,
        organicPaidIcons,
        benchmarkColor: BENCHMARK_COLOR,
        audienceOverviewColors,
        linearTickPositioner,
        tooltipPositioner,
        legendItemClick,
        gauge,
        column,
        line,
        pie,
        lineGraphWidget,
        stackedGraphWidget,
        trendLineWidget,
        applyColorToData,
        durationCompareBar,
        durationCompareLine,
        positionToolipLeftComplex,
    };
});
