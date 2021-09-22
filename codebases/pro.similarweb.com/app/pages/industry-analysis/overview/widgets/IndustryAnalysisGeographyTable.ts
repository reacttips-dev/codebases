import { TableWidget } from "components/widget/widget-types/TableWidget";

export class IndustryAnalysisGeographyTable extends TableWidget {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = IndustryAnalysisGeographyTable.getWidgetConfig(params);
        const metricConfig = IndustryAnalysisGeographyTable.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisGeographyTable.getMetricTypeConfig();
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
        return Object.assign(super.getWidgetModel(), { metric: "Geography" });
    }
}

const widgetConfig = (params) => {
    return {
        type: "Table",
        properties: {
            ...params,
            family: "Industry",
            apiController: "IndustryAnalysisGeography",
            type: "Table",
            width: "6",
            height: "172px",
            loadingHeight: "176px",
            title: "ia.overview.geography",
            tooltip: "ia.overview.geography.tooltip",
            country: "999",
            apiParams: {
                metric: "Geography",
                pageSize: "5",
                country: "999",
            },
            options: {
                cssClass: "swTable--simple",
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                overrideCountry: "999",
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                hideBorders: true,
                hideHeader: true,
                desktopOnly: true,
                overrideColumns: true,
            },
            columns: [
                {
                    name: "Country",
                    title: "Country",
                    type: "string",
                    format: "None",
                    sortable: false,
                    isSorted: false,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "country-cell",
                    headTemp: "",
                    totalCount: true,
                    tooltip: false,
                    minWidth: 230,
                    ppt: {
                        // override the table column format when rendered in ppt
                        overrideFormat: "Country",
                    },
                },
                {
                    name: "Share",
                    title: "Traffic Share",
                    type: "string",
                    format: "percentagesign",
                    sortable: false,
                    isSorted: false,
                    isLink: true,
                    sortDirection: "desc",
                    groupable: false,
                    cellTemp: "traffic-share",
                    headTemp: "",
                    totalCount: false,
                    tooltip: false,
                    width: "",
                },
            ],
        },
    };
};

const metricConfig = {
    properties: {
        options: {
            desktopOnly: true,
            showLegend: false,
            dashboardSubtitleMarginBottom: 15,
        },
        showMoreButtonItems: 5,
    },
    columns: [
        {
            name: "Country",
            title: "Country",
            type: "string",
            format: "None",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "country-cell",
            headTemp: "",
            totalCount: false,
            tooltip: false,
            width: "230px",
            ppt: {
                // override the table column format when rendered in ppt
                overrideFormat: "Country",
            },
        },
        {
            name: "Share",
            title: "Traffic Share",
            type: "string",
            format: "percentagesign",
            sortable: false,
            isSorted: false,
            isLink: true,
            sortDirection: "desc",
            groupable: false,
            cellTemp: "traffic-share",
            headTemp: "",
            totalCount: false,
            tooltip: false,
            minWidth: "150px",
        },
    ],
    filters: {
        orderBy: [
            {
                value: "TotalShare desc",
                title: "Traffic Share",
            },
        ],
    },
};
