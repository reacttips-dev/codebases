import { Injector } from "common/ioc/Injector";
import { CategoriesBaseTableWidget } from "components/widget/widget-types/CategoriesBaseTableWidget";
import { IWidgetConfig, WidgetState } from "components/widget/widget-types/Widget";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { DefaultCellHeaderRightAlign } from "../../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";

export class IndustryAnalysisCustomCategoriesTable extends CategoriesBaseTableWidget {
    public static getWidgetMetadataType() {
        return "CustomCategoriesTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getAllConfigs(params) {
        const widgetConfig: IWidgetConfig = IndustryAnalysisCustomCategoriesTable.getWidgetConfig(
            params,
        );
        const metricConfig = IndustryAnalysisCustomCategoriesTable.getMetricConfig();
        const metricTypeConfig = IndustryAnalysisCustomCategoriesTable.getMetricTypeConfig();
        const apiController = widgetConfig.properties.apiController;
        const isCustomCategory =
            (Injector.get("swNavigator") as any).getParams().category[0] === "*";

        if (isCustomCategory) {
            const numberOfCustomCategories = UserCustomCategoryService.getCustomCategories().length;
            if (numberOfCustomCategories < 2) {
                widgetConfig.properties.options.showSubtitle = false;
                widgetConfig.properties.height = "191px";
            }
        }

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

    private emptyWidget: boolean = false;
    private showCustomCategoriesModal: boolean = false;

    get templateUrl() {
        if (!this.emptyWidget) {
            return `/app/components/widget/widget-templates/table.html`;
        } else {
            return `/app/components/widget/widget-templates/customcategories.html`;
        }
    }

    public initWidgetWithConfigs(config, context) {
        super.initWidgetWithConfigs(config, context);
        const customCategories = UserCustomCategoryService.getCustomCategories();
        if (customCategories.length < 2) {
            this.emptyWidget = true;
        }
    }

    public getData() {
        if (!this.emptyWidget) {
            super.getData();
        } else {
            this.widgetState = WidgetState.LOADED;
        }
    }

    public setMetadata() {
        if (!this.emptyWidget) {
            super.setMetadata();
        }
    }

    public callbackOnGetData(response: any) {
        if (!this.emptyWidget) {
            super.callbackOnGetData(response);
        }
    }

    public validateData(response: any) {
        if (!this.emptyWidget) {
            return super.validateData(response);
        } else {
            return true;
        }
    }

    public getWidgetModel() {
        return Object.assign(super.getWidgetModel(), { type: "CustomCategories" });
    }

    public openCustomCategoriesWizard() {
        this.showCustomCategoriesModal = true;
    }

    public onClose = () => {
        this._$timeout(() => {
            this.showCustomCategoriesModal = false;
        });
    };

    public canAddToDashboard() {
        return false;
    }
}

const widgetConfig = (params) => {
    return {
        type: "CustomCategories",
        properties: {
            ...params,
            family: "Industry",
            apiController: "IndustryAnalysis",
            type: "CustomCategories",
            width: "6",
            height: "172px",
            loadingHeight: "176px",
            title: "customcategories.widget.title",
            tooltip: "customcategories.widget.title.tooltip",
            apiParams: {
                pageSize: "5",
                metric: "Subcategories",
            },
            disableBrowserCache: true,
            options: {
                cssClass: "swTable--simple",
                showTitle: true,
                showTitleTooltip: true,
                titleType: "text",
                showSubtitle: true,
                showLegend: false,
                preserveLegendSpace: false,
                showSettings: false,
                showTopLine: false,
                showFrame: true,
                hideBorders: true,
                desktopOnly: true,
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
            tooltip: true,
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
            tooltip: true,
            width: "",
        },
    ],
};
