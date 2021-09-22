import * as _ from "lodash";
import { ChartWidget } from "components/widget/widget-types/ChartWidget";
import { DemographicsBarChartExporter } from "exporters/DemographicsBarChartExporter";
import { object } from "prop-types";
import { CHART_COLORS } from "constants/ChartColors";
import {
    IPptBarChartRequest,
    IPptSeriesData,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import {
    getWidgetSubtitle,
    getWidgetTitle,
} from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import { getBarChartWidgetPptOptions } from "components/widget/widget-utilities/widgetPpt/PptBarChartWidgetUtils";
import { chosenItems } from "common/services/chosenItems";

export class BarChartDemographicsWidget extends ChartWidget {
    protected _DemographicsBar;
    private _chosenSites;
    private DemographicsBar: any;
    private barGraph: any;
    public legendClass: string;

    public isPptSupported = () => {
        // TODO: add support for compare mode
        const isCompare = this.isCompare();
        if (isCompare) return false;

        const hasSeries = this.chartConfig.series && this.chartConfig.series.length > 0;
        if (!hasSeries) return false;

        return this.chartConfig.series[0].data && this.chartConfig.series[0].data.length > 0;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this),
            type: "bar",
            details: {
                format: "percent",
                options: getBarChartWidgetPptOptions(),
                data: this.isCompare()
                    ? this.getCompareModeSeriesDataForPpt()
                    : this.getSingleModeSeriesDataForPpt(),
            } as IPptBarChartRequest,
        };
    };

    private getCompareModeSeriesDataForPpt = (): IPptSeriesData[] => {
        throw new Error("Not yet supported");
    };

    private getSingleModeSeriesDataForPpt = (): IPptSeriesData[] => {
        const series = this.chartConfig.series[0];

        return series.data.map((record: { key: string; y: number; color: string }) => {
            return {
                seriesName: record.key,
                seriesColor: record.color,
                labels: [series.name],
                values: [record.y / 100],
            };
        });
    };

    static $inject = ["ngHighchartsConfig", "chosenSites", "DemographicsBar"];

    static getWidgetMetadataType() {
        return "BarChartDemographics";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    static getWidgetDashboardType() {
        return "BarChart";
    }

    protected setMetadata() {
        const widgetProp = this._metricTypeConfig.properties || this._widgetConfig.properties;
        const chartOptions = {
            type: "BarChart",
            height: parseInt(widgetProp.height) || 220,
            dashboardId: this.dashboardId,
        };
        this.metadata = { chartOptions };
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        const { _chosenSites: chosenSites } = this;
        switch (this.getWidgetModel().family) {
            case "Website":
                this.metadata.chartOptions.isCompare = this.isCompare();
                this.metadata.chartOptions.numComparedItems = this.getWidgetModel().key.length - 1;
                this.legendClass = "";
                break;
            case "Mobile":
                this.metadata.chartOptions.isCompare = this.isCompare();
                this.metadata.chartOptions.numComparedItems = this.getWidgetModel().key.length - 1;
                this.legendClass = "demographics-legend";
                break;
        }
        this.metadata.chartOptions.viewOptions = this._viewOptions;
        const formattedData = this.formatDataSingleMode(response.Data);
        if (this._viewOptions && this._viewOptions && this._viewOptions.forceSetupColors) {
            this.metadata.chartOptions.colors = CHART_COLORS[
                this._viewOptions.widgetColorsFrom
            ].slice();
        }
        const bar = (this.barGraph = new this._DemographicsBar(
            this.metadata.chartOptions,
            formattedData,
        ));
        this.chartConfig = bar.getChartConfig();
    }

    protected formatDataSingleMode(unorderedData) {
        const appCodes = Object.keys(unorderedData).filter((key) => !!key.split(".").length);
        const newVals = _.mapValues(_.pick(unorderedData, appCodes), (payLoad) => {
            return _.mapKeys(payLoad, (score, ageRange) => {
                return ageRange.replace(/(age|to|plus)/gi, (all, match) => {
                    switch (match) {
                        case "Age":
                            return "";
                        case "To":
                            return "-";
                        case "Plus":
                            return "+";
                    }
                });
            });
        });
        return newVals;
    }

    protected validateData(response: any) {
        const validByBase = super.validateData(response);
        return validByBase && !_.isEmpty(response);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onResize() {}

    getLegendItems(data?: any) {
        const legendItems = super.getLegendItems().slice();
        let colors = CHART_COLORS.compareMainColors.slice();

        if (
            this._widgetConfig.properties &&
            this._widgetConfig.properties.options &&
            this._widgetConfig.properties.options.forceSetupColors
        ) {
            colors = CHART_COLORS[this._widgetConfig.properties.options.widgetColorsFrom].slice();
        }
        let numberOfVisibleItems;
        switch (this.getWidgetModel().family) {
            case "Website":
                numberOfVisibleItems = Object.keys(this.getWidgetModel().key).length - 1;
                break;
            case "Mobile":
                numberOfVisibleItems = chosenItems.$all().length - 1;
                break;
        }
        return legendItems.map((item: any) => {
            return _.merge({}, item, {
                color: colors.shift(),
                onClick: (isHidden) => {
                    const series: any = _.find(this.chartConfig.series, { name: item.name });
                    if (isHidden) {
                        numberOfVisibleItems--;
                        series.visible = false;
                    } else {
                        numberOfVisibleItems++;
                        series.visible = true;
                    }
                    this.chartConfig = _.merge({}, this.chartConfig, {
                        options: {
                            plotOptions: {
                                column: {
                                    groupPadding: this.barGraph.getGroupPadding(
                                        numberOfVisibleItems,
                                    ),
                                },
                            },
                        },
                    });
                },
            });
        });
    }

    public getExporter(): any {
        return DemographicsBarChartExporter;
    }

    static getAllConfigs(params): any {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "AppDemographics";
        const widgetConfig = BarChartDemographicsWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = BarChartDemographicsWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, isCompare): any {
        return isCompare
            ? {
                  type: "BarChartDemographics",
                  properties: {
                      ...params,
                      family: "Mobile",
                      metric: "AppDemographicsAge",
                      apiController,
                      apiParams: {
                          metric: "AppDemographicsAge",
                      },
                      type: "BarChartDemographics",
                      width: "12",
                      height: "244px",
                      loadingHeight: "296px",
                      title: "appdemographics.bar.title",
                      tooltip: "appdemographics.bar.title.tooltip",
                      excelMetric: "AppDemographicsAge",
                      options: {
                          legendAlign: "left",
                          showTopLine: false,
                          showFrame: true,
                          showLegend: true,
                          showSubtitle: false,
                          showSettings: false,
                          showTitle: true,
                          showTitleTooltip: true,
                          titleType: "text",
                          desktopOnly: true,
                          forceSetupColors: true,
                          widgetColorsFrom: "audienceOverview",
                          hideCategoriesIcons: true,
                          cssClass: "age-bar",
                          barWidth: 20,
                          barShowLegend: false,
                          useNewLegends: true,
                      },
                      trackName: "Bar Chart/Demographics Age Distribution",
                  },
                  utilityGroups: [
                      {
                          properties: {
                              className: "titleRow demographics-png",
                          },
                          utilities: [
                              {
                                  id: "ellipsis",
                                  properties: {
                                      items: [{ id: "png" }],
                                      wkhtmltoimage: true,
                                  },
                              },
                          ],
                      },
                  ],
              }
            : {
                  type: "BarChartDemographics",
                  properties: {
                      ...params,
                      family: "Mobile",
                      metric: "AppDemographicsAge",
                      apiController,
                      apiParams: {
                          metric: "AppDemographicsAge",
                      },
                      type: "BarChartDemographics",
                      width: "8",
                      height: "244px",
                      loadingHeight: "244px",
                      title: "appdemographics.bar.title",
                      tooltip: "appdemographics.bar.title.tooltip",
                      excelMetric: "AppDemographicsAge",
                      options: {
                          legendAlign: "left",
                          showTopLine: false,
                          showFrame: true,
                          showLegend: false,
                          showSubtitle: false,
                          showSettings: false,
                          showTitle: true,
                          showTitleTooltip: true,
                          titleType: "text",
                          desktopOnly: true,
                          forceSetupColors: true,
                          widgetColorsFrom: "audienceOverview",
                          hideCategoriesIcons: true,
                          cssClass: "age-bar",
                          barWidth: 80,
                          barShowLegend: true,
                      },
                      trackName: "Bar Chart/Demographics Age Distribution",
                  },
                  utilityGroups: [
                      {
                          properties: {
                              className: "titleRow demographics-png",
                          },
                          utilities: [
                              {
                                  id: "ellipsis",
                                  properties: {
                                      items: [{ id: "png", disabled: false }],
                                      wkhtmltoimage: true,
                                  },
                              },
                          ],
                      },
                  ],
              };
    }

    static getMetricConfig(apiController): any {
        return {
            id: "AppDemographicsAge",
            properties: {
                metric: "AppDemographicsAge",
                title: "metric.demographics.title",
                family: "Mobile",
                component: "AppAudienceDemographics",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps-demographics",
                apiController,
            },
            single: {
                properties: {},
                objects: {},
            },
            compare: {
                properties: {},
                objects: {},
            },
        };
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "BarChartDemographics";
        widgetModel.webSource = this._params.webSource;
        return widgetModel;
    }
}
BarChartDemographicsWidget.register();
