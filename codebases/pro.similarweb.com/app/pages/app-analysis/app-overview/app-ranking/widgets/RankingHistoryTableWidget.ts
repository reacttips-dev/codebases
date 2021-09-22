/**
 * Created by Daniel.Danieli on 8/6/2017.
 */
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCellHeaderRightAlign } from "../../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { DefaultCellRightAlign } from "../../../../../components/React/Table/cells/DefaultCellRightAlign";
import { Change } from "../../../../../components/React/Table/cells/Change";

export class RankingHistoryTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "RankingHistoryTable";
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
        const apiController = "AppRanks";
        const widgetConfig = RankingHistoryTableWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = RankingHistoryTableWidget.getMetricConfig(apiController);
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
            type: "RankingHistoryTable",
            properties: {
                ...params,
                apiParams: {
                    metric: "AppRanksHistory",
                    appmode: params.appmode,
                    from: params.to, // hardcoded for last day of scraping
                    to: params.to, // hardcoded for last day of scraping
                },
                type: "RankingHistoryTable",
                family: "Mobile",
                apiController,
                width: "12",
                options: {
                    cssClass: "widgetTable",
                    forceSetupColors: isCompare,
                    widgetColorsFrom: isCompare ? "compareMainColors" : null,
                    reactRootShallowWatch: true,
                    overrideColumns: false,
                    showIndex: true,
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 5,
                    onSort: params.onSort,
                },
            },
            processResponse: params.processResponse,
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "AppRanksHistory",
            properties: {
                title: "metric.appRanks.title",
                family: "Mobile",
                metric: "AppRanksHistory",
                apiController,
                component: "AppRanks",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps-ranking",
                timeGranularity: "Daily",
            },
            single: {
                properties: {},
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "True",
                        sortDirection: "asc",
                        groupable: "True",
                        cellTemp: "site-color-and-field",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: 220,
                    },
                    {
                        name: "StoreRank",
                        title: "Store Rank",
                        type: "int?",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                        inverted: true,
                    },
                    {
                        name: "StoreChange",
                        title: "Change",
                        type: "int?",
                        format: "appRankChange",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "change",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                    },
                    {
                        name: "UsageRank",
                        title: "Usage Rank",
                        type: "int?",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                        inverted: true,
                    },
                    {
                        name: "UsageChange",
                        title: "Change",
                        type: "int?",
                        format: "appRankChange",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "change",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                    },
                ],
                filters: {},
            },
            compare: {
                properties: {
                    options: {
                        showLegend: false,
                    },
                },
                columns: [
                    {
                        fixed: true,
                        cellTemp: "index",
                        sortable: false,
                        width: 65,
                        disableHeaderCellHover: true,
                    },
                    {
                        name: "App",
                        fixed: true,
                        title: "Mobile App",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "site-color-image",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: 160,
                    },
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "None",
                        sortable: "True",
                        isSorted: "True",
                        sortDirection: "asc",
                        groupable: "True",
                        cellTemp: "site-color-and-field",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                    },
                    {
                        name: "StoreRank",
                        title: "Store Rank",
                        type: "int?",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                        inverted: true,
                    },
                    {
                        name: "StoreChange",
                        title: "Change",
                        type: "int?",
                        format: "appRankChange",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellComponent: Change,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                    },
                    {
                        name: "UsageRank",
                        title: "Usage Rank",
                        type: "int?",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: DefaultCellRightAlign,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                        inverted: true,
                    },
                    {
                        name: "UsageChange",
                        title: "Change",
                        type: "int?",
                        format: "appRankChange",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "asc",
                        groupable: "False",
                        cellComponent: Change,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: 120,
                    },
                ],
                filters: {},
            },
        };
    }
}
