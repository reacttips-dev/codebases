import { TableWidget } from "components/widget/widget-types/TableWidget";

export class SearchEngineKeywordsTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "SearchEngineKeywordsTable";
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
        const apiController = "KeywordsStore";
        const widgetConfig = SearchEngineKeywordsTableWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = SearchEngineKeywordsTableWidget.getMetricConfig(apiController);
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
            type: "SearchEngineKeywordsTable",
            properties: {
                ...params,
                family: "Mobile",
                metric: "InStoreSearchEngineKeywordsAnalysis",
                apiController,
                type: "SearchEngineKeywordsTable",
                height: "auto",
                width: "12",
                excelMetric: "InStoreSearchEngineKeywordsAnalysis",
                apiParams: {
                    pageSize: 100,
                    metric: "InStoreSearchEngineKeywordsAnalysis",
                },
                title: "appanalysis.search.engine.table.title",
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
                                column: "SearchTerm",
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
            id: "InStoreSearchEngineKeywordsAnalysis",
            properties: {
                metric: "InStoreSearchEngineKeywordsAnalysis",
                family: "StoreKeywords",
                title: "appanalysis.search.engine.table.title",
                component: "StorePage",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "keyword.analysis",
                apiController,
            },
            single: {
                properties: {},
                columns: [
                    {
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        title: "",
                        headTemp: "DefaultCenteredCellHeader",
                        tooltip: "appanalysis.instore.table.checkbox.tooltip",
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "SearchTerm",
                        title: "apps.storeanalysis.instore.keywords.table.keyword.title",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "search-engine-keyword-cell",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.search.engine.table.keyword.title.tooltip",
                    },
                    {
                        name: "TrafficRank",
                        title: "apps.storeanalysis.instore.keywords.table.sourcestrength.title",
                        type: "string",
                        format: "sourceStrength",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip:
                            "apps.storeanalysis.search.engine.table.sourcestrength.title.tooltip",
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TrafficShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
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
                        tooltip: "appanalysis.instore.table.compare.checkbox.tooltip",
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        name: "SearchTerm",
                        title: "apps.storeanalysis.instore.keywords.table.keyword.title",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "search-engine-keyword-cell",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.search.engine.table.keyword.title.tooltip",
                        width: 280,
                    },
                    {
                        name: "GroupTrafficShare",
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
                        tooltip: "appanalysis.search.engine.table.compare.share.title.tooltip",
                        minWidth: 180,
                    },
                    {
                        name: "TrafficRank",
                        title: "apps.storeanalysis.instore.keywords.table.sourcestrength.title",
                        type: "string",
                        format: "sourceStrength",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip:
                            "apps.storeanalysis.search.engine.table.sourcestrength.title.tooltip",
                        width: 90,
                    },
                ],
                filters: {
                    orderBy: [
                        {
                            value: "TrafficShare desc",
                            title: "Traffic Share",
                        },
                    ],
                },
            },
        };
    }
}
