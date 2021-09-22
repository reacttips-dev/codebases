// TODO: check if this widget is still in use
import { Injector } from "common/ioc/Injector";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { RelatedCategoriesTableWidget } from "./RelatedCategoriesTableWidget";
import { WidgetState } from "./Widget";

export class CustomCategoriesWidget extends RelatedCategoriesTableWidget {
    public static getWidgetMetadataType() {
        return "CustomCategoriesTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    private emptyWidget: boolean = false;
    private showCustomCategoriesModal: boolean = false;

    public initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
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

    public onResize() {
        super.onResize();
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

    // This method is invoked Only when widget is in dashboard context
    protected addCategoryLink(row) {
        Object.assign(row, { isCustomCategory: true });
        super.addCategoryLink(row);
    }

    get templateUrl() {
        if (!this.emptyWidget) {
            return `/app/components/widget/widget-templates/table.html`;
        } else {
            return `/app/components/widget/widget-templates/customcategories.html`;
        }
    }
}

CustomCategoriesWidget.register();
