import { TableWidget } from "./TableWidget";
import { OutgoingReferralsDashboardTableWidgetFilters } from "components/widget/widget-filters/OutgoingReferralsDashboardTableWidgetFilters";
export class OutgoingReferralsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "OutgoingReferralsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return OutgoingReferralsDashboardTableWidgetFilters;
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            outagoing_filters:
                typeof this.apiParams.filter === "string" &&
                this.apiParams.filter.replace(/"/g, "").replace(",", "+"),
        });
    }
}
OutgoingReferralsDashboardTableWidget.register();
