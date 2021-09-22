import { TableWidget } from "components/widget/widget-types/TableWidget";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { DefaultCellRightAlign } from "../../../../components/React/Table/cells/DefaultCellRightAlign";

export class OverviewTopSitesTableWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = OverviewTopSitesTableWidget.getWidgetConfig(params);
        const metricConfig = OverviewTopSitesTableWidget.getMetricConfig();
        const metricTypeConfig = OverviewTopSitesTableWidget.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;

        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig,
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    public static getWidgetConfig(params) {
        return widgetConfig(params);
    }

    public static getMetricConfig() {
        return metricConfig;
    }

    public static getMetricTypeConfig() {
        return metricConfig;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    public canAddToDashboard() {
        return true;
    }

    public getWidgetModel() {
        return Object.assign(super.getWidgetModel(), { metric: "TopSitesExtended" });
    }
}

const widgetConfig = (params) => {
    return {
        type: "Table",
        properties: {
            ...params,
            apiController: "TopSitesExtended",
            family: "Industry",
            type: "Table",
            width: "4",
            height: "186px",
            loadingHeight: "192px",
            forcedDuration: "1m",
            title: "ia.overview.topsites",
            tooltip: "ia.overview.topsites.tooltip",
            apiParams: {
                metric: "TopSitesExtended",
                pageSize: "5",
            },
            options: {
                showTitle: true,
                cssClass: "swTable--simple",
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                hideBorders: true,
                overrideColumns: true,
            },
            columns: [
                {
                    name: "Domain",
                    title: "Domain",
                    type: "string",
                    format: "None",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "website-tooltip-top-cell",
                    headTemp: "",
                    totalCount: "False",
                    width: "",
                },
                {
                    name: "AvgMonthVisits",
                    title: "Visits",
                    type: "string",
                    format: "abbrNumber",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellComponent: DefaultCellRightAlign,
                    headerComponent: DefaultCellHeaderRightAlign,
                    width: 68,
                },
                {
                    name: "Change",
                    title: "Change",
                    type: "string",
                    format: "percentagesign",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "False",
                    cellTemp: "change-percentage",
                    headerComponent: DefaultCellHeaderRightAlign,
                    totalCount: "False",
                    width: "75px",
                },
            ],
        },
    };
};

const metricConfig = {
    properties: {
        showMoreButtonItems: 5,
        state: "websites-worldwideOverview",
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
            cellTemp: "index",
            sortable: false,
            width: 65,
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
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: "widget.table.tooltip.topsites.change",
            width: 110,
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
            minWidth: 85,
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
            width: 130,
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
            type: "double",
            format: "abbrNumber",
            sortable: "False",
            isSorted: "False",
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "percentage-bar-cell-rounded",
            headTemp: "",
            totalCount: "False",
            tooltip: "wa.ao.desktopvsmobile.tooltip",
            minWidth: 190,
            webSources: ["Total"],
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
            width: 130,
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
            width: 125,
            inverted: true,
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
};
