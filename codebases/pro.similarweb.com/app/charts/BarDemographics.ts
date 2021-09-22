import angular from "angular";
import * as _ from "lodash";
/**
 * Created by Eran.Shain on 11/2/2016.
 */
import { ISWBarChart } from "./Bar";
import { icons } from "@similarweb/icons";
import { watermarkService } from "../../scripts/common/services/watermarkService";
import { CHART_COLORS } from "constants/ChartColors";
import { CHART_ICONS } from "constants/ChartIcons";
import { chosenItems } from "common/services/chosenItems";

angular
    .module("sw.charts")
    .factory(
        "DemographicsBar",
        ($filter: ng.IFilterService, Bar: new (options: any, data: any) => ISWBarChart) => {
            return class extends Bar {
                isCompare: boolean;
                barWidth: number;
                barShowLegend: boolean;
                hideCategoriesIcons: boolean = true;
                categoryColors: string[];
                categoryIcons: string[];
                forceSetupColors: boolean;
                widgetColorsFrom: string;
                numComparedItems: number;

                constructor(options: any, data: any) {
                    super(options, data);
                    this.numComparedItems = options.numComparedItems;
                    this.isCompare = options.isCompare;
                    this.barWidth = options.viewOptions.barWidth;
                    this.barShowLegend = options.viewOptions.barShowLegend;
                    this.hideCategoriesIcons = this.options.viewOptions.hideCategoriesIcons;
                    this.forceSetupColors = options.viewOptions.forceSetupColors;
                    this.widgetColorsFrom = options.viewOptions.widgetColorsFrom;
                    this.categoryColors = options.viewOptions.categoryColors
                        ? CHART_COLORS[options.viewOptions.categoryColors]
                        : null;
                    this.categoryIcons = options.viewOptions.categoryIcons
                        ? CHART_ICONS[options.viewOptions.categoryIcons]
                        : null;

                    if (this.forceSetupColors && this.widgetColorsFrom) {
                        this.colors = CHART_COLORS[this.widgetColorsFrom].slice();
                    }
                }

                private getAppName(appCode) {
                    const item = _.find(chosenItems.$all(), (item) => item.Id === appCode);
                    const { Title = appCode } = item || ({} as any);
                    return Title;
                }

                private getAppColor(appCode) {
                    const item = _.find(chosenItems.$all(), (item) => item.Id === appCode);
                    const { paletteColor = appCode } = item || ({} as any);
                    return paletteColor;
                }

                public getCategories() {
                    let i18nFilter: any = $filter("i18n");
                    let { hideCategoriesIcons } = this;
                    let { categoryColors } = this;
                    let { categoryIcons } = this;
                    const nonUniqueCategories = Object.keys(this.data).reduce(
                        (allCategories, appCode) => {
                            const appCategories = Object.keys(this.data[appCode]);
                            return [...allCategories, ...appCategories];
                        },
                        [],
                    );
                    let categories = _.uniq(nonUniqueCategories);

                    let categoryHTML = _.map(categories, (item, index) => {
                        let color = categoryColors ? categoryColors[index] : null;
                        let icon = categoryIcons ? categoryIcons[index] : null;
                        return hideCategoriesIcons || !categoryIcons
                            ? `<div class="barLabel u-flex-row u-justifyCenter"> ${i18nFilter(
                                  item,
                              )} </div>`
                            : `<div class="barLabel u-flex-row u-justifyCenter">
                              <span class="bar-icon">${icons[icon]}</span>
                              <span>${i18nFilter(item)}</span>
                        </div>`;
                    });

                    return categoryHTML;
                }

                getSeries(): any {
                    const colors = [...this.colors];
                    if (!this.isCompare) {
                        const appCode = Object.keys(this.data)[0];
                        return [
                            {
                                name: this.getAppName(appCode),
                                data: _.map(_.head(_.values(this.data)), (val, key) => ({
                                    key: key,
                                    y: val,
                                    color: colors.shift(),
                                })),
                            },
                        ];
                    } else {
                        return _.map(this.data, (agesObject, appCode) => {
                            return {
                                name: this.getAppName(appCode),
                                data: _.values(agesObject),
                                color: this.forceSetupColors
                                    ? colors.shift()
                                    : this.getAppColor(appCode),
                            };
                        });
                    }
                }

                getColors() {
                    if (this.forceSetupColors && this.widgetColorsFrom) {
                        return CHART_COLORS[this.widgetColorsFrom].slice();
                    }
                    return CHART_COLORS.compareMainColors.slice();
                }

                getGroupPadding(numOfItems) {
                    return 0.45 - numOfItems * 0.05;
                }

                getChartConfig() {
                    const { barWidth } = this;
                    const { barShowLegend } = this;
                    const { isCompare } = this;
                    return _.merge(super.getChartConfig(), {
                        options: {
                            chart: {
                                height: this.options.height || 240,
                                margin: [20, 0, 30, 35],
                                events: {
                                    load: function () {
                                        var chart = this;
                                        watermarkService.add.call(chart, { opacity: 0.1 });
                                    },
                                    resize: function () {
                                        var chart = this;
                                        setTimeout(function () {
                                            //fix for chart width
                                            try {
                                                chart.reflow();
                                            } catch (e) {}
                                        }, 1000);
                                    },
                                },
                            },
                            yAxis: {
                                max: null,
                                endOnTick: true,
                                labels: {
                                    style: {
                                        color: "#A3A3A3",
                                        fontSize: "11px",
                                    },
                                },
                            },
                            xAxis: {
                                labels: {
                                    useHTML: true,
                                    style: {
                                        fontSize: "22px",
                                        lineHeight: "22px",
                                    },
                                },
                            },
                            credits: {
                                enabled: false,
                            },
                            plotOptions: {
                                column: {
                                    borderWidth: 0,
                                    groupPadding: this.getGroupPadding(this.numComparedItems),
                                    pointWidth: isCompare ? null : barWidth,
                                    maxPointWidth: barWidth,
                                    pointPadding: 0.1,
                                    grouping: true,
                                    dataLabels: {
                                        useHTML: false,
                                        enabled: barShowLegend,
                                        style: {
                                            color: "#707070",
                                            fontSize: "12px",
                                            fontWeight: 400,
                                        },
                                        zIndex: 0,
                                    },
                                },
                            },
                            tooltip: {
                                useHTML: true,
                                borderWidth: 0,
                                backgroundColor: "#fff",
                                headerFormat: "<span></span>",
                                style: {
                                    fontSize: "14px",
                                    fontWeight: 300,
                                },
                                pointFormatter: function () {
                                    var y = (Math.round(this.y * 100) / 100).toFixed(2);
                                    return `<span class="barTooltip-name">
                                            <span style="margin-right:5px; color:${
                                                this.color
                                            };">\u25CF</span>
                                            <span style="margin-right:5px; font-weight: ${
                                                this.isHover && this.series.isHover
                                                    ? "bold"
                                                    : "normal"
                                            }">${this.series.name}</span>
                                                <b style="color:${
                                                    this.color
                                                };font-weight: bold;">${y}%</b>
                                                <br/>
                                        </span>`;
                                },
                            },
                        },
                    });
                }
            };
        },
    );
