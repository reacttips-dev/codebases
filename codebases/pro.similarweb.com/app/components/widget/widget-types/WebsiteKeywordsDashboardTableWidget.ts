import DurationService from "services/DurationService";
import { TableWidget } from "./TableWidget";
import * as _ from "lodash";
import { WebsiteKeywordsDashboardTableWidgetFilters } from "components/widget/widget-filters/WebsiteKeywordsDashboardTableWidgetFilters";
export class WebsiteKeywordsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "IndustryKeywordsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return WebsiteKeywordsDashboardTableWidgetFilters;
    }

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "SearchTerm";
    }

    getProperties() {
        const props = super.getProperties();
        return props;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    protected rowReducer(row) {
        const requestParams = this._params;
        const stateParams = {
            isWWW: "*", //for now - until fix for subdomains-domains
            duration: DurationService.getDiffSymbol(
                requestParams.from,
                requestParams.to,
                requestParams.isWindow ? "days" : "months",
            ),
            country: requestParams.country,
        };
        const rowParams = _.clone(stateParams);

        if (requestParams.metric.toLowerCase().indexOf("paid") > -1) {
            row.Paid = 1;
        }

        _.extend(rowParams, { keyword: row.SearchTerm });
        if (row.OrganicPaid || row.Paid == 1) {
            row.url = this._swNavigator.href("keywordAnalysis-paid", rowParams);
        } else {
            row.url = this._swNavigator.href("keywordAnalysis-organic", rowParams);
        }
        return { ...row };
    }
}
WebsiteKeywordsDashboardTableWidget.register();
