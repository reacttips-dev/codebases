import { Highcharts } from "../../../../app/libraries/reactHighcharts";
import angular from "angular";
import { CHART_COLORS } from "../../../../app/constants/ChartColors";

angular.module("shared").factory("swPieChart", function ($filter, ngHighchartsConfig) {
    var getColors = function (scope) {
        if (scope.options) {
            if (scope.options.colors) {
                return scope.options.colors;
            }
            if (scope.options.multi) {
                return CHART_COLORS.compareMainColors; // similarweb.config.compareMainColors;
            }
            if (scope.options.organicPaid) {
                return CHART_COLORS.mobileWeb; //similarweb.config.organicPaidColors;
            }
        }

        return CHART_COLORS.chartMainColors; //similarweb.config.chartMainColors;
    };
    return {
        getSeries: function (data) {
            return [
                {
                    type: "pie",
                    data: data,
                    showInLegend: true,
                },
            ];
        },
        getColors: getColors,
        init: function (scope) {
            var format = similarweb.utils.charts.formatter($filter)["number"];
            var innerSize = "50%";
            var size = "90%";
            if (scope.options) {
                if (scope.options.mini) {
                    innerSize = null;
                    size = "72%";
                } else if (scope.options.donut) {
                    innerSize = "70%";
                    size = "90%";
                }
            }

            return {
                colors: getColors(scope),
                chart: {
                    type: "pie",
                    animation: true,
                    spacing: [0, 0, 0, 0],
                    margin: [0, 5, 0, 0],
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    backgroundColor: "transparent",
                    width: (scope.options && scope.options.pieWidth) || undefined,
                    height: (scope.options && scope.options.pieHeight) || undefined,
                    events: {
                        // enable data labels on export: workaround for https://github.com/highslide-software/highcharts.com/issues/1562
                        load: function () {
                            if (this.options.chart.forExport) {
                                Highcharts.each(this.series, function (series) {
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
                        },
                    },
                },
                title: { text: null },
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
                                return `<b>${this.options.name}</b>: ${$filter("minVisitsAbbr")(
                                    this.options.y,
                                )} (${format(this.options.percent, 2)}%)`;
                            },
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: true,
                                    color: "transparent",
                                    connectorColor: "transparent",
                                    formatter: function () {
                                        return "";
                                    },
                                },
                            },
                        },
                    },
                },
                tooltip: {
                    pointFormat: "<b>{point.percentage:.2f}%</b>",
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        innerSize: innerSize,
                        size: size,
                        shadow: false,
                        cursor: "pointer",
                        slicedOffset: 2,
                        dataLabels: {
                            enabled: false,
                            color: "#000000",
                            connectorColor: "#000000",
                            formatter: function () {
                                return (
                                    "<b>" +
                                    this.point.name +
                                    "</b>: " +
                                    format(this.percentage, 2) +
                                    " %"
                                );
                            },
                        },
                        events: {
                            legendItemClick: function (e) {
                                return ngHighchartsConfig.legendItemClick(this, e, "Pie Chart");
                            },
                        },
                    },
                },
            };
        },
    };
});
