import DurationService from "services/DurationService";
import { TableWidget } from "./TableWidget";
import { KeywordsDashboardTableWidgetFilters } from "../widget-filters/KeywordsDashboardTableWidgetFilters";
import widgetSettings from "components/dashboard/WidgetSettings";

export class KeywordsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "KeywordsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
        if (this.apiParams.webSource == "MobileWeb") {
            this._metricConfig.titleState = "keywordAnalysis-mobileweb";
        }
    }

    static getFiltersComponent() {
        return KeywordsDashboardTableWidgetFilters;
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
        const state = widgetSettings.getMetricProperties(requestParams.metric).state;
        const stateParams = {
            isWWW: "*", //for now - until fix for subdomains-domains
            duration: DurationService.getDiffSymbol(
                requestParams.from,
                requestParams.to,
                requestParams.isWindow ? "days" : "months",
            ),
            country: requestParams.country,
            key: row.Domain,
        };
        if (row.Domain || row.Keyword) {
            const rowParams = {
                ...stateParams,
                keyword: row.Keyword || requestParams.keys,
            };
            return {
                ...row,
                url: this._swNavigator.href(state, rowParams, {}),
            };
        }
        return { ...row };
    }

    protected getSearchKey() {
        return "Domain";
    }
}
KeywordsDashboardTableWidget.register();
