import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCenteredCellHeader } from "../../../../components/React/Table/headerCells";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

export class AppCategoryLeaderboardTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "AppCategoryLeaderboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    onItemClick(key, value) {
        this._swNavigator.go(this._swNavigator.current(), { [key]: value });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "AppCategoryLeaderboard" + params.store;
        const isAppStore = params.store !== "Google";
        const widgetConfig = AppCategoryLeaderboardTableWidget.getWidgetConfig(
            params,
            apiController,
        );
        const metricConfig = AppCategoryLeaderboardTableWidget.getMetricConfig(
            apiController,
            isAppStore,
        );
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
            type: "AppCategoryLeaderboardTable",
            properties: {
                ...params,
                family: "Mobile",
                metric: "AppCategoryTopApps",
                apiController,
                apiParams: {
                    pages: 100,
                    metric: "AppCategoryTopApps",
                },
                type: "AppCategoryLeaderboardTable",
                height: "auto",
                width: "12",
                title: "topapps.title",
                subtitle: "topapps.lastupdated",
                forcedDuration: "28d",
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    stickyHeader: true,
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

    static getMetricConfig(apiController, isAppStore) {
        return {
            id: "AppCategoryTopApps",
            properties: {
                metric: "AppCategoryTopApps",
                dashboard: "false",
                component: "TopApps",
                title: "topapps.title",
                family: "AppCategoryLeaderBoard",
                order: "1",
                state: "apps-engagementoverview",
                apiController,
            },
            single: {
                properties: {},
                columns: isAppStore
                    ? AppCategoryLeaderboardTableWidget.appleColumns
                    : AppCategoryLeaderboardTableWidget.androidColumns,
                filters: {},
            },
            compare: {},
        };
    }

    static androidColumns = [
        {
            fixed: true,
            cellTemp: "index",
            sortable: false,
            width: 65,
            title: "",
            headerComponent: DefaultCenteredCellHeader,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            name: "Title",
            title: "appstorekeywords.analysis.table.apptitle",
            type: "string",
            format: "None",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "True",
            cellTemp: "app-tooltip-cell",
            headTemp: "",
            totalCount: "True",
            tooltip: "appstorekeywords.analysis.table.apptitle.tooltip",
            width: 260,
            ppt: {
                overrideFormat: "App",
            },
        },
        {
            name: "Publisher",
            title: "appstorekeywords.analysis.table.publisher",
            type: "string",
            format: "",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "default-cell",
            headTemp: "",
            tooltip: "appstorekeywords.analysis.table.publisher.tooltip",
            minWidth: 195,
        },
        {
            name: "Category",
            title: "appstorekeywords.analysis.table.category",
            type: "string",
            format: "",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "category-filter-cell",
            headTemp: "",
            tooltip: "appstorekeywords.analysis.table.category.tooltip",
            minWidth: 170,
        },
        {
            name: "AppIndex",
            title: "topapps.table.columns.usagerank",
            type: "string",
            format: "swRank",
            sortable: true,
            isSorted: true,
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "rank-cell",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.usagerank.tooltip",
            minWidth: 130,
        },
        {
            name: "AppIndexChange",
            title: "topapps.table.columns.usagechange",
            type: "double",
            format: "percentagesign",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "change",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.usagechange.tooltip",
            width: 110,
        },
        {
            name: "StoreRank",
            title: "topapps.table.columns.storerank",
            type: "double",
            format: "swRank",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "rank-cell",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.storerank.tooltip",
            minWidth: 130,
        },
        {
            name: "StoreRankChange",
            title: "topapps.table.columns.storechange",
            type: "double",
            format: "percentagesign",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "change",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.storechange.tooltip",
            width: 130,
        },
    ];

    static appleColumns = [
        {
            fixed: true,
            cellTemp: "index",
            sortable: false,
            width: 65,
            title: "",
            headerComponent: DefaultCenteredCellHeader,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            name: "Title",
            title: "appstorekeywords.analysis.table.apptitle",
            type: "string",
            format: "None",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "True",
            cellTemp: "app-tooltip-cell",
            headTemp: "",
            totalCount: "True",
            tooltip: "appstorekeywords.analysis.table.apptitle.tooltip",
            width: 260,
            ppt: {
                overrideFormat: "App",
            },
        },
        {
            name: "Publisher",
            title: "appstorekeywords.analysis.table.publisher",
            type: "string",
            format: "",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "default-cell",
            headTemp: "",
            tooltip: "appstorekeywords.analysis.table.publisher.tooltip",
            minWidth: 195,
        },
        {
            name: "Category",
            title: "appstorekeywords.analysis.table.category",
            type: "string",
            format: "",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "category-filter-cell",
            headTemp: "",
            tooltip: "appstorekeywords.analysis.table.category.tooltip",
            minWidth: 170,
        },
        {
            name: "StoreRank",
            title: "topapps.table.columns.storerank",
            type: "double",
            format: "swRank",
            sortable: true,
            isSorted: true,
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "rank-cell",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.storerank.tooltip",
            minWidth: 130,
        },
        {
            name: "StoreRankChange",
            title: "topapps.table.columns.storechange",
            type: "double",
            format: "percentagesign",
            sortable: "True",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "change",
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: "topapps.table.columns.storechange.tooltip",
            width: 130,
        },
    ];
}
