/**
 * Created by olegg on 22-Aug-16.
 */
import * as _ from "lodash";
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCellHeaderRightAlign } from "../../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { RankCell } from "../../../../../components/React/Table/cells";
import { DefaultCellRightAlign } from "../../../../../components/React/Table/cells/DefaultCellRightAlign";
import { chosenItems } from "common/services/chosenItems";
export class TableAppRanksWidget extends TableWidget {
    static $inject = [];

    static getWidgetMetadataType() {
        return "TableAppRanks";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    public selectedCategory = "";

    constructor() {
        super();
    }

    getColumnsConfig() {
        if (_.isEmpty(this.originalData)) {
            return [];
        }
        let dynamicColumns,
            staticColumns = [
                {
                    fixed: true,
                    cellTemp: "index",
                    sortable: false,
                    width: 65,
                    disableHeaderCellHover: true,
                },
                {
                    fixed: true,
                    name: "Country",
                    title: "Country",
                    type: "string",
                    format: "None",
                    sortable: "True",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "country-cell",
                    totalCount: "False",
                    tooltip: "",
                    width: 300,
                    ppt: {
                        // override the table column format when rendered in ppt
                        overrideFormat: "Country",
                    },
                },
            ].slice();

        if (!this.isCompare()) {
            dynamicColumns = this.buildTableColumns(this.originalData);
        } else {
            dynamicColumns = this.buildTableColumnsCompare(this.originalData);
        }
        return [...staticColumns, ...dynamicColumns];
    }

    private buildTableColumnsCompare(data = []) {
        return _.flattenDeep(
            _.map(data, (dataItem) => {
                let app = _.find(chosenItems.$all(), (app: any) => app.Id === dataItem.App),
                    retVal = [];
                if (app) {
                    retVal = [
                        {
                            name: app.Id,
                            title: app.Title,
                            type: "int?",
                            format: "swRank",
                            sortable: "True",
                            isSorted: "False",
                            sortDirection: "asc",
                            groupable: "False",
                            cellComponent: DefaultCellRightAlign,
                            headTemp: "site-name-image",
                            totalCount: "False",
                            tooltip: "",
                            minWidth: 120,
                            headerCellClass: "domain-name",
                            inverted: true,
                        },
                        {
                            name: app.Id + "Change",
                            title: "Change",
                            type: "int?",
                            format: "None",
                            sortable: "True",
                            isSorted: "False",
                            sortDirection: "desc",
                            groupable: "False",
                            cellTemp: "change",
                            headerComponent: DefaultCellHeaderRightAlign,
                            totalCount: "False",
                            tooltip: "",
                            minWidth: 120,
                        },
                    ];
                }
                return retVal;
            }),
        );
    }

    private buildTableColumns([{ Countries = [] }]) {
        var that = this;
        let categoryList = _.uniq(
            _.flattenDeep(
                _.map(Countries, (country) =>
                    country.Categories.map((categoryObject) => categoryObject.Category),
                ),
            ),
        );
        let dynamicColumns = categoryList.reduce((dynamicColumnList: any[], category) => {
            let isInitialSortedColumn = chosenItems.$first().Category === category;
            return [
                ...dynamicColumnList,
                {
                    name: category,
                    title: category,
                    type: "int?",
                    format: "swRank",
                    sortable: "True",
                    isSorted: isInitialSortedColumn ? "True" : "False",
                    sortDirection: isInitialSortedColumn ? "asc" : "desc",
                    groupable: "False",
                    cellComponent: DefaultCellRightAlign,
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: "False",
                    tooltip: "",
                    minWidth: 120,
                },
                {
                    name: category + "Change",
                    title: "Change",
                    type: "int?",
                    format: "None",
                    sortable: "True",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "change",
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: "False",
                    tooltip: "",
                    minWidth: 120,
                    inverted: true,
                },
            ];
        }, []);
        return dynamicColumns;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    get excelUrl() {
        let widgetProp = this._widgetConfig.properties;
        let newParams: any = _.merge({ category: this.selectedCategory }, this._params);
        if (widgetProp.excelMetric) {
            newParams.metric = widgetProp.excelMetric;
        }
        // SIM-27628 delete all params with undefined value
        for (const prop in newParams) {
            if (newParams[prop] === undefined || newParams[prop] === "") {
                delete newParams[prop];
            }
        }
        return (
            super._getExcelEndPoint() +
            _.trimEnd(
                _.reduce(
                    newParams,
                    (paramString, paramVal, paramKey) => `${paramString}${paramKey}=${paramVal}&`,
                    "",
                ),
                "&",
            )
        );
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "AppRanks";
        const widgetConfig = TableAppRanksWidget.getWidgetConfig(params, apiController, isCompare);
        const metricConfig = TableAppRanksWidget.getMetricConfig(apiController);
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
            type: "TableAppRanks",
            properties: {
                ...params,
                metric: "AppRanksCountries",
                apiParams: {
                    metric: "AppRanksCountries",
                },
                width: "12",
                apiController,
                type: "TableAppRanks",
                family: "Mobile",
                displayTableOnEmptyData: false,
                options: {
                    cssClass: "widgetTable",
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
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomRight",
                    },
                    utilities: [
                        {
                            id: "table-export",
                            properties: {},
                        },
                    ],
                },
            ],
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "AppRanksCountries",
            properties: {
                metric: "AppRanksCountries",
                title: "metric.appRanks.title",
                family: "Mobile",
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
                        name: "App",
                        title: "Mobile App",
                        type: "string",
                        format: "None",
                        sortable: "False",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "True",
                        cellTemp: "app-tooltip-cell",
                        headTemp: "",
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                        ppt: {
                            overrideFormat: "App",
                        },
                    },
                    {
                        name: "Rank",
                        title: "Rank",
                        type: "long",
                        format: "swRank",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellComponent: RankCell,
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                    {
                        name: "Change",
                        title: "Change",
                        type: "double",
                        format: "percentagesign",
                        sortable: "True",
                        isSorted: "False",
                        sortDirection: "desc",
                        groupable: "False",
                        cellTemp: "default-cell",
                        headerComponent: DefaultCellHeaderRightAlign,
                        totalCount: "False",
                        tooltip: "",
                        width: "",
                    },
                ],
                filters: {},
            },
            compare: {},
        };
    }
}
