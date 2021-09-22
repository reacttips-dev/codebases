import dayjs from "dayjs";
import { Highcharts } from "../../../../app/libraries/reactHighcharts";

import angular from "angular";
import _ from "lodash";
import { chartTooltip } from "./chartTooltip";
import { ChartMarkerService } from "services/ChartMarkerService";
import { watermarkService } from "../../../common/services/watermarkService";
import { CHART_COLORS } from "../../../../app/constants/ChartColors";
import { GRAPH_ZOOM_PNG } from "../../../../app/constants/GraphZoomPng";
import { enableChartMarker } from "../../../../app/UtilitiesAndConstants/UtilityFunctions/enableChartMarker";
import { SwTrack } from "../../../../app/services/SwTrack";

angular
    .module("shared")
    .factory("swLineChart", function ($filter, $rootScope, swRoute, chosenSites, pngExportService) {
        const defaultConfig = {
            options: {
                type: "number",
                name: undefined,
                xAxisStartOnTick: false,
                colors: CHART_COLORS.compareMainColors,
                enableChartMarker,
            },
            showLegend: false,
            showCrosshairs: false,
            getInterval: function () {
                return "monthly";
            },
            startDate: undefined,
            endDate: undefined,
            stacking: undefined,
            data: [],
        };

        function defaults(source) {
            const result = _.clone(source);
            if (source.options) {
                result.options = _.clone(source.options);
                result.options = _.defaults(result.options, defaultConfig.options);
            }
            return _.defaults(result, defaultConfig);
        }

        return {
            getSeries: function (data, config) {
                // config
                config = defaults(config);

                // this is a fix for the data object. originally this directive was designed to support
                // "compare mode" only, which comes with a different data object then "single mode".
                // so, to make this work with single mode i "tweaked" the data object
                // For questions you can go to Ofer Sarid
                if (!data[0].data) {
                    data = [{ data: data }];
                }

                return _.map(data, function (item, index) {
                    const hasDates = item.dates && item.dates.length == item.data.length;
                    return {
                        name:
                            item.displayName ||
                            item.name ||
                            chosenSites.getPrimarySite().displayName,
                        legendTitle: item.legendTitle,
                        type: "line",
                        fillOpacity: 1,
                        marker: {
                            enabled: config.options.enableChartMarker(config.getInterval()),
                            lineWidth: 2,
                            lineColor: "white",
                            radius: 4,
                            symbol: ChartMarkerService.createMarkerStyle(
                                item.color || config.options.colors[index],
                            ).background,
                        },
                        states: {
                            hover: {
                                enabled: true,
                            },
                        },
                        lineWidth: 2,
                        data: !hasDates
                            ? item.data
                            : item.data.map(function (d, i) {
                                  return [dayjs.utc(item.dates[i]).valueOf(), d];
                              }),
                        color:
                            item.color || (config.options.colors && config.options.colors[index]),
                        algoType: item.algoType,
                        showInLegend: !config.newAlgorithm || item.algoType == "old",
                        pointInterval: !hasDates
                            ? similarweb.utils.charts.intervals[config.getInterval()]
                            : null,
                        pointStart: !hasDates
                            ? config.startDate || swRoute.duration().from().valueOf()
                            : null,
                    };
                });
            },
            modify: function (obj, config) {
                // config
                config = defaults(config);

                if (config.getInterval() === "monthly") {
                    obj.xAxis.tickInterval = similarweb.utils.charts.intervals.monthly;
                } else {
                    const isWindow = swRoute.duration().isWindow(),
                        isOneMonthDuration = swRoute.duration().length === 1;

                    if (isWindow || isOneMonthDuration) {
                        obj.xAxis.tickInterval = similarweb.utils.charts.intervals.daily * 2;
                    }
                }
                delete obj.xAxis.labels.x;
            },
            init: function (config, element) {
                // config
                config = defaults(config);

                const type = config.options.type || "number",
                    format = similarweb.utils.charts.formatter($filter)[type],
                    labelTicks = similarweb.utils.charts.intervals.monthly,
                    yAxisFormatter = function () {
                        return format(this.value);
                    },
                    exporting = {
                        chartOptions: {
                            chart: {
                                marginLeft: 100,
                            },
                            yAxis: [
                                {
                                    labels: {
                                        formatter: yAxisFormatter,
                                    },
                                },
                            ],
                            xAxis: {
                                minPadding: 0,
                            },
                        },
                    };

                return {
                    colors: config.options.colors,
                    chart: {
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
                        marginTop: 38,
                        spacingLeft: 0,
                        spacingTop: 15,
                        spacingRight: 0,
                        plotBackgroundColor: "transparent", // a 'must' property for zoom cursor
                        events: {
                            load: function () {
                                const chart = this;
                                if (chart.options.chart.forExport) {
                                    // for exporting to png - override series object (regular way doesn't work)
                                    Highcharts.each(this.series, function (series) {
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
                                        cursor: "url(" + GRAPH_ZOOM_PNG + "), col-resize",
                                    });
                                }
                                watermarkService.add.call(chart);
                            },
                            selection: function (event) {
                                if (!event.xAxis) {
                                    SwTrack.all.trackEvent("Reset", "click", "Reset Zoom");
                                }
                            },
                        },
                    },
                    title: { text: null },
                    exporting: pngExportService.getSettings(exporting),
                    xAxis: {
                        type: "datetime",
                        tickInterval: labelTicks,
                        maxZoom: 14 * 24 * 3600000, // fourteen days
                        title: { text: null },
                        gridLineDashStyle: "solid",
                        gridLineColor: "#e2e2e2",
                        gridLineWidth: 1,
                        lineWidth: 1,
                        tickWidth: 1,
                        minPadding: 0,
                        minorGridLineWidth: 0,
                        startOnTick: config.options.xAxisStartOnTick,
                        showFirstLabel: true,
                        labels: {
                            align: "center",
                            x: element ? element.width() / 2 / swRoute.duration().length : null,
                            style: {
                                color: "#666",
                                fontSize: "12px",
                                textTransform: "uppercase",
                                fontFamily: "'Roboto', sans-serif",
                            },
                            enabled: true,
                        },
                    },
                    yAxis: {
                        title: { enabled: false },
                        gridLineColor: "rgba(200,200,200,0.4)",
                        gridLineWidth: 1,
                        gridLineDashStyle: "solid",
                        lineWidth: 1,
                        min: 0,
                        labels: {
                            formatter: yAxisFormatter,
                            style: {
                                color: "#999",
                                fontFamily: "Arial",
                                fontSize: "11px",
                            },
                        },
                        showFirstLabel: false,
                    },
                    tooltip: {
                        shared: true,
                        crosshairs: config.showCrosshairs
                            ? [
                                  {
                                      width: 1,
                                      color: "#e2e2e2",
                                      zIndex: 5,
                                  },
                                  null,
                              ]
                            : null,
                        formatter: function () {
                            return chartTooltip(
                                this,
                                config.startDate,
                                config.endDate,
                                format,
                                config.getInterval(),
                            );
                        },
                        useHTML: true,
                    },
                    legend: {
                        floating: true,
                        x: 0,
                        y: -20,
                        borderRadius: 0,
                        borderWidth: 0,
                        symbolWidth: 20,
                        symbolRadius: 10,
                        labelFormatter: function () {
                            return this.options.legendTitle || this.name;
                        },
                        useHTML: true,
                        align: "left",
                        layout: "horizontal",
                        verticalAlign: "top",
                        enabled: config.showLegend,
                    },
                    plotOptions: {
                        line: {
                            shadow: {
                                color: "rgba(0,0,0,0.2)",
                                offsetX: 0,
                                offsetY: -2,
                                opacity: 0.5,
                                width: 3,
                            },
                            events: {
                                legendItemClick: function (e) {
                                    if (!_.isEmpty(this.chart.options.trackName)) {
                                        const action = e.target.visible ? "remove" : "add";
                                        SwTrack.all.trackEvent(
                                            "Graph filter",
                                            action,
                                            this.chart.options.trackName + "/" + this.options.name,
                                        );
                                    }
                                    if (this.options.algoType) {
                                        // toggle all series of the same legend
                                        for (let i = 0; i < this.chart.series.length; i++) {
                                            const series = this.chart.series[i];
                                            if (
                                                series !== this &&
                                                series.options.legendTitle ===
                                                    this.options.legendTitle
                                            ) {
                                                series.setVisible(!series.visible);
                                            }
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                };
            },
        };
    });
