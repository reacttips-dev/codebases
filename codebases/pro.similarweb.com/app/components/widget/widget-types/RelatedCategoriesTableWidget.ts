import { CategoriesBaseTableWidget } from "./CategoriesBaseTableWidget";

export class RelatedCategoriesTableWidget extends CategoriesBaseTableWidget {
    public static getWidgetMetadataType() {
        return "RelatedCategoriesTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getWidgetDashboardType() {
        return "Table";
    }

    public getWidgetModel() {
        return Object.assign(super.getWidgetModel(), { type: "RelatedCategoriesTable" });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

RelatedCategoriesTableWidget.register();
