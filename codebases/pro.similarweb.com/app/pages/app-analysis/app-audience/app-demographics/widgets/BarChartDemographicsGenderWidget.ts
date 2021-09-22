/**
 * Created by olegg on 08-Nov-16.
 */

import { BarChartDemographicsWidget } from "./BarChartDemographicsWidget";

export class BarChartDemographicsGenderWidget extends BarChartDemographicsWidget {
    static getWidgetMetadataType() {
        return "BarChartDemographicsGender";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    static getWidgetDashboardType() {
        return "BarChart";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/barchartdemographics.html`;
    }

    static getAllConfigs(params): any {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "AppDemographics";
        const widgetConfig = BarChartDemographicsGenderWidget.getWidgetConfig(
            params,
            apiController,
        );
        const metricConfig = BarChartDemographicsGenderWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController): any {
        return {
            type: "BarChartDemographicsGender",
            properties: {
                ...params,
                family: "Mobile",
                metric: "AppDemographicsGender",
                apiController,
                apiParams: {
                    metric: "AppDemographicsGender",
                },
                type: "BarChartDemographicsGender",
                width: "12",
                height: "244px",
                loadingHeight: "296px",
                title: "appdemographics.piechart.title",
                tooltip: "appdemographics.piechart.title.tooltip",
                excelMetric: "AppDemographicsGender",
                trackName: "Bar Chart/Demographics Gender Distribution",
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
                    hideCategoriesIcons: false,
                    categoryColors: "maleFemaleColors",
                    categoryIcons: "maleFemaleIcons",
                    cssClass: "age-bar",
                    barWidth: 50,
                    barShowLegend: true,
                    useNewLegends: true,
                },
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
        };
    }

    static getMetricConfig(apiController): any {
        return {
            id: "AppDemographicsGender",
            properties: {
                metric: "AppDemographicsGender",
                title: "metric.demographics.title",
                family: "Mobile",
                component: "AppAudienceDemographics",
                order: "1",
                dynamicSettings: true,
                disableDatepicker: true,
                state: "apps-demographics",
                apiController,
            },
            single: {
                properties: {
                    hasWebSource: false,
                    height: 120,
                },
                objects: {
                    Male: {
                        name: "Male",
                        title: "Male",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                    Female: {
                        name: "Female",
                        title: "Female",
                        type: "double",
                        format: "None",
                        cellTemp: "",
                    },
                },
            },
            compare: {},
        };
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "BarChartDemographicsGender";
        widgetModel.webSource = this._params.webSource;
        return widgetModel;
    }
}

BarChartDemographicsGenderWidget.register();
