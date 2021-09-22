import angular from "angular";
import * as _ from "lodash";
import { watermarkService } from "../../../common/services/watermarkService";
import { CHART_COLORS } from "../../../../app/constants/ChartColors";

angular.module("shared").factory("swBarsChart", function ($filter, $rootScope, swNavigator) {
    function createOrganicPaidPlotLines() {
        return [
            {
                color: "transparent",
                dashStyle: "Dash",
                width: 1,
                value: -0.5,
                label: {
                    rotation: 0,
                    text: "Organic",
                    zIndex: 2,
                    useHTML: true,
                    style: {
                        "font-size": "12px",
                        color: "#707070",
                    },
                    y: -1,
                    x: 2,
                },
            },
            {
                color: "#e4e4e4",
                dashStyle: "Dash",
                width: 1,
                value: 4.5,
                zIndex: 3,
                label: {
                    rotation: 0,
                    text: "Paid",
                    zIndex: 10,
                    useHTML: true,
                    style: {
                        "font-size": "12px",
                        color: "#707070",
                    },
                    y: -1,
                    x: 13,
                },
            },
            {
                color: "#ffffff",
                width: 21,
                value: 4.5,
                zIndex: 2,
            },
        ];
    }

    return {
        getSeries: function (data, scope) {
            var numOfSeries = data.length;
            return _.map(data, function (item, index, arr) {
                var itemData = item.data;
                var options = scope.options || {};
                var colors = options.colors;
                var name = item.displayName || item.name;
                var chartItemsInfo =
                    (scope.data && scope.data[0] && scope.data[0].type) ||
                    (scope.options && scope.options.hasSplitedSearchCategory
                        ? similarweb.utils.volumesAndSharesSplited
                        : similarweb.utils.volumesAndShares);

                var totalSiteVisits = _.reduce(
                    itemData,
                    function (sum, val) {
                        return sum + val;
                    },
                    0,
                );
                var i = 0;

                itemData = _.map(itemData, function (data, key) {
                    var item = {
                        key: key,
                        y: (data / totalSiteVisits) * 100,
                    };

                    // Add color to each of the xAxis categories only if not in compare mode
                    if (numOfSeries == 1) {
                        item.color =
                            (colors && colors[i++]) ||
                            (chartItemsInfo.order[key] && chartItemsInfo.order[key].color) ||
                            CHART_COLORS.chartMainColors[chartItemsInfo.order[key].priority];
                    }
                    return item;
                });

                itemData = _.sortBy(itemData, chartItemsInfo.sort);
                return {
                    name: name,
                    color: colors && colors[index],
                    data: itemData,
                };
            });
        },
        init: function (scope, element) {
            var i18nFilter = $filter("i18n");
            var categories = [];
            var multi = !!(scope.data && scope.data.length > 1);
            var colors = [];
            var options = scope.options || {};
            var chartItemsInfo =
                (scope.data && scope.data[0] && scope.data[0].type) ||
                (scope.options && scope.options.hasSplitedSearchCategory
                    ? similarweb.utils.volumesAndSharesSplited
                    : similarweb.utils.volumesAndShares);
            if (scope.data && scope.data[0]) {
                //        var j = multi ? 0 : _.keys(chartItemsInfo.order).length;
                var i = 0;
                categories = _.map(scope.data[0].data, function (v, key) {
                    var item = chartItemsInfo.order[key];
                    var icon = ((item && item.icon) || key.toLowerCase())
                        .replace(/\s/g, "-")
                        .replace(/[^a-z0-9-]/gim, "");
                    var hasState = item && item.state;
                    var color =
                        (options.colors ? options.colors[i] : item.color) ||
                        CHART_COLORS.chartMainColors[item.priority];

                    colors.push(color);
                    var res = {
                        key: key,
                        //            color: color,
                        html: i18nFilter((item && item.title) || key),
                    };

                    if (hasState) {
                        if (element[0].hasAttribute("industry-analysis-chart")) {
                            res.html =
                                '<a href="' +
                                scope.data[0].urlBuilder(key) +
                                '">' +
                                res.html +
                                "</a>";
                        } else {
                            var href = swNavigator.href(item.state, swNavigator.getParams());
                            if (item.queryParams) {
                                href += "?" + item.queryParams;
                            }
                            res.html = '<a href="' + href + '">' + res.html + "</a>";
                        }
                    }
                    i++;
                    return res;
                });
                categories = _.sortBy(categories, chartItemsInfo.sort);
                categories = _.map(categories, function (item) {
                    return item.html;
                });
            }

            scope.barChartColors = colors;

            return {
                title: { text: null },
                exporting: {
                    enabled: false,
                    chartOptions: {
                        chart: {
                            spacingLeft: 50,
                            spacingRight: 50,
                            spacingTop: 10,
                            spacingBottom: 50,
                            width: 1100,
                            height: 500,
                            marginLeft: 50,
                            marginRight: 50,
                            marginBottom: 100,
                            marginTop: 60,
                        },
                        legend: {
                            itemMarginTop: 15,
                            itemMarginBottom: 10,
                        },
                    },
                },
                colors: colors,
                chart: {
                    margin: [55, 0, 90, 40],
                    spacing: [0, 0, 0, 0],
                    type: "column",
                    borderColor: "#FFFFFF",
                    style: {
                        fontFamily: "Arial",
                        fontSize: "11px",
                    },
                    events: {
                        load: function () {
                            watermarkService.add.call(this, { position: "center" });
                        },
                    },
                },
                xAxis: {
                    plotLines: /*(scope.options && scope.options.hasSplitedSearchCategory) ? createOrganicPaidPlotLines() :*/ null,
                    categories: categories,
                    lineColor: "#e4e4e4",
                    gridLineColor: "#e4e4e4",
                    tickWidth: 0,
                    labels: {
                        align: "center",
                        useHTML: true,
                        style: {
                            fontSize: "13px",
                            fontFamily: '"Roboto", sans-serif',
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
                    opposite: false,
                    showLastLabel: true,
                    labels: {
                        align: "right",
                        enabled: true,
                        useHTML: true,
                        x: -10,
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
                    enabled: multi,
                    floating: false,
                    useHTML: true,
                    align: "left",
                    borderRadius: 0,
                    borderWidth: 0,
                    verticalAlign: "top",
                    labelFormatter: function () {
                        return '<span class="sw-default-cursor">' + this.name + "</span>";
                    },
                    itemStyle: {
                        fontSize: "13px",
                        fontFamily: '"Roboto", sans-serif',
                        color: "#545454",
                    },
                    itemHoverStyle: {
                        color: "#545454",
                    },
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                        pointWidth: 50,
                        minPointLength: 3,
                        dataLabels: {
                            enabled: !multi,
                            formatter: function () {
                                return (Math.round(this.point.y * 100) / 100).toFixed(2) + "%";
                            },
                            color: "#707070",
                            useHTML: true,
                            style: {
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "14px",
                                fontWeight: "bold",
                            },
                            crop: false,
                            overflow: "none",
                        },
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                    },
                },
                tooltip: {
                    enabled: multi,
                    valueDecimals: 2,
                    pointFormatter: function () {
                        var y = (Math.round(this.y * 100) / 100).toFixed(2);
                        return (
                            '<span style="color:' +
                            this.color +
                            '">\u25CF</span>' +
                            this.series.name +
                            ": <b>" +
                            y +
                            "%</b><br/>"
                        );
                    },
                },
            };
        },
    };
});
