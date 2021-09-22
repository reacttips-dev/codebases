import angular, { IWindowService, IFilterService } from "angular";
import * as _ from "lodash";
import { i18nFilter, sourceStrength } from "filters/ngFilters";
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
        "In-Store Search": [
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.search.title"),
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.search.tooltip"),
        ],
        "Referring Apps": [
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.referring.title"),
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.referring.tooltip"),
        ],
        Charts: [
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.charts.title"),
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.charts.tooltip"),
        ],
        Featured: [
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.featured.title"),
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.featured.tooltip"),
        ],
        "Developer Pages": [
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.pages.title"),
            i18n("mobileAppsAnalysis.storePage.instoretraffic.chart.pages.tooltip"),
        ],
    };

angular
    .module("sw.charts")
    .factory(
        "InstoreTrafficBar",
        (
            $filter: IFilterService,
            $window: IWindowService,
            Bar: new (options: any, data: any) => ISWBarChart,
        ) => {
            return class InstoreTrafficBar extends Bar {
                dataFormat = null;
                chartItemsInfo = $window["similarweb"].utils.appTrafficSources;

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
                        return `<div title="${xAxisLabelsTooltips[item][1]}" style="color: ${color};">
                             <i class="sw-icon-${icon}"></i>
                             ${xAxisLabelsTooltips[item][0]}
                         </div>`;
                    });
                }
            };
        },
    );
