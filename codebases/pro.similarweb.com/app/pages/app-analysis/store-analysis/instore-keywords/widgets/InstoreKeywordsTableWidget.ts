import { TableWidget } from "components/widget/widget-types/TableWidget";

export class InstoreKeywordsTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "InstoreKeywordsTable";
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
        const widgetConfig = InstoreKeywordsTableWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = InstoreKeywordsTableWidget.getMetricConfig(apiController);
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
            type: "InstoreKeywordsTable",
            properties: {
                ...params,
                family: "StoreKeywords",
                metric: "InStoreKeywordsAnalysis",
                apiController,
                type: "InstoreKeywordsTable",
                height: "auto",
                width: "12",
                apiParams: {
                    pageSize: 100,
                    metric: "InStoreKeywordsAnalysis",
                },
                title: "appanalysis.search.engine.table.title",
                subtitle: "appanalysis.instore.keywords.table.subtitle",
                enableRowSelection: true,
                tableSelectionProperty: "SearchTerm",
                maxSelection: isCompare ? 1 : 5,
                minSelection: isCompare ? 0 : 1,
                initialSelectedRowsCount: isCompare ? 1 : 3,
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: isCompare ? true : false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    tableSelectionTrackingParam: "SearchTerm",
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
                    utilities: [
                        {
                            id: "table-export",
                            properties: {},
                        },
                        {
                            id: "columns-toggle",
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
            id: "InStoreKeywordsAnalysis",
            properties: {
                metric: "InStoreKeywordsAnalysis",
                title: "appanalysis.search.engine.table.title",
                family: "StoreKeywords",
                component: "StorePage",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "keywords-analysis",
                apiController,
            },
            single: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        name: "row-selection",
                        cellTemp: "row-selection",
                        sortable: false,
                        width: 50,
                        disableHeaderCellHover: true,
                    },
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        title: "",
                        headTemp: "DefaultCenteredCellHeader",
                        tooltip: "appanalysis.instore.table.checkbox.tooltip",
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
                        cellTemp: "instore-keyword-cell",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.instore.table.keyword.title.tooltip",
                        width: 400,
                    },
                    {
                        name: "PositionFirstApp",
                        title: "appanalysis.instore.table.position.title",
                        type: "string",
                        format: "",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip: "",
                        minWidth: 142,
                    },
                    {
                        name: "TrafficRank",
                        title: "apps.storeanalysis.instore.keywords.table.sourcestrength.title",
                        type: "string",
                        format: "sourceStrength",
                        sortable: true,
                        isSorted: true,
                        sortDirection: "asc",
                        inverted: true,
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip:
                            "apps.storeanalysis.instore.keywords.table.sourcestrength.title.tooltip",
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
            compare: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        name: "row-selection",
                        cellTemp: "row-selection",
                        sortable: false,
                        width: 50,
                        disableHeaderCellHover: true,
                    },
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
                        cellTemp: "instore-keyword-cell",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.instore.table.keyword.title.tooltip",
                        width: 260,
                    },
                    {
                        name: "Positions",
                        title: "appanalysis.instore.table.position.title",
                        type: "string",
                        format: "",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "group-app-positions",
                        headTemp: "",
                        tooltip: "",
                        width: 176,
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
                        tooltip: "appanalysis.instore.table.compare.share.title.tooltip",
                        minWidth: 180,
                    },
                    {
                        name: "TrafficRank",
                        title: "apps.storeanalysis.instore.keywords.table.sourcestrength.title",
                        type: "string",
                        format: "sourceStrength",
                        sortable: true,
                        isSorted: true,
                        sortDirection: "asc",
                        inverted: true,
                        groupable: "False",
                        cellTemp: "default-cell",
                        headTemp: "",
                        tooltip:
                            "apps.storeanalysis.instore.keywords.table.sourcestrength.title.tooltip",
                        width: 90,
                    },
                ],
                filters: {},
            },
        };
    }
}
