import { TableWidget } from "components/widget/widget-types/TableWidget";
import DurationService from "services/DurationService";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { RankCell } from "../../../../components/React/Table/cells";
import { DefaultCellRightAlign } from "../../../../components/React/Table/cells/DefaultCellRightAlign";

export class TrafficSourcesOverviewTableWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetDashboardType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const apiController = "IndustryAnalysis";
        const widgetConfig = TrafficSourcesOverviewTableWidget.getWidgetConfig(params);
        const metricConfig = TrafficSourcesOverviewTableWidget.getMetricConfig();
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    protected static getWidgetConfig(params) {
        return trafficSourcesOverviewTableConfig(params);
    }

    protected static getMetricConfig() {
        return trafficSourcesOverviewTableConfig();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    public getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "IndustryReferralsDashboardTable";
        widgetModel.metric = "TrafficSourcesOverviewDataKpiWidget";
        widgetModel.webSource = "Desktop";
        return widgetModel;
    }

    public canAddToDashboard() {
        return true;
    }

    protected rowReducer(row) {
        const requestParams = this._params;
        const stateParams = {
            isWWW: "*", // for now - until fix for subdomains-domains
            duration: DurationService.getDiffSymbol(
                requestParams.from,
                requestParams.to,
                requestParams.isWindow ? "days" : "months",
            ),
            country: requestParams.country,
            key: row.Domain,
        };
        return {
            ...row,
            url: this._swNavigator.href(
                "websites-worldwideOverview",
                Object.assign({}, stateParams, this._swNavigator.getParams()),
                {},
            ),
        };
    }

    protected _getExcelEndPoint() {
        return `/widgetApi/IndustryAnalysis/TrafficSourcesOverviewData/Excel?`;
    }
}

const trafficSourcesOverviewTableConfig = (params?) => {
    return {
        type: "Table",
        properties: {
            ...params,
            metric: "TrafficSourcesOverviewDataKpiWidget",
            apiParams: {
                metric: "TrafficSourcesOverviewData",
            },
            family: "Industry",
            type: "Table",
            height: "auto",
            width: "12",
            options: {
                cssClass: "widgetTable",
                showIndex: true,
                showTitle: false,
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: false,
                loadingSize: 20,
                showCompanySidebar: true,
                scrollableTable: true,
                overrideColumns: true,
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
                    fixed: true,
                    name: "Domain",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.domain", // "Traffic Source",
                    type: "string",
                    format: "None",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: true,
                    cellTemp: "industry-traffic-source",
                    headTemp: "",
                    totalCount: true,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.domain",
                    width: 220,
                },
                {
                    name: "SourceType",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.sourcetype", // "Source Type",
                    type: "string",
                    format: "None",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "default-cell",
                    headTemp: "",
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.sourcetype",
                    width: 160,
                },
                {
                    name: "Rank",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.globalrank", // "Global Rank",
                    type: "long",
                    format: "swRank",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "asc",
                    groupable: false,
                    cellComponent: RankCell,
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.rank",
                    width: 140,
                    dangerouslySetInnerHTML: true,
                    inverted: "True",
                },
                {
                    name: "TotalShare",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.trafficshare", // "Traffic Share",
                    type: "string",
                    format: "percentagesign",
                    sortable: true,
                    isSorted: true,
                    sortDirection: "desc",
                    groupable: false,
                    cellComponent: DefaultCellRightAlign,
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.totalshare",
                    minWidth: 170,
                },
                {
                    name: "Change",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.change", // "Change",
                    type: "double",
                    format: "percentagesign",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "change-percentage",
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.change",
                    width: 110,
                },
                {
                    name: "Category",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.category", // "Category",
                    type: "string",
                    format: "prettifyCategory",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "default-cell",
                    headTemp: "",
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.category",
                    minWidth: 220,
                },
                {
                    name: "HasAdsense",
                    title: "widget.table.trafficsourcesoverviewdatakpiwidget.columns.adsense", // "Adsense",
                    type: "bool",
                    format: "None",
                    sortable: true,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "adsense-cell",
                    headTemp: "",
                    totalCount: false,
                    tooltip: "widget.table.tooltip.trafficsourcesoverviewdatakpiwidget.hasadsense",
                    width: 95,
                },
            ],
        },
        utilityGroups: [
            {
                properties: {
                    className: "tableTopRow",
                },
                utilities: [
                    {
                        id: "table-search",
                        properties: {
                            column: "Domain",
                        },
                    },
                    {
                        id: "dropdown",
                        properties: {
                            param: "filter",
                            column: "category",
                            operator: "category", // SIM-23834: backend expects the filter to be: filter: ;category;"Arts_and_Entertainment~TV_and_Video"
                            placeholder:
                                "widget.table.trafficsourcesoverviewdatakpiwidget.filters.allcategory", // "All Categories",
                            showSearch: true,
                            trackingName: "Referring Category",
                            emptySelect: true,
                        },
                    },
                    {
                        id: "dropdown",
                        properties: {
                            param: "filter",
                            type: "string",
                            column: "sourceType",
                            operator: "==",
                            placeholder:
                                "widget.table.trafficsourcesoverviewdatakpiwidget.filters.allsources", // "All Sources",
                            showSearch: true,
                            trackingName: "Traffic Source",
                            emptySelect: true,
                        },
                    },
                ],
            },
            {
                properties: {
                    className: "absoluteBottom",
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
};
