import { ServerUrl } from "../../../app/exporters/HighchartExport";
import { Highcharts } from "../../../app/libraries/reactHighcharts";

import angular from "angular";
import * as _ from "lodash";
import { numberFilter, percentageSignFilter } from "../../../app/filters/ngFilters";
import { CHART_COLORS } from "../../../app/constants/ChartColors";
import { SwTrack } from "../../../app/services/SwTrack";

angular
    .module("shared")
    .directive("chart", function (
        $rootScope,
        swAreaChart,
        swPieChart,
        swLineChart,
        swBarsChart,
        $filter,
        $timeout,
        trafficSum,
        chosenSites,
        swRoute,
        pngExportService,
    ) {
        ////////////
        // INIT
        ////////////

        const types = {
            swAreaChart: swAreaChart,
            swPieChart: swPieChart,
            swLineChart: swLineChart,
            swBarsChart: swBarsChart,
        };

        // [pro] SIM-1578 Chart symbols are squashed: change SVGRenderer for images preserveAspectRatio attribute to 'normal' instead of 'one'
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
        const origRenderer = Highcharts.Renderer.prototype.image;
        Highcharts.Renderer.prototype.image = function () {
            const imageElem = origRenderer.apply(this, arguments);
            imageElem.attr("preserveAspectRatio", "xMinYMin");
            return imageElem;
        };

        return {
            require: "?^chartGroup",
            restrict: "E",
            templateUrl: "/partials/websites/chart.html",
            scope: {
                data: "=",
                dates: "=",
                newDataAlgorithm: "=",
                algorithmChangeDate: "=",
                dataName: "@data",
                weights: "=",
                emptyText: "=",
                options: "=?",
                src: "=",
                interval: "=",
                interceptor: "&",
                hideExport: "=",
                trackName: "@",
            },
            link: function postLink(scope, element, attrs, chartGroupCtrl) {
                let options = (scope.options = scope.options || {}),
                    chartService,
                    obj,
                    data,
                    arr,
                    refresh,
                    scopeData;

                scope.showPlotlineInfotip = false;

                scope.closeTip = function () {
                    const infotip = angular.element("#sw-chart-infotip-popup");
                    $timeout(function () {
                        infotip.click();
                    });
                };

                function getScopeData() {
                    if (scope.newDataAlgorithm) {
                        return {
                            old: {
                                data: scope.data,
                                name: $filter("i18n")("analysis.audience.overview.algo.old"),
                                color: CHART_COLORS.compareMainColors[0], //similarweb.config.compareMainColors[0]
                            },
                            new: {
                                data: scope.newDataAlgorithm,
                                name: $filter("i18n")("analysis.audience.overview.algo.new"),
                                color: CHART_COLORS.compareMainColors[0], //similarweb.config.compareMainColors[0]
                            },
                        };
                    } else {
                        return scope.data;
                    }
                }

                scopeData = getScopeData();

                if (!scopeData || !scopeData.length) {
                    element.addClass("sw-no-data");
                }

                scope.hasExport = function () {
                    const $root = $(element).offsetParent();
                    const isSubComponent = $root.hasClass("sw-section");
                    return !(scope.hideExport || isSubComponent);
                };

                function onChartLoad(event) {
                    if (this.options && this.options.chart && this.options.chart.forExport) return;

                    let xAxis;
                    switch (event.type) {
                        case "load":
                        case "redraw":
                            xAxis = event.target.xAxis[0];
                            break;
                        case "afterSetExtremes":
                            xAxis = event.target;
                            break;
                    }

                    const plotElem = xAxis.plotLinesAndBands[1].svgElem;
                    if (plotElem) {
                        const bbox = plotElem.getBBox();
                        scope.$apply(function () {
                            scope.chartInfotipPos = {
                                position: "absolute",
                                top: 18,
                                left: bbox.x - 12,
                            };
                            scope.showPlotlineInfotip = true;
                        });
                    }
                }

                function getConfig() {
                    return {
                        options: scope.options,
                        showLegend:
                            attrs.type === "line"
                                ? scope.newDataAlgorithm
                                    ? chosenSites.isCompare()
                                    : scopeData.length && scopeData[0].data
                                : false,
                        showCrosshairs: chosenSites.isCompare(),
                        startDate: swRoute.duration().from().valueOf(),
                        endDate: swRoute.duration().to().valueOf(),
                        data: scopeData,
                        dates: scope.dates,
                        newAlgorithm: !!scope.newDataAlgorithm,
                        getInterval: function () {
                            return scope.interval || "monthly";
                        },
                    };
                }

                function addPlotLine(config, point) {
                    // sanity
                    if (
                        swRoute.duration().from().isAfter(point) ||
                        swRoute.duration().to().isBefore(point)
                    )
                        return;

                    config.xAxis = config.xAxis || {};
                    config.xAxis.plotLines = [
                        {
                            color: "transparent",
                            width: 50,
                            dashStyle: "Solid",
                            zIndex: 250,
                            value: point.valueOf(),
                        },
                        {
                            color: "orange",
                            width: 2,
                            zIndex: 5,
                            dashStyle: "Dash",
                            value: point.valueOf(),
                        },
                    ];
                    config.xAxis.events = {
                        afterSetExtremes: onChartLoad,
                    };
                    config.chart.events = {
                        load: onChartLoad,
                        redraw: onChartLoad,
                    };
                }

                chartService = types["sw" + $filter("CapitalizeFirstLetter")(attrs.type) + "Chart"];

                $.extend(true, options, {
                    exporting: {
                        enabled: false,
                        url: ServerUrl,
                    },
                    trackName: scope.trackName || "",
                });

                const chartConfig = getConfig();

                obj = $.extend(true, chartService.init(chartConfig, element), options);

                if (options.plotLine) {
                    addPlotLine(obj, options.plotLine);
                }

                // adapt for new algorithm
                if (scope.newDataAlgorithm) {
                    data = chosenSites.isCompare() ? adaptCompareData(data) : adaptSingleData(data);
                }

                //arr = chartService.getSeries(data, scope);

                if (scope.interceptor) {
                    scope.interceptor({ obj: obj });
                }

                obj.chart.renderTo = $(element).find(".sw-chart-inner").get(0);
                obj.credits = false;
                obj.series = arr;

                if (chartGroupCtrl && chartService.getColors) {
                    scope.colors = chartService.getColors(scope);
                    chartGroupCtrl.registerChart(scope);
                }
                if ("colors" in options) {
                    scope.colors = options.colors;
                }

                scope.$on("exportChart", function () {
                    if (scope.hideExport) {
                        scope.exportChart();
                    }
                });

                // handle content resize
                scope.$on("content-resize", function () {
                    if (scope.$highcharts) {
                        reflowChart(scope.$highcharts);
                    }
                });

                function reflowChart(chart) {
                    const renderTo = $(chart.renderTo);
                    const width = renderTo.width();
                    const height = renderTo.height();

                    if (!chart.hasUserSize && width && height) {
                        if (width !== chart.containerWidth || height !== chart.containerHeight) {
                            if (chart.reflowTimeout) clearTimeout(chart.reflowTimeout);

                            chart.reflowTimeout = setTimeout(function () {
                                if (chart.container) {
                                    chart.setSize(width, height, false);
                                    chart.hasUserSize = null;
                                }
                            }, 100);
                        }
                        chart.containerWidth = width;
                        chart.containerHeight = height;
                    }
                }

                if (options.reinitOnTabActivate) {
                    scope.$on("tabActivate", function () {
                        if (scope.$highcharts) {
                            scope.$highcharts = new Highcharts.Chart(obj);
                        }
                    });
                }

                scope.exportChart = function () {
                    if (scope.$highcharts) {
                        if (
                            scope.$highcharts.options.chart.type === "column" ||
                            scope.$highcharts.options.chart.type === "pie"
                        ) {
                            oldExport(); // TODO: switch to png service
                        } else {
                            const chartTitle = getChartTitle();
                            let trimmedDateTitle =
                                chartTitle.indexOf("from") != -1
                                    ? chartTitle.substr(0, chartTitle.indexOf("from") - 1)
                                    : chartTitle;
                            trimmedDateTitle =
                                chartTitle.indexOf("Last") != -1
                                    ? chartTitle.substr(0, chartTitle.indexOf("Last") - 1)
                                    : trimmedDateTitle;
                            pngExportService.export(scope.$highcharts, trimmedDateTitle);
                        }
                        trackExport();
                    }
                };

                function trackExport() {
                    let trackName = scope.trackName || "";
                    let trackTitleRegexCaptures;
                    if (!trackName) {
                        trackTitleRegexCaptures = getChartTitle().match(/^.+?visits/i);
                        if (trackTitleRegexCaptures && trackTitleRegexCaptures.length) {
                            trackName = trackTitleRegexCaptures[0];
                        }
                    }
                    SwTrack.all.trackEvent("Download", "submit-ok", trackName + "/PNG");
                }

                function getChartTitle() {
                    if (options.title) {
                        return options.title;
                    }

                    //Search up the tree for header( in a perfect world we will always have option.title)
                    const $root = $(element).offsetParent();
                    const $title = $root.find("h4, h5").filter(function () {
                        return !$(this).hasClass("caption");
                    });
                    if ($title.length) return $title[0].childNodes[0].nodeValue;
                    return "Chart";
                }

                function oldExport() {
                    const chartTitle = getChartTitle();
                    const exportOptions = {
                        exporting: {
                            url: ServerUrl,
                        },
                        filename: chartTitle.replace(/[,`]/g, " "),
                    };
                    const chartOptions = {
                        title: {
                            text: options.organicPaid ? attrs.site : chartTitle,
                            style: {
                                fontSize: "14px",
                                fontFamily: '"Roboto", sans-serif',
                            },
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: false,
                                },
                            },
                        },
                        legend: {
                            enabled: true,
                            margin: 50,
                            labelFormatter: function () {
                                return (
                                    "<b>" +
                                    this.name +
                                    "</b>: " +
                                    numberFilter()(this.y, 0) +
                                    " (" +
                                    percentageSignFilter()(this.percent, 2) +
                                    ")"
                                );
                            },
                        },
                    };

                    if (options.organicPaid) {
                        chartOptions.chart = {
                            margin: 10,
                            height: 400,
                            width: 300,
                        };
                    }
                    scope.$highcharts.exportChart(exportOptions, chartOptions);
                }

                /**
                 * adapt compare data for new algorithm
                 * @param data
                 * @returns {*}
                 */
                function adaptCompareData(data) {
                    const flatData = [];
                    _.each(data, function (d, type) {
                        const suffix = d.name;
                        _.each(d.data, function (d_inner, j) {
                            flatData.push({
                                data: d_inner.data,
                                site: d_inner.name,
                                name: d_inner.displayName + " [" + suffix + "]" || null,
                                legendTitle: d_inner.displayName,
                                algoType: type,
                                color: CHART_COLORS.compareMainColors[j], //similarweb.config.compareMainColors[j]
                            });
                        });
                    });
                    data = flatData;
                    return data;
                }

                /**
                 * adapt single data for new algorithm
                 * @param data
                 * @returns {*}
                 */
                function adaptSingleData(data) {
                    return [data.old, data.new];
                }

                refresh = function () {
                    //sim-4883 doesn't refresh on filter change
                    scopeData = getScopeData();

                    let data = scopeData,
                        stop,
                        arr,
                        hasValue = data && (data.length || (data.new && data.old)),
                        objSnapShot = obj,
                        dataAsDurationSum = angular.isDefined(options.dataAsDurationSum)
                            ? options.dataAsDurationSum
                            : !!scope.interval;

                    element[!hasValue ? "addClass" : "removeClass"]("sw-no-data");
                    if (!hasValue) {
                        return;
                    }

                    if (dataAsDurationSum) {
                        data = trafficSum.asDuration(
                            scope.interval,
                            scopeData,
                            scope.weights,
                            swRoute.duration().from().toDate(),
                            swRoute.duration().to().toDate(),
                            false,
                            scope.algorithmChangeDate,
                        );
                    } else {
                        data = scopeData;
                    }

                    //data = !scope.interval ? scopeData : trafficSum.asDuration(scope.interval, data, scope.weights, swRoute.duration().from()._d, swRoute.duration().to()._d, false, scope.algorithmChangeDate);

                    // adapt for new algorithm
                    if (scope.newDataAlgorithm) {
                        data = chosenSites.isCompare()
                            ? adaptCompareData(data)
                            : adaptSingleData(data);
                    }

                    obj = $.extend(true, {}, objSnapShot);

                    if (options.plotLine) {
                        addPlotLine(obj, options.plotLine);
                    }

                    const chartConfig = getConfig();

                    chartService.modify && chartService.modify(obj, chartConfig);
                    arr = chartService.getSeries(data, chartConfig);

                    if (options.pointStart) {
                        angular.forEach(arr, function (series) {
                            series.pointStart = options.pointStart;
                        });
                    }

                    obj.series = arr;
                    chartGroupCtrl && chartGroupCtrl.showLegend && chartGroupCtrl.showLegend(scope);
                    stop = $timeout(function () {
                        // highcharts correct rendering depends on the correct width and height of the chart container.
                        // the chart container here is affected from the current cssSection ancestor defined dynamically in app.js upon successful navigation.
                        // since we can't but sure when angular will actually apply the cssSection from the ng-class to a real class of the DOM ancestor,
                        // we are actually in race condition here. sometime this function is called before angular applies the css class to the DOM.
                        // as a result sometimes we see odd outcomes and the charts not render in the correct dimenstion (because the sass rules are not applied).
                        // to prevent this unpredictable situation we need to have a longer timeout than just "0".
                        $timeout.cancel(stop);
                        scope.$highcharts = new Highcharts.Chart(obj);
                    }, 1500);
                };

                scope.$watch("data", function (oldResp, newResp) {
                    if (!angular.equals(oldResp, newResp)) {
                        refresh();
                    }
                });

                if (scope.interval) {
                    scope.$watch("interval", function (oldResp, newResp) {
                        if (!angular.equals(oldResp, newResp)) {
                            refresh();
                        }
                    });
                }

                refresh();
            },
        };
    });
