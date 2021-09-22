/**
 * Created by olegg on 25-Oct-16.
 */

import { PieChartWidget } from "components/widget/widget-types/PieChartWidget";

export class PieChartGenderWidget extends PieChartWidget {
    static getWidgetResourceType() {
        return "PieChart";
    }

    protected setMetadata() {
        let widgetProp = this._widgetConfig.properties;
        let chartOptions = {
            type: "PieChart",
            height: widgetProp.height,
        };
        this.metadata = { chartOptions };
        this._widgetConfig.chartConfig = {
            plotOptions: {
                pie: {
                    point: {
                        events: {
                            legendItemClick: function (e) {
                                e.preventDefault();
                                return false;
                            },
                        },
                    },
                },
            },
        };
    }

    constructor() {
        super();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/piechart-legend-below.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "AppDemographics";
        const widgetConfig = PieChartGenderWidget.getWidgetConfig(params, apiController);
        const metricConfig = PieChartGenderWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController) {
        return {
            type: "PieChartGender",
            async: "true",
            properties: {
                ...params,
                family: "Mobile",
                metric: "AppDemographicsGender",
                apiController,
                apiParams: {
                    metric: "AppDemographicsGender",
                },
                type: "PieChart",
                width: "4",
                height: "244px",
                loadingHeight: "244px",
                title: "appdemographics.piechart.title",
                tooltip: "appdemographics.piechart.title.tooltip",
                options: {
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    widgetColors: "maleFemaleColors",
                    widgetIcons: "maleFemaleIcons",
                    legendConfig: {
                        verticalAlign: "bottom",
                        layout: "horizontal",
                        align: "center",
                        itemMarginTop: 0,
                        itemMarginBottom: 0,
                        legendMap: [
                            {
                                seriesName: "Male",
                                legendIndex: 0,
                            },
                            {
                                seriesName: "Female",
                                legendIndex: 1,
                            },
                        ],
                    },
                    marginTop: 20,
                    marginBottom: 80,
                    innerSize: "66%",
                    sortBy: "value",
                    sortAsc: true,
                },
                trackName: "Pie Chart/Demographics Gender Distribution",
            },
            utilityGroups: [
                {
                    properties: {
                        className: "titleRow demographics-png pie-ellipsis",
                    },
                    utilities: [
                        {
                            id: "ellipsis",
                            properties: {
                                items: [{ id: "png" }],
                                wkhtmltoimage: true,
                                exportOptions: { pngWidth: "432" },
                            },
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController) {
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
                    hasWebSource: true,
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
}
