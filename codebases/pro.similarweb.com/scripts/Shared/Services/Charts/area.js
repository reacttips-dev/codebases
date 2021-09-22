import dayjs from "dayjs";
import { chartTooltip } from "./chartTooltip";
import { ChartMarkerService } from "services/ChartMarkerService";
import _ from "lodash";
import angular from "angular";
import { CHART_COLORS } from "../../../../app/constants/ChartColors";
import { GRAPH_ZOOM_PNG } from "../../../../app/constants/GraphZoomPng";
import { watermarkService } from "../../../common/services/watermarkService";
import { enableChartMarker } from "../../../../app/UtilitiesAndConstants/UtilityFunctions/enableChartMarker";
import { SwTrack } from "../../../../app/services/SwTrack";

angular
    .module("shared")
    .factory("swAreaChart", function ($filter, $rootScope, swRoute, pngExportService) {
        const defaultConfig = {
            options: {
                type: "number",
                name: undefined,
                colors: [CHART_COLORS.main[0]],
                xAxisStartOnTick: false,
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
                if (config.stacking) return this.getStackSeries(data, config);

                // config
                config = defaults(config);

                const hasDates = config.dates && config.dates.length == data.length;
                const res = [
                    {
                        type: "area",
                        shadow: {
                            color: "rgba(0,0,0,0.2)",
                            offsetX: 0,
                            offsetY: -2,
                            opacity: 0.5,
                            width: 3,
                        },
                        marker: {
                            enabled: config.options.enableChartMarker(config.getInterval()),
                            lineWidth: 2,
                            symbol: ChartMarkerService.createMarkerStyle(
                                data.color || config.options.colors[0],
                            ).background,
                            lineColor: "#ffffff",
                        },
                        states: {
                            hover: {
                                enabled: true,
                            },
                        },
                        lineWidth: 2,
                        name: $rootScope.global.site
                            ? $rootScope.global.site.displayName
                            : $rootScope.global.app.name
                            ? $rootScope.global.app.name
                            : config.options.name,
                        data: hasDates
                            ? data.map(function (d, i) {
                                  return [dayjs.utc(config.dates[i]).valueOf(), d];
                              })
                            : data,
                        pointInterval: !hasDates
                            ? similarweb.utils.charts.intervals[config.getInterval()]
                            : null,
                        pointStart: !hasDates
                            ? config.startDate || swRoute.duration().from().valueOf()
                            : null,
                    },
                ];

                return res;
            },

            getStackSeries: function (data, config) {
                // config
                config = defaults(config);

                return _.map(data, function (item, index) {
                    return {
                        type: "area",
                        fillOpacity: 1,
                        shadow: {
                            color: "rgba(0,0,0,0.2)",
                            offsetX: 0,
                            offsetY: -2,
                            opacity: 0.5,
                            width: 3,
                        },
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
                        name: item.name,
                        data: item.data,
                        color: item.color,
                        pointInterval: similarweb.utils.charts.intervals[config.getInterval()],
                        pointStart: config.startDate || swRoute.duration().from().valueOf(),
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

                const type = config.options.type,
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
                        plotBackgroundColor: "transparent", // a 'must' property for zoom cursor
                        events: {
                            load: function () {
                                if (!this.options.chart.forExport) {
                                    this.plotBackground.css({
                                        cursor: "url(" + GRAPH_ZOOM_PNG + "), col-resize",
                                    });
                                    this.seriesGroup.css({
                                        cursor: "url(" + GRAPH_ZOOM_PNG + "), col-resize",
                                    });
                                }
                                watermarkService.add.call(this, { opacity: 0.15 });
                            },
                            selection: function (event) {
                                if (!event.xAxis) {
                                    SwTrack.all.trackEvent("Reset", "click", "Reset Zoom");
                                }
                            },
                        },
                    },
                    colors: config.options.colors,
                    credits: false,
                    title: { text: null },
                    exporting: pngExportService.getSettings(exporting),
                    yAxis: {
                        title: { enabled: false },
                        maxPadding: 0,
                        gridZIndex: 7,
                        gridLineColor: "rgba(200,200,200,0.4)",
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
                    xAxis: {
                        type: "datetime",
                        tickInterval: labelTicks,
                        maxZoom: 14 * 24 * 3600000, // fourteen days
                        title: {
                            text: null,
                        },
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
                        valueDecimals: 0,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        borderWidth: 1,
                        formatter: function () {
                            return chartTooltip(
                                this,
                                config.startDate,
                                config.endDate,
                                format,
                                config.getInterval(),
                            );
                        },
                        style: {
                            fontFamily: "Arial",
                            fontSize: "11px",
                            color: "#434343",
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
                        useHTML: true,
                        align: "left",
                        layout: "horizontal",
                        verticalAlign: "top",
                        enabled: config.showLegend,
                    },
                    plotOptions: {
                        area: {
                            lineColor: "white",
                            stacking: "normal",
                            fillOpacity: 1,
                            shadow: {
                                color: "rgba(0,0,0,0.2)",
                                offsetX: 0,
                                offsetY: -2,
                                opacity: 0.5,
                                width: 3,
                            },
                            connectNulls: config.connectNulls,
                        },
                        series: {
                            stacking: config.stacking,
                        },
                    },
                };
            },
        };
    });
