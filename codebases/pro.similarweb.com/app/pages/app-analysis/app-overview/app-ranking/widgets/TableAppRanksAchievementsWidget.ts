/**
 * Created by olegg on 22-Aug-16.
 */
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";

export class TableAppRanksAchievementsWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "TableAppRanksAchievements";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    public getColumnsConfig() {
        if (_.isEmpty(this.originalData)) {
            return [];
        }
        let dynamicColumns,
            staticColumns = [
                {
                    fixed: true,
                    name: "RankAchievement",
                    title: "Rank Achievement",
                    type: "string",
                    format: "None",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "default-cell",
                    headTemp: "header-cell-blank",
                    cellCls: "headerCell-blank-center",
                    totalCount: "False",
                    tooltip: "",
                    width: 270,
                },
            ].slice();
        dynamicColumns = this.buildTableColumns(this.originalData);
        return [...staticColumns, ...dynamicColumns];
    }

    public callbackOnGetData(response: any) {
        this.runProfiling();
        this.data = this.transformResponse(response);
        this.setMetadata();
        this.metadata.options.emptyResults = false;
        if (_.isEmpty(this.data.Records)) {
            this.metadata.options.emptyResults = true;
            return;
        }
        if (response.Filters) {
            this.data.Filters = response.Filters;
        }
    }

    private buildTableColumns(data) {
        let categoryList = Object.keys(data[0]);
        const allIdx = categoryList.indexOf("All");
        if (allIdx !== -1) {
            // put "All" column first
            const allStr = categoryList.splice(allIdx, 1);
            categoryList = allStr.concat(categoryList);
        }

        const dynamicColumns = categoryList.reduce((dynamicColumnList: any[], category) => {
            return [
                ...dynamicColumnList,
                {
                    name: category + "_Best",
                    title: category,
                    type: "int?",
                    format: "swRank",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "default-cell",
                    cellCls: "u-alignCenter",
                    headTemp: "header-cell-blank",
                    totalCount: "False",
                    tooltip: "",
                    minWidth: 130,
                },
            ];
        }, []);
        return dynamicColumns;
    }

    private transformResponse(response: any) {
        const captionColumns = ["1", "10", "100", "500"].slice();
        const records = response.Data.map((rec, index) => {
            const ret = {};
            for (const prop1 of Object.keys(rec)) {
                for (const prop2 of Object.keys(rec[prop1])) {
                    ret[prop1 + "_" + prop2] = rec[prop1][prop2];
                }
            }
            ret["RankAchievement"] = `${i18nFilter()("app.ranking.achievement")} ${
                captionColumns[index]
            }`;
            return ret;
        });
        return { Records: records, TotalCount: response.TotalCount };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    public static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController = "AppRanks";
        const widgetConfig = TableAppRanksAchievementsWidget.getWidgetConfig(
            params,
            apiController,
            isCompare,
        );
        const metricConfig = TableAppRanksAchievementsWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params, apiController, isCompare) {
        return {
            type: "TableAppRanksAchievements",
            properties: {
                ...params,
                apiParams: {
                    metric: "AppRanksAchievements",
                    from: params.apiParams.to, // hardcoded for last day of scraping
                    to: params.apiParams.to, // hardcoded for last day of scraping
                    appmode: params.apiParams.appmode,
                },
                width: "12",
                type: "TableAppRanksAchievements",
                apiController,
                family: "Mobile",
                displayTableOnEmptyData: false,
                options: {
                    overrideColumns: true,
                    showIndex: false,
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 4,
                    tableType: "widgetTable",
                    customTableClass: "swTable-achievements",
                },
            },
        };
    }

    public static getMetricConfig(apiController) {
        return {
            id: "AppRanksAchievements",
            properties: {
                title: "Rank Achievement",
                family: "Mobile",
                metric: "AppRanksAchievements",
                apiController,
                component: "AppRanks",
                order: "1",
                dynamicSettings: "false",
                disableDatepicker: true,
                state: "apps-ranking",
                timeGranularity: "Daily",
            },
            single: {
                properties: {},
                columns: [],
                filters: {},
            },
            compare: {},
        };
    }
}
