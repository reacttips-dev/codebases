import { CategoryShareGraphBaseWidget } from "components/widget/widget-types/CategoryShareGraphBaseWidget";
import * as _ from "lodash";
import DurationService from "services/DurationService";
import UIComponentStateService from "services/UIComponentStateService";

export class IndustryAnalysisCategoryShareGraphWidget extends CategoryShareGraphBaseWidget {
    public static getWidgetMetadataType() {
        return "Graph";
    }

    public static getWidgetResourceType() {
        return "SwitchGraph";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = IndustryAnalysisCategoryShareGraphWidget.getWidgetConfig(params);
        const metricConfig = IndustryAnalysisCategoryShareGraphWidget.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisCategoryShareGraphWidget.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;

        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return {
            type: "CategoryShareGraph",
            properties: {
                ...params,
                type: "CategoryShareGraph",
                apiController: "CategoryShare",
                width: "12",
                height: "462px",
                title: "industry.trafficsources.piechart.title",
                family: "Industry",
                excelMetric: "EngagementOverview",
                options: {
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: true,
                    legendAlign: "left",
                    legendTop: -20,
                    hideMarkersOnDaily: true,
                    showSettings: false,
                    showFrame: true,
                    showTopLine: false,
                    useNewLegends: true,
                },
                tableKey: "category_share_table",
                trackName: "Over Time Graph/Category Share",
                cachedParams: ["timeGranularity", "metric"],
                apiParams: {
                    metric: "CategoryShare",
                },
            },
            utilityGroups: [
                {
                    properties: {
                        className: "titleRow category-share-graph-utilities",
                    },
                    utilities: [
                        {
                            id: "widget-toggle",
                            type: "number-percent",
                            properties: {
                                trackingCategory: "Measure Button",
                                defaultItem: "percent",
                                items: [
                                    { title: "%", value: "percent" },
                                    { title: "#", value: "number" },
                                ],
                                class: "chart-toggle-utility",
                            },
                        },
                        {
                            id: "time-granularity",
                            properties: {},
                        },
                        {
                            id: "chart-export",
                            properties: {
                                hideExcel: true,
                                wkhtmltoimage: true,
                            },
                        },
                    ],
                },
            ],
        };
    }

    public static getMetricConfig() {
        return metricConfig;
    }

    public static getMetricTypeConfig() {
        return metricConfig;
    }

    public canAddToDashboard() {
        return true;
    }

    public getWidgetModel() {
        return Object.assign(super.getWidgetModel(), {
            metric: "TopCategoryShare",
            type: "CategoryShareGraphDashboard",
        });
    }

    public getHighChartsConfig(chartOptions, formattedData) {
        return _.merge(super.getHighChartsConfig(chartOptions, formattedData), {
            options: {
                plotOptions: {
                    series: {
                        connectNulls: false,
                    },
                },
            },
        });
    }

    public initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        this.chartMode =
            UIComponentStateService.getItem(this.getUIStateKey(), this.storageType) || "percent";
        const toggleUtility: any =
            this.utilityGroups.length > 0
                ? _.find(this.utilityGroups[0].utilities, { id: "widget-toggle" })
                : false;
        if (toggleUtility) {
            toggleUtility.properties.defaultItem = this.chartMode;
        }

        this.tableKey = `${context}_${config.widgetConfig.properties.tableKey}`;
        this.unsubscribe = this._$swNgRedux.connect((state) => {
            return {
                value: state.tableSelection[this.tableKey],
            };
        })((tableSelection) => {
            this.onSelectionChange(tableSelection.value);
        });

        this.legendClass = "category-share-legend";
        // in 1 month interval with monthly granularity hide 'others'
        this.isOneMonth =
            !this._params.isWindow &&
            DurationService.diffByUnit(this._params.from, this._params.to, "months") === 0;
    }
    public getLegendItems(includeOthers) {
        const legends = super.getLegendItems(includeOthers);
        if (this.originalData && Object.keys(this.originalData).length < 11) {
            _.remove(legends, (item: any) => item.id === "others");
            this.hideOthersSerie();
        }
        return legends;
    }
    public changeToPercentage() {
        super.changeToPercentage();
        if (this.originalData && Object.keys(this.originalData).length < 11) {
            _.remove(this.legendItems, (item: any) => item.id === "others");
            this.hideOthersSerie();
        }
    }
    get templateUrl() {
        return `/app/components/widget/widget-templates/category-share.html`;
    }
}

const metricConfig = {
    properties: {
        options: {
            dashboardSubtitleMarginBottom: 15,
            showTitle: false,
            showSubtitle: false,
            showLegend: true,
            legendAlign: "left",
            legendTop: -20,
            hideMarkersOnDaily: true,
            showSettings: false,
            showFrame: true,
            showTopLine: false,
        },
    },
    x_axis: {
        title: "Date",
        type: "date",
        format: "None",
        name: "Date",
        reversed: "False",
    },
    y_axis: {
        title: "Visits",
        type: "long",
        format: "number",
        formatParameter: 0,
        name: "Visits",
        reversed: "False",
    },
    filters: {
        timeGranularity: [
            {
                value: "Monthly",
                title: "Monthly",
            },
        ],
    },
};
