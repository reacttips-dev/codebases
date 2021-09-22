import { CategoriesBaseTableWidget } from "components/widget/widget-types/CategoriesBaseTableWidget";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

export class IndustryAnalysisRelatedCategoriesTable extends CategoriesBaseTableWidget {
    public static getWidgetMetadataType() {
        return "Table";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const widgetConfig: any = IndustryAnalysisRelatedCategoriesTable.getWidgetConfig(params);
        const metricConfig = IndustryAnalysisRelatedCategoriesTable.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisRelatedCategoriesTable.getMetricTypeConfig();
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
        return Object.assign(super.getWidgetModel(), { metric: "Subcategories" });
    }
}

const widgetConfig = (params) => {
    return {
        type: "RelatedCategoriesTable",
        properties: {
            ...params,
            family: "Industry",
            apiController: "IndustryAnalysis",
            type: "RelatedCategoriesTable",
            width: "6",
            height: "172px",
            loadingHeight: "176px",
            title: "ia.overview.subcategories",
            tooltip: "ia.overview.subcategories.tooltip",
            apiParams: {
                pageSize: "5",
                metric: "Subcategories",
            },
            options: {
                cssClass: "swTable--simple",
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                desktopOnly: true,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                hideBorders: true,
                hideHeader: true,
            },
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
            name: "Category",
            title: "Category",
            type: "string",
            format: "None",
            sortable: "False",
            isSorted: "False",
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
            name: "TotalVisits",
            title: "Total Visits",
            type: "double",
            format: "abbrNumber",
            sortable: "False",
            isSorted: "False",
            isLink: true,
            sortDirection: "desc",
            groupable: "False",
            cellTemp: "subcategories-share",
            headerComponent: DefaultCellHeaderRightAlign,
            totalCount: "False",
            tooltip: false,
            width: "",
        },
    ],
};
