/**
 * Created by saharr on 06-Jun-17.
 */

import { TableWidget } from "components/widget/widget-types/TableWidget";
import { categoryLinkFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { DefaultCellHeaderRightAlign } from "../../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

export class ExternalTrafficTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "ExternalTrafficTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    protected rowReducer(row: any): any {
        const requestParams = this._params;
        const state = "websites-worldwideOverview";
        const stateParams = {
            isWWW: "*", //for now - until fix for subdomains-domains
            duration: DurationService.getDiffSymbol(
                requestParams.from,
                requestParams.to,
                requestParams.isWindow ? "days" : "months",
            ),
            country: requestParams.country,
            key: row.Domain,
        };
        const categorySplitted = row.Category ? row.Category.split("/") : [],
            mainCategory = categorySplitted[0],
            subCategory = categorySplitted[1];
        return {
            ...row,
            url: this._swNavigator.href(state, stateParams, {}),
            href: row.Category
                ? categoryLinkFilter(this._swNavigator)(
                      subCategory || mainCategory,
                      subCategory ? mainCategory : null,
                  )
                : "javascript:void(0);",
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "StorePage";
        const widgetConfig = ExternalTrafficTableWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = ExternalTrafficTableWidget.getMetricConfig(apiController);
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
            type: "ExternalTrafficTable",
            properties: {
                ...params,
                family: "Mobile",
                metric: "StorePageExternalTraffic",
                apiController,
                type: "ExternalTrafficTable",
                height: "auto",
                width: "12",
                tooltip: "appanalysis.external.traffic.table.title.tooltip",
                excelMetric: "StorePageExternalTraffic",
                apiParams: {
                    pageSize: 100,
                    metric: "StorePageExternalTraffic",
                },
                title: "appanalysis.external.traffic.table.title",
                subtitle: "appanalysis.instore.keywords.table.subtitle",
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: isCompare ? true : false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
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
                                column: "Domain",
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
            id: "StorePageExternalTraffic",
            properties: {
                metric: "StorePageExternalTraffic",
                title: "appanalysis.external.traffic.table.title",
                family: "Mobile",
                component: "StorePage",
                order: "1",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "websites-worldwideOverview",
                apiController,
            },
            single: {
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
                        fixed: true,
                        name: "Domain",
                        title: "appanalysis.external.traffic.table.domain.title",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        cellCls: "swTable-content",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.external.traffic.table.domain.title.tooltip",
                        width: 200,
                    },
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "category-cell",
                        headTemp: "",
                        tooltip: false,
                        minWidth: 230,
                        ppt: {
                            overrideFormat: "Category",
                        },
                    },
                    {
                        name: "Rank",
                        title: "appanalysis.external.traffic.table.globalrank.title",
                        type: "long",
                        format: "swRank",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "rank-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        tooltip: "appanalysis.external.traffic.table.globalrank.title.tooltip",
                        inverted: true,
                        width: 85,
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
                        fixed: true,
                        name: "Domain",
                        title: "appanalysis.external.traffic.table.domain.title",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "website-tooltip-top-cell",
                        cellCls: "swTable-content",
                        headTemp: "",
                        totalCount: "True",
                        tooltip: "appanalysis.external.traffic.table.domain.title.tooltip",
                        width: 280,
                    },
                    {
                        name: "ShareSplit",
                        title: "appanalysis.instore.table.compare.share.title",
                        type: "double[]",
                        format: "percentagesign",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "GroupTrafficShareApps",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "appanalysis.search.engine.table.compare.share.title.tooltip",
                        minWidth: 180,
                    },
                    {
                        name: "Category",
                        title: "Category",
                        type: "string",
                        format: "None",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "category-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: false,
                        minWidth: 230,
                        ppt: {
                            overrideFormat: "Category",
                        },
                    },
                    {
                        name: "Rank",
                        title: "appanalysis.external.traffic.table.globalrank.title",
                        type: "long",
                        format: "swRank",
                        sortable: false,
                        isSorted: false,
                        sortDirection: "asc",
                        groupable: "False",
                        cellTemp: "rank-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        tooltip: "appanalysis.external.traffic.table.globalrank.title.tooltip",
                        inverted: true,
                        width: 85,
                    },
                ],
            },
        };
    }
}
