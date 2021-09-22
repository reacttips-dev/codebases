import { GraphWidget } from "./GraphWidget";
import { ChartMarkerService } from "services/ChartMarkerService";
import angular from "angular";
import { dashboardMmxTooltipPositioner, tooltipPositioner } from "services/HighchartsPositioner";
import * as _ from "lodash";
import swLog from "@similarweb/sw-log";
import { CHART_COLORS } from "constants/ChartColors";
import { trafficChannelsService } from "services/TrafficChannelsService";

/**
 * Created by Eyal.Albilia
 */
export class MmxChannelsGraphDashboardWidget extends GraphWidget {
    public isPptSupported = () => {
        const hasData = this.chartConfig.series && this.chartConfig.series.length > 0;
        const hasOptions = !!this.metadata.chartOptions;
        return hasData && hasOptions;
    };

    constructor() {
        super();
    }

    static getWidgetMetadataType() {
        return "MmxChannelsGraphDashboard";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/graph.html`;
    }

    protected getLegendResources(siteList) {
        let index = 0;
        return siteList.map((rootDomain) => {
            const item: any = {};
            this._sitesResource.GetWebsiteImage({ website: rootDomain }, function (data) {
                item.icon = data.image;
            });
            return angular.extend(item, {
                id: rootDomain,
                name: rootDomain,
                color: CHART_COLORS.chartMainColors[index],
                smallIcon: true,
                legendClass: "legend-smallHeight",
                type: "Website",
                index: index++,
            });
        });
    }

    getLegendItems() {
        return this.legendItems;
    }

    protected updateLegendItems() {
        this.setUtilityData("legendItems", this.legendItems);
    }

    protected getChartOptions(formattedData): any {
        const defaultChartOptions = super.getChartOptions(formattedData);

        if (this.dashboardId === "PREVIEW") {
            return {
                ...defaultChartOptions,
                legend: {
                    itemDistance: 11,
                    labelFormatter: function () {
                        const markerClass = "horizontal";
                        return `<div class="ariaStack-legend mmx-dashboard-preview-legend">
                                                <span class="item-marker ${markerClass}" style="background-image: ${
                            ChartMarkerService.createMarkerStyle(this.color).background
                        };"></span>
                                                <span class="legend-name-text ${markerClass}" title="${
                            this.name
                        }">${this.name}</span>
                                            </div>`;
                    },
                },
            };
        } else {
            return defaultChartOptions;
        }
    }

    protected getChartSeries(unorderedData: any): any[] {
        const selectedChannel = this._widgetConfig.properties.selectedChannel;
        const selectedSites = Object.keys(unorderedData);
        if (
            this._widgetConfig.properties.selectedChannel == undefined ||
            selectedSites.length == 1
        ) {
            this._widgetConfig.properties.selectedChannel = undefined;
            const trafficChannels = trafficChannelsService.getAvailableTrafficChannels();
            let orderedData = super.getChartSeries(unorderedData);
            orderedData.forEach((elem) => {
                const innerOrder = _.map(
                    _.filter(trafficChannels, { id: elem.name }),
                    "innerOrder",
                );
                elem.legendIndex =
                    innerOrder && innerOrder.length > 0
                        ? _.map(_.filter(trafficChannels, { id: elem.name }), "innerOrder")[0]
                        : 0;
                elem.color = CHART_COLORS.chartMainColors[elem.legendIndex];
                elem.marker = angular.extend(elem.marker, {
                    symbol: `url(${ChartMarkerService.createMarkerSrc(elem.color)})`,
                });
            });
            orderedData = orderedData.sort((a, b) => {
                return a.legendIndex - b.legendIndex;
            });
            return orderedData;
        }

        this.legendItems = this.getLegendResources(selectedSites);
        this.updateLegendItems();
        let index = 0;
        const selectedChannelBEName = trafficChannelsService.getChannelById(selectedChannel);
        return selectedSites.map((rootDomain) => {
            return {
                name: rootDomain,
                showInLegend: false,
                color: CHART_COLORS.chartMainColors[index],
                seriesName: rootDomain,
                data: super.formatSeries(
                    _.get(
                        unorderedData,
                        `["${rootDomain}"]["${selectedChannelBEName.name}"][0]`,
                        [],
                    ),
                ),
                marker: {
                    symbol: "circle",
                    lineWidth: 1,
                    color: CHART_COLORS.chartMainColors[index],
                },
                index: index++,
            };
        });
    }

    protected _getTitle() {
        if (this._widgetConfig.properties.titleTemplate == "custom") {
            return super._getTitle();
        }
        const trafficChannels = trafficChannelsService.getAvailableTrafficChannels();
        const selectedChannel = this._widgetConfig.properties.selectedChannel;
        let title = super._getTitle();
        if (selectedChannel && this._widgetConfig.properties.key.length > 1) {
            const i18selected: any = _.filter(trafficChannels, function (currentChannel: any) {
                if (title.indexOf(currentChannel.text) > -1) {
                    const regexp = new RegExp(currentChannel.text, "g");
                    title = title.replace(regexp, "").trim();
                }
                return currentChannel.id == selectedChannel;
            });
            if (i18selected && i18selected.length > 0) {
                title += " " + i18selected[0].text;
            } else {
                swLog.exception("Error Choosing Channel " + selectedChannel);
            }
        }
        return title;
    }

    getHighChartsConfig(chartOptions, formattedData) {
        return this._ngHighchartsConfig.lineGraphWidget(
            _.merge({}, chartOptions, {
                tooltip: {
                    positioner: this.isCompare()
                        ? tooltipPositioner
                        : dashboardMmxTooltipPositioner,
                },
            }),
            formattedData,
        );
    }

    onResize() {
        if (this.chartConfig.options && this.chartConfig.options.chart) {
            if (this.pos.sizeY === 2) {
                this.chartConfig.options.chart.height = 540;
            } else {
                if (this.isCompare()) {
                    this.chartConfig.options.chart.height = 200;
                } else {
                    this.chartConfig.options.chart.height = 230;
                }
            }
        }
        if (this.chartInstance && typeof this.chartInstance.reflow === "function") {
            this.chartInstance.reflow();
        }
    }
}

MmxChannelsGraphDashboardWidget.register();
