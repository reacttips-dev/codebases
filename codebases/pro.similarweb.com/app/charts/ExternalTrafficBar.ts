import angular from "angular";
import * as _ from "lodash";
import { i18nFilter, sourceStrength } from "filters/ngFilters";
import { icons } from "@similarweb/icons";
import { CHART_COLORS } from "constants/ChartColors";

export interface ISWBarChart {
    data: any;
    options: any;
    colors: any;
    isCompare: boolean;
    getChartConfig(): any;
    getCategories(): any;
}

const i18n = i18nFilter(),
    ssFilter = sourceStrength(),
    yAxisLabels = ["", ssFilter(1), ssFilter(2), ssFilter(3)],
    xAxisLabelsTooltips = {
        Mail: [
            i18n("appanalysis.external.traffic.bar.mail.title"),
            i18n("appanalysis.external.traffic.bar.mail.tooltip"),
        ],
        Referrals: [
            i18n("appanalysis.external.traffic.bar.referrals.title"),
            i18n("appanalysis.external.traffic.bar.referrals.tooltip"),
        ],
        Search: [
            i18n("appanalysis.external.traffic.bar.search.title"),
            i18n("appanalysis.external.traffic.bar.search.tooltip"),
        ],
        Social: [
            i18n("appanalysis.external.traffic.bar.social.title"),
            i18n("appanalysis.external.traffic.bar.social.tooltip"),
        ],
        "Display Ads": [
            i18n("appanalysis.external.traffic.bar.displayads.title"),
            i18n("appanalysis.external.traffic.bar.displayads.tooltip"),
        ],
    };

angular
    .module("sw.charts")
    .factory(
        "ExternalTrafficBar",
        (
            $filter: angular.IFilterService,
            $window: angular.IWindowService,
            Bar: new (options: any, data: any) => ISWBarChart,
        ) => {
            return class ExternalTrafficBar extends Bar {
                chartItemsInfo = $window["similarweb"].utils.volumesAndShares;
                protected dataFormat = null;

                constructor(
                    public options: any = {},
                    public data: any = [],
                    private keys: string[],
                ) {
                    super(options, data);
                    this.isCompare = keys.length > 1;
                }

                protected getColors() {
                    if (this.isCompare) {
                        return CHART_COLORS.compareMainColors.slice();
                    } else {
                        return CHART_COLORS.chartMainColors.slice();
                    }
                }

                protected getSeries() {
                    return this.data.map((item) => {
                        let colors = this.getColors(),
                            color = colors[item.legendIndex],
                            name = item.name,
                            sortable = _.map(item.data, (data: number, key) => {
                                return {
                                    key: key,
                                    y: isNaN(data) ? 0 : data,
                                };
                            }),
                            data = _.sortBy(sortable, this.chartItemsInfo.sort);

                        return this.isCompare
                            ? {
                                  name,
                                  data,
                                  color,
                              }
                            : {
                                  name,
                                  data: data.map((item: any) => {
                                      return { ...item, color: colors.shift() };
                                  }),
                              };
                    });
                }

                public getCategories() {
                    // categories for x-axis
                    let colors = this.getColors();

                    return Object.keys(xAxisLabelsTooltips).map((item, index) => {
                        const icon = item
                                .toLowerCase()
                                .replace(/\s/g, "-")
                                .replace(/[^a-z0-9-]/gim, ""),
                            color = this.isCompare ? "inherit" : colors[index];
                        return `<div class="category-container" title="${xAxisLabelsTooltips[item][1]}" style="color: ${color};fill: ${color};">
                             <span class="x-axis-category-icon">${icons[icon]}</span>
                             ${xAxisLabelsTooltips[item][0]}
                         </div>`;
                    });
                }

                public getChartConfig() {
                    return _.merge(super.getChartConfig(), {
                        options: {
                            chart: {
                                marginTop: 10,
                                marginLeft: 60,
                            },
                            yAxis: {
                                tickPositions: [0, 1, 2, 3],
                                labels: {
                                    formatter: function () {
                                        return yAxisLabels[this.value];
                                    },
                                    style: {
                                        textTransform: "",
                                        left: "-4px",
                                    },
                                },
                            },
                            plotOptions: {
                                column: {
                                    dataLabels: {
                                        enabled: false,
                                    },
                                },
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                    });
                }
            };
        },
    );
