import { Injector } from "common/ioc/Injector";
import { categoryPrettyFilter } from "filters/ngFilters";
import { TableWidget } from "./TableWidget";

export class CategoriesBaseTableWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "RelatedCategoriesTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getWidgetDashboardType() {
        return "Table";
    }

    public callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        if (this.isDashboard()) {
            this.data.Records.map((row) => this.addCategoryLink(row));
        }
    }

    protected addCategoryLink(row) {
        const state = this.getWidgetModel();
        const category = categoryPrettyFilter()(row.Category, null);
        const params = {
            category: row.isCustomCategory ? "*" + category : category,
            duration: state.duration,
            country: state.country,
        };
        return Object.assign(row, {
            href: (Injector.get("swNavigator") as any).href(this._metricConfig.state, params),
        });
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}
