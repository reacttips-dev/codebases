import { swSettings } from "common/services/swSettings";
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { Injector } from "common/ioc/Injector";
import { TopSitesTableWidgetFilters } from "components/widget/widget-filters/TopSitesTableWidgetFilters";
import { TopSitesTableDataFetcher } from "components/widget/widget-fetchers/TopSitesTableDataFetcher";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { DefaultCellRightAlign } from "../../../../components/React/Table/cells/DefaultCellRightAlign";
import * as _ from "lodash";
import { IWidgetModel } from "components/widget/widget-types/Widget";

export class TopSitesTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "TopSitesTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    static getAllConfigs(params) {
        const mode = swSettings.allowedCountry(params.country, "IndustryAnalysisGeneral")
            ? "extended"
            : "basic";
        const widgetConfig: any = TopSitesTableWidget.getWidgetConfig(mode, params);
        const metricConfig = TopSitesTableWidget.getMetricConfig(mode);
        const metricTypeConfig = TopSitesTableWidget.getMetricTypeConfig(mode);
        const apiController = widgetConfig.properties.apiController;

        if (params.webSource !== "Total") {
            const uniqueVisitorsColumn: any = _.find(metricTypeConfig.columns, {
                name: "UniqueUsers",
            });
            if (uniqueVisitorsColumn) {
                uniqueVisitorsColumn.tooltip = null;
            }
        }

        return {
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(mode, params) {
        return _.cloneDeep(widgetConfig(params)[mode]);
    }

    static getMetricConfig(mode) {
        return _.cloneDeep(metricConfig[mode]);
    }

    static getMetricTypeConfig(mode) {
        return _.cloneDeep(metricTypeConfig[mode]);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    canAddToDashboard() {
        return true;
    }

    static getFiltersComponent() {
        return TopSitesTableWidgetFilters;
    }

    public getWidgetFilters() {
        return {
            filter: this.apiParams.filter,
            orderBy: this.apiParams.orderBy,
        };
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "TopSitesTable";
        widgetModel.metric = "TopSitesExtended";
        if (this._params.funcFlag) {
            (widgetModel as IWidgetModel & { funcFlag: string }).funcFlag = this._params.funcFlag;
        }
        return widgetModel;
    }

    public getFetcherFactory() {
        return this;
    }

    create(widgetConfig) {
        const widgetResource = Injector.get("widgetResource");
        return new TopSitesTableDataFetcher(widgetResource, widgetConfig);
    }

    protected getMetricColumnsConfig() {
        const mode = swSettings.allowedCountry(this.apiParams.country, "IndustryAnalysisGeneral")
            ? "extended"
            : "basic";
        let metricColumns = metricTypeConfig[mode].columns;
        // remove specific columns for dashboard widgets
        if (this.dashboardId) {
            metricColumns = this.filterColumnsForDashboard(metricColumns);
        }
        // remove specific columns according to webSource
        return this.filterColumnsByWebSource(metricColumns);
    }

    protected getSearchKey() {
        return "Domain";
    }
}

TopSitesTableWidget.register();

const widgetConfig = (params) => {
    return {
        basic: {
            metric: "TopSites",
            type: "Table",
            properties: {
                ...params,
                family: "Industry",
                metric: "TopSites",
                apiController: "TopSitesNew",
                type: "Table",
                height: "auto",
                width: "12",
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
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
                            properties: {},
                        },
                        {
                            id: "dropdown",
                            properties: {
                                param: "funcFlag",
                                type: "number",
                                operator: "==",
                                placeholder: "topsites.table.site.functionality.filter",
                                trackingName: "Site functionality flag",
                                className: "site-functionality-filter",
                                emptySelect: true,
                                values: [
                                    {
                                        id: "2",
                                        text:
                                            "topsites.table.site.functionality.filter.transactional",
                                    },
                                    {
                                        id: "4",
                                        text: "topsites.table.site.functionality.filter.news",
                                    },
                                    {
                                        id: "1",
                                        text: "topsites.table.site.functionality.filter.other",
                                    },
                                ],
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
        },
        extended: {
            metric: "TopSitesExtended",
            type: "Table",

            properties: {
                ...params,
                family: "Industry",
                metric: "TopSitesExtended",
                apiController: "TopSitesExtended",
                type: "Table",
                height: "auto",
                width: "12",
                enableRowSelection: true,
                tableSelectionProperty: "Domain",
                maxSelection: 15,
                minSelection: 1,
                initialSelectedRowsCount: 10,
                options: {
                    cssClass: "widgetTable",
                    showTitle: false,
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: false,
                    loadingSize: 20,
                    showCompanySidebar: true,
                    sortedColumnAddedWidth: true,
                    forceSetupColors: true,
                    widgetColorsFrom: "blue",
                    customTableClass: "row-selection-default-color",
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
                            properties: {},
                        },
                        {
                            id: "dropdown",
                            properties: {
                                param: "funcFlag",
                                type: "number",
                                operator: "==",
                                placeholder: "topsites.table.site.functionality.filter",
                                trackingName: "Site functionality flag",
                                className: "site-functionality-filter",
                                emptySelect: true,
                                values: [
                                    {
                                        id: "2",
                                        text:
                                            "topsites.table.site.functionality.filter.transactional",
                                    },
                                    {
                                        id: "4",
                                        text: "topsites.table.site.functionality.filter.news",
                                    },
                                    {
                                        id: "1",
                                        text: "topsites.table.site.functionality.filter.other",
                                    },
                                ],
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
        },
    };
};

const metricConfig = {
    basic: {
        component: "IndustryAnalysis",
        title: "metric.TopSites.title",
        family: "Industry",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
    },
    extended: {
        component: "IATopWebsites",
        title: "ia.overview.topsites",
        family: "Industry",
        order: "1",
        keyPrefix: "$",
        state: "websites-worldwideOverview",
        hasWebSource: true,
        dashboard: "true",
        disableDatepicker: true,
        defaultDuration: "1m",
        apiController: "TopSitesExtended",
        modules: {
            Industry: {
                titleState: "industryAnalysis-topSites",
            },
        },
    },
};
const metricTypeConfig = {
    basic: {
        properties: {},
        columns: [
            {
                fixed: true,
                cellTemp: "index",
                sortable: false,
                width: 65,
                dashboardHide: "true",
                disableHeaderCellHover: true,
            },
            {
                fixed: true,
                name: "Domain",
                title: "Domain",
                type: "string",
                format: "None",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "website-tooltip-top-cell",
                headTemp: "",
                totalCount: "True",
                tooltip: true,
                width: 185,
            },
            {
                name: "Share",
                title: "Traffic Share",
                type: "string",
                format: "percentagesign",
                sortable: "True",
                isSorted: "True",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "traffic-share",
                headTemp: "",
                totalCount: "False",
                tooltip: true,
                width: "50%",
            },
            {
                name: "Rank",
                title: "Rank",
                type: "long",
                format: "swRank",
                sortable: "True",
                isSorted: "False",
                sortDirection: "asc",
                groupable: "False",
                cellTemp: "rank-cell",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: true,
                minWidth: 110,
            },
        ],
        filters: {
            orderBy: [
                {
                    value: "Share desc",
                    title: "Traffic Share",
                },
            ],
        },
    },
    extended: {
        properties: {
            showMoreButtonItems: 5,
            options: {
                showFrame: true,
                showLegend: false,
                showOverflow: true,
                dashboardSubtitleMarginBottom: 15,
            },
        },
        columns: [
            {
                fixed: true,
                name: "row-selection-default-color",
                cellTemp: "row-selection",
                sortable: false,
                width: 33,
                dashboardHide: true,
                disableHeaderCellHover: true,
            },
            {
                fixed: true,
                cellTemp: "index",
                sortable: false,
                width: 45,
                dashboardHide: "true",
                disableHeaderCellHover: true,
            },
            {
                name: "Domain",
                title: "Domain",
                type: "string",
                fixed: true,
                format: "None",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "website-tooltip-top",
                headTemp: "",
                totalCount: "True",
                tooltip: "widget.table.tooltip.topsites.domain",
                width: 185,
            },
            {
                name: "Share",
                title: "Traffic Share",
                type: "string",
                format: "percentagesign",
                sortable: "True",
                isSorted: "True",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "traffic-share",
                headTemp: "",
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.share",
                minWidth: 150,
                ppt: {
                    overrideFormat: "smallNumbersPercentage:2",
                },
            },
            {
                name: "Change",
                title: "Change",
                type: "double",
                format: "number",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "change-percentage",
                headTemp: "",
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.change",
                width: 95,
                ppt: {
                    overrideFormat: "smallNumbersPercentage:2",
                },
            },
            {
                name: "Rank",
                title: "Rank",
                type: "long",
                format: "swRank",
                sortable: "True",
                isSorted: "False",
                sortDirection: "asc",
                groupable: "False",
                cellTemp: "rank-cell",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.rank",
                minWidth: 80,
                inverted: true,
            },
            {
                name: "AvgMonthVisits",
                title: "Monthly Visits",
                type: "double",
                format: "minVisitsAbbr",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.monthlyvisits",
                width: 125,
            },
            {
                name: "UniqueUsers",
                title: "Unique Visitors",
                type: "double",
                format: "minVisitsAbbr",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "metric.uniquevisitors.tab.tooltip",
                width: 130,
            },
            {
                name: "DesktopMobileShare",
                title: "Desktop vs Mobile",
                sortable: "False",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "percentage-bar-cell-rounded-right",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "wa.ao.desktopvsmobile.tooltip",
                minWidth: 190,
                webSources: ["Total"],
                ppt: {
                    overrideFormat: "smallNumbersPercentage:2",
                },
            },
            {
                name: "AvgVisitDuration",
                title: "Visit Duration",
                type: "double",
                format: "number",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "time-cell",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.avgvisitduration",
                width: 115,
                ppt: {
                    overrideFormat: "time",
                },
            },
            {
                name: "PagesPerVisit",
                title: "Pages/Visit",
                type: "double",
                format: "number",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "pages-per-visit",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.ppv",
                width: 110,
            },
            {
                name: "BounceRate",
                title: "Bounce Rate",
                type: "double",
                format: "number",
                sortable: "True",
                isSorted: "False",
                sortDirection: "asc",
                groupable: "False",
                cellTemp: "bounce-rate",
                headerComponent: DefaultCellHeaderRightAlign,
                totalCount: "False",
                tooltip: "widget.table.tooltip.topsites.bouncerate",
                width: 110,
                inverted: true,
                ppt: {
                    overrideFormat: "smallNumbersPercentage:2",
                },
            },
            {
                name: "HasAdsense",
                title: "Adsense",
                type: "bool",
                format: "None",
                sortable: "True",
                isSorted: "False",
                sortDirection: "desc",
                groupable: "False",
                cellTemp: "adsense-cell",
                headTemp: "",
                totalCount: "False",
                tooltip: true,
                width: 95,
            },
        ],
        filters: {
            orderBy: [
                {
                    value: "Share desc",
                    title: "Traffic Share",
                },
            ],
        },
    },
};
