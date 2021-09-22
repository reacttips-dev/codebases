import angular, { IWindowService } from "angular";
import * as _ from "lodash";
import { tooltipPositioner } from "services/HighchartsPositioner";
import { watermarkService } from "../../scripts/common/services/watermarkService";
import { CHART_COLORS } from "constants/ChartColors";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { hasAccessToPackage } from "common/services/solutions2Helper";
import { htmlOpenNewWindowIcon } from "./MmxTrafficSourcesBar";
import { getFallbackState, hasAccessToState } from "common/services/solutions2Helper";

export interface ISWBarChart {
    data: any;
    options: any;
    colors: any;
    webSource: string;
    getChartConfig(): any;
    getSeries(dataMode: string): any[];
    getCategories(dataSource?: any[]): any[];
    dataFormat: string;
}

angular.module("sw.charts").factory("Bar", ($filter, $window: IWindowService, swNavigator) => {
    const DEFAULT_COLORS = CHART_COLORS.main,
        NEW_COLOR_PALETTE = CHART_COLORS.compareMainColors,
        TRAFFIC_SOURCES_COLORS = CHART_COLORS.trafficSourcesColors;

    const percentDataFormat = "percent";

    return class Bar implements ISWBarChart {
        colors: any;
        protected isCompare: boolean;
        dataFormat: string;
        webSource: string;
        chartItemsInfo = $window["similarweb"].utils.volumesAndSharesSplited;

        constructor(
            public options: any = {},
            public data: any = [],
            dataFormat: string = percentDataFormat,
            webSource: string = "",
        ) {
            this.options = options;
            this.data = data;
            this.isCompare = this.data.length > 1;
            this.colors = this.getColors();
            this.dataFormat = dataFormat;
            this.webSource = webSource;
        }

        public getCategories(dataSource = this.data) {
            let that: any = this,
                i18nFilter: any = $filter("i18n"),
                colors = this.getColors();
            const [{ data = {} }] = dataSource;

            let categories = _.map(data, (item, key) => {
                return { key: key };
            });
            categories = _.sortBy(categories, this.chartItemsInfo.sort);
            return _.map(categories, (category: any) => {
                let key = category.key;
                let item = that.chartItemsInfo.order[key];
                let icon = ((item && item.icon) || key.toLowerCase())
                    .replace(/\s/g, "-")
                    .replace(/[^a-z0-9-]/gim, "");
                let hasState = item && item.state;
                let queryParams = item && item.queryParams;
                let color = colors.shift();
                const chosenTitle = i18nFilter((item && item.title) || key);
                let categoryHTML = chosenTitle;

                if (
                    hasState &&
                    this.options.linkParams &&
                    !_.result(this.options, "viewOptions.disableLinks") == true
                ) {
                    const packageName = swNavigator.getPackageName(swNavigator.current());
                    const [targetState, isSameModule] = getWidgetCTATarget(
                        item.title === "utils.paidSearch" && packageName !== "legacy"
                            ? "competitiveanalysis_website_paid_search_overview"
                            : item.state,
                        [packageName],
                        swNavigator,
                    );
                    if (hasAccessToPackage(swNavigator.getPackageName(targetState))) {
                        let href = `${swNavigator.href(
                            targetState,
                            this.options.linkParams,
                        )}?webSource=${swNavigator.getParams().webSource || this.webSource}`;
                        if (queryParams) {
                            href = `${href}&${queryParams}`;
                        }
                        const linkTarget = isSameModule ? "_self" : "_blank";
                        const newWindowIcon = isSameModule ? "" : htmlOpenNewWindowIcon;
                        categoryHTML = `<a href="${href}" data-ts-category="${category.key}" title="${chosenTitle}" target="${linkTarget}">${chosenTitle}${newWindowIcon}</a>`;
                    }
                }
                return categoryHTML;
            });
        }

        public getSeries(format: string) {
            return this.data.map(({ data: itemData, name }) => {
                let colors = this.getColors();
                let totalSiteVisits = _.reduce(
                    itemData,
                    function (sum: number, val: number) {
                        return sum + val;
                    },
                    0,
                );
                itemData = _.map(itemData, (data: number, key) => {
                    data = format == percentDataFormat ? (data / totalSiteVisits) * 100 : data;
                    if (isNaN(data)) {
                        data = 0;
                    }
                    return {
                        key: key,
                        y: data,
                    };
                });
                itemData = _.sortBy(itemData, this.chartItemsInfo.sort);
                if (!this.isCompare) {
                    itemData.forEach((item: any) => {
                        item.color = colors.shift();
                    });
                }

                return {
                    name,
                    data: itemData,
                };
            });
        }

        public getColors() {
            let defaultColors = [];
            if (this.options.viewOptions && this.options.viewOptions.forceSetupColors) {
                defaultColors = CHART_COLORS[this.options.viewOptions.widgetColorsFrom].slice();
            } else if (this.options.viewOptions && this.options.viewOptions.newColorPalette) {
                defaultColors = NEW_COLOR_PALETTE.slice();
            } else if (this.isCompare) {
                defaultColors = DEFAULT_COLORS.slice();
            } else {
                defaultColors = TRAFFIC_SOURCES_COLORS.slice();
            }
            const [{ data = {} }] = this.data;
            return Object.keys(data).map((itemName, itemIndex) => {
                const {
                    order: { [itemName]: chartItem },
                } = this.chartItemsInfo;
                let { color } = chartItem;
                const { colors = defaultColors } = this.options;
                color = colors[itemIndex];
                return color;
            });
        }

        public getChartConfig() {
            const that = this;
            // if the widget has a CTA button we need different margin to the HighChart
            const hasCTAButton = that.options.viewOptions.ctaButton;
            return {
                series: this.getSeries(this.dataFormat),
                options: {
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
                                height: 220,
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
                    colors: this.colors,
                    chart: {
                        height: 220,
                        margin: hasCTAButton ? [10, 0, 25, 40] : [0, 0, 90, 40],
                        spacing: [0, 0, 0, 0],
                        type: "column",
                        borderColor: "#FFFFFF",
                        style: {
                            fontFamily: "Arial",
                            fontSize: "11px",
                        },
                        animation: true,
                        events: {
                            // enable data labels on export: workaround for https://github.com/highslide-software/highcharts.com/issues/1562
                            load: function () {
                                var chart = this;
                                setTimeout(function () {
                                    //fix for chart width
                                    try {
                                        chart.reflow();
                                    } catch (e) {}
                                }, 1000);
                                watermarkService.add.call(chart, { opacity: 0.1 });
                            },
                        },
                    },
                    credits: {
                        enabled: false,
                    },
                    xAxis: {
                        categories: this.getCategories(),
                        lineColor: "#e4e4e4",
                        gridLineColor: "#e4e4e4",
                        tickWidth: 0,
                        labels: {
                            align: "center",
                            rotation: 0,
                            useHTML: true,
                            style: {
                                fontSize: "14px",
                                textAlign: "center",
                                fontFamily: '"Roboto", sans-serif',
                            },
                        },
                    },
                    yAxis: {
                        gridLineColor: "#e4e4e4",
                        min: this.dataFormat === percentDataFormat ? 0 : null,
                        max: this.dataFormat === percentDataFormat ? 105 : null,
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
                            formatter() {
                                if (that.dataFormat === percentDataFormat) {
                                    return this.value + "%";
                                } else {
                                    return $filter("abbrNumber")(this.value, true);
                                }
                            },
                            style: {
                                fontSize: "12px",
                                textTransform: "uppercase",
                                fontFamily: '"Roboto", sans-serif',
                                color: "#aaa",
                            },
                        },
                    },
                    legend: {
                        enabled: false,
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
                            pointWidth: this.isCompare ? 20 : 50,
                            minPointLength: 3,
                            dataLabels: {
                                enabled: !this.isCompare,
                                formatter:
                                    that.dataFormat === percentDataFormat
                                        ? function () {
                                              return (
                                                  (Math.round(this.point.y * 100) / 100).toFixed(
                                                      2,
                                                  ) + "%"
                                              );
                                          }
                                        : function () {
                                              return $filter("abbrNumber")(this.point.y);
                                          },
                                color: "#707070",
                                useHTML: true,
                                style: {
                                    fontFamily: '"Roboto", sans-serif',
                                    fontSize: "14px",
                                    fontWeight: "400",
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
                        enabled: this.isCompare,
                        shared: true,
                        valueDecimals: 2,
                        positioner: tooltipPositioner,
                        pointFormatter: function () {
                            let y;
                            if (that.dataFormat === percentDataFormat) {
                                y = (Math.round(this.y * 100) / 100).toFixed(2) + "%";
                            } else {
                                y = $filter("abbrNumber")(this.y || 0);
                            }
                            const color = this.pointTooltipColor
                                ? this.pointTooltipColor
                                : this.color;
                            return `<span style="color:${color}; font-family: Roboto;">\u25CF </span>${this.series.name}: <span style="font-weight: bold;color:${color};">${y}</span><br/>`;
                        },
                    },
                },
            };
        }
    };
});
