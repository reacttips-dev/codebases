import { TableWidget } from "components/widget/widget-types/TableWidget";
import { IWidgetModel } from "components/widget/widget-types/Widget";
import * as _ from "lodash";

export class RetentionTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "RetentionTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    constructor() {
        super();
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.setExcelUrl(this["_apiController"], this._params);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    public canAddToDashboard() {
        return false;
    }

    private setExcelUrl(apiController, params) {
        // basically same behaviour only the metric has been switched.
        let newParams = { ...params };
        delete newParams.metric;
        const urlParams = _.trimEnd(
            _.reduce(
                newParams,
                (paramString, paramVal: any, paramKey) =>
                    `${paramString}${paramKey}=${encodeURIComponent(paramVal)}&`,
                "",
            ),
            "&",
        );
        const metric = this._widgetConfig.properties.excelMetric;

        this["chartConfig"] = {
            ...this["chartConfig"],
            export: {
                csvUrl: `/widgetApi/${apiController}/${metric}/Excel?${urlParams}`,
            },
        };
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const isCompare = mode === "compare";
        const apiController =
            params.store !== "Google" ? "AppEngagementOverviewIos" : "AppEngagementOverviewAndroid";
        const metric = "AppRetention";
        let tooltip = "";
        if (params.isDay0FirstUsage) {
            tooltip = isCompare
                ? "appanalysis.engagement.retention.table.compare.title.tooltip2"
                : "appanalysis.engagement.retention.table.single.title.tooltip2";
        } else {
            tooltip = isCompare
                ? "appanalysis.engagement.retention.table.compare.title.tooltip"
                : "appanalysis.engagement.retention.table.single.title.tooltip";
        }
        const widgetConfig = RetentionTableWidget.getWidgetConfig(
            params,
            apiController,
            metric,
            isCompare,
            tooltip,
        );

        const metricConfig = RetentionTableWidget.getMetricConfig(apiController, metric);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController, metric, isCompare, tooltip) {
        const subName = params.isDay0FirstUsage ? "Usage" : "Install";
        return {
            type: "RetentionTable",
            properties: {
                ...params,
                family: "Mobile",
                metric,
                apiController,
                excelMetric: params.isDay0FirstUsage
                    ? "AppRetentionPerMonthUsage"
                    : "AppRetentionPerMonth",
                type: "RetentionTable",
                trackName: "Retention Cohort Analysis",
                height: "auto",
                width: "12",
                apiParams: {
                    pageSize: 100,
                    metric,
                },
                title: "appanalysis.engagement.retention.table.title",
                tooltip,
                options: {
                    cssClass: "widgetTable",
                    customTableClass: isCompare ? "cohort-table compare" : "cohort-table single",
                    showTitle: true,
                    titleType: "text",
                    showTitleTooltip: true,
                    showSubtitle: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    overrideColumns: true,
                },
                columns: isCompare
                    ? [
                          {
                              fixed: true,
                              name: "Title",
                              sortable: false,
                              title: "",
                              cellTemp: "new-app-tooltip-cell",
                              width: 210,
                              disableHeaderCellHover: true,
                          },
                          {
                              name: "Day0",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day0.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 112,
                              maxWidth: 230,
                          },
                          {
                              name: "Day1",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day1.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 112,
                              maxWidth: 230,
                          },
                          {
                              name: "Day7",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day7.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 112,
                              maxWidth: 230,
                          },
                          {
                              name: "Day14",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day14.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 112,
                              maxWidth: 230,
                          },
                          {
                              name: "Day30",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day30.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 112,
                              maxWidth: 230,
                          },
                      ]
                    : [
                          {
                              fixed: true,
                              name: "Date",
                              cellTemp: "cohort-date-cell",
                              sortable: false,
                              width: 104,
                              title: "",
                              headTemp: "DefaultCenteredCellHeader",
                              disableHeaderCellHover: true,
                          },
                          {
                              name: "Day0",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day0.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day1",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day1.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day2",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day2.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day3",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day3.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day4",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day4.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day5",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day5.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day6",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day6.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day7",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day7.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day14",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day14.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day21",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day21.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                          {
                              name: "Day30",
                              subName,
                              title: "mobileApps.storePage.retentionTable.columns.day30.title",
                              sortable: false,
                              isSorted: false,
                              cellTemp: "cohort-cell",
                              headTemp: "DefaultCenteredCellHeader",
                              minWidth: 56,
                          },
                      ],
            },
            utilityGroups: [
                {
                    properties: {
                        className: "tableBottomRight",
                    },
                    utilities: [
                        {
                            id: "columns-toggle",
                            properties: {},
                        },
                        {
                            id: "ellipsis",
                            properties: {
                                items: [
                                    { id: "excel" },
                                    { id: "dashboard", disabled: params.isDay0FirstUsage },
                                ],
                            },
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

    static getMetricConfig(apiController, metric) {
        const subName = "Install";
        return {
            id: metric,
            properties: {
                metric,
                title: "apps.engagementretention.pageTitle",
                family: "Mobile",
                component: "AppEngagementOverview",
                order: "1",
                width: "4",
                dynamicSettings: "true",
                disableDatepicker: true,
                state: "apps-engagementretention",
                dashboard: "true",
                apiController,
            },
            single: {
                properties: {
                    options: {
                        customTableClass: "cohort-table single",
                        showLegend: false,
                        hideBorders: true,
                    },
                },
                columns: [
                    {
                        fixed: true,
                        name: "Date",
                        cellTemp: "cohort-date-cell",
                        sortable: false,
                        width: 104,
                        title: "",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day0",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day0.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-single-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day1",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day1.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-single-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day7",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day7.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-single-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day14",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day14.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-single-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day30",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day30.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                ],
            },
            compare: {
                properties: {
                    options: {
                        customTableClass: "cohort-table compare",
                        showLegend: false,
                        hideBorders: true,
                    },
                },
                columns: [
                    {
                        fixed: true,
                        name: "Title",
                        sortable: false,
                        title: "",
                        cellTemp: "new-app-tooltip-cell",
                        width: 210,
                    },
                    {
                        name: "Day0",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day0.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day1",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day1.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day7",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day7.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day14",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day14.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                    {
                        name: "Day30",
                        subName,
                        title: "mobileApps.storePage.retentionTable.columns.day30.title",
                        sortable: false,
                        isSorted: false,
                        cellTemp: "cohort-cell",
                        headTemp: "DefaultCenteredCellHeader",
                    },
                ],
            },
        };
    }
}

RetentionTableWidget.register(); // TODO: remove after refactor of dashboard to support widgets by "import" (not window)
