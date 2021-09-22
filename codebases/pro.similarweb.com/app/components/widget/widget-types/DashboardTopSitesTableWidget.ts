import { TableWidget } from "./TableWidget";
import { TopSitesTableWidgetFilters } from "components/widget/widget-filters/TopSitesTableWidgetFilters";

export class DashboardTopSitesTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "TopSitesTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    static getFiltersComponent() {
        return TopSitesTableWidgetFilters;
    }

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "Domain";
    }

    public getWidgetFilters() {
        return {
            filter: this.apiParams.filter,
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

DashboardTopSitesTableWidget.register();
