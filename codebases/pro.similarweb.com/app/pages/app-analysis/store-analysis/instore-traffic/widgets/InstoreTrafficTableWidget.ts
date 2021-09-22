import { TableWidget } from "components/widget/widget-types/TableWidget";

export class InstoreTrafficTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "InstoreTrafficTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "StorePage";
        const widgetConfig = InstoreTrafficTableWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = InstoreTrafficTableWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, isCompare) {
        return {
            type: "InstoreTrafficTable",
            properties: {
                ...params,
                family: "Mobile",
                metric: "InStoreReferringApps",
                apiController,
                type: "InstoreTrafficTable",
                height: "auto",
                width: "12",
                apiParams: {
                    pageSize: 100,
                    metric: "InStoreReferringApps",
                },
                title: "utils.apps.trafficSources.referringApps",
                tooltip: "utils.apps.trafficSources.referringApps.tooltip",
                subtitle: "appanalysis.instore.keywords.table.subtitle",
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showLegend: isCompare ? true : false,
                    legendContainerClass: isCompare ? "instore-keywords-table-legend" : "",
                    useBulletLegends: true,
                },
            },
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomLeft",
                    },
                    utilities: [
                        {
                            id: "table-search",
                            properties: {
                                column: "Title",
                            },
                        },
                    ],
                },
                {
                    properties: {
                        className: "tableBottomRight",
                    },
                    utilities: isCompare
                        ? [
                              {
                                  id: "table-export",
                                  properties: {},
                              },
                              {
                                  id: "columns-toggle",
                                  properties: {},
                              },
                          ]
                        : [
                              {
                                  id: "table-export",
                                  properties: {},
                              },
                          ],
                },
                {
                    properties: {
                        className: "tableBottom",
                    },
                    utilities: [
                        {
                            id: "table-pager",
                            properties: {},
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "InStoreReferringApps",
            properties: {
                metric: "InStoreReferringApps",
                title: "utils.apps.trafficSources.referringApps",
                family: "StoreKeywords",
                component: "StorePage",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps-engagementoverview",
                apiController,
            },
            single: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        title: "",
                        sortable: false,
                        width: 65,
                        headTemp: "DefaultCenteredCellHeader",
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "Title",
                        sortable: false,
                        title: "mobileAppsAnalysis.storePage.instoretraffic.table.app.title",
                        cellTemp: "app-tooltip-cell",
                        tooltip: "mobileAppsAnalysis.storePage.instoretraffic.table.app.tooltip",
                        totalCount: true,
                    },
                ],
            },
            compare: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        title: "",
                        headTemp: "DefaultCenteredCellHeader",
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "Title",
                        sortable: false,
                        title: "mobileAppsAnalysis.storePage.instoretraffic.table.app.title",
                        cellTemp: "app-tooltip-cell",
                        tooltip: "mobileAppsAnalysis.storePage.instoretraffic.table.app.tooltip",
                        totalCount: true,
                    },
                    {
                        name: "ShareSplit",
                        title: "appanalysis.instore.table.compare.share.title",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "GroupTrafficShareApps",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "appanalysis.instore.table.compare.share.title.tooltip",
                        minWidth: 180,
                    },
                ],
            },
        };
    }
}
