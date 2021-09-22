import { TableWidget } from "./TableWidget";
import { TopReferralsDashboardTableWidgetFilters } from "components/widget/widget-filters/TopReferralsDashboardTableWidgetFilters";
export class TopReferralsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "TopReferralsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return TopReferralsDashboardTableWidgetFilters;
    }

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "domain";
    }

    getProperties() {
        const props = super.getProperties();
        return props;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    _getProUrlParams() {
        return Object.assign(super._getProUrlParams(), {
            referralsCategory:
                typeof this.apiParams.filter === "string" &&
                this.apiParams.filter
                    .replace(/"/g, "")
                    .replace(",", "+")
                    .replace(/category;/g, ""),
        });
    }
}
TopReferralsDashboardTableWidget.register();
