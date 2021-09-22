import { TableWidget } from "./TableWidget";
import { IndustryReferralsDashboardTableWidgetFilters } from "components/widget/widget-filters/IndustryReferralsDashboardTableWidgetFilters";
export class IndustryReferralsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "IndustryReferralsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return IndustryReferralsDashboardTableWidgetFilters;
    }

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "Domain";
    }

    getProperties() {
        const props = super.getProperties();
        return props;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}
IndustryReferralsDashboardTableWidget.register();
