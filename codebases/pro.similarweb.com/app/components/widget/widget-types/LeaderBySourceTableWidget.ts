import { TableWidget } from "./TableWidget";
import { TopSitesTableWidgetFilters } from "../widget-filters/TopSitesTableWidgetFilters";
declare let similarweb;

export class LeaderBySourceTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "LeaderBySourceTable";
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

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.data.Records.map((row) => this.addLeaderLink(row));
    }

    protected addLeaderLink(row) {
        let state = this.getWidgetModel();
        let params = {
            duration: state.duration,
            country: state.country,
            webSource: "Total",
            key: row.Domain,
            isWWW: "*",
        };
        return Object.assign(row, {
            url: this._swNavigator.href("websites-worldwideOverview", params),
        });
    }

    getWidgetModel() {
        return Object.assign(super.getWidgetModel(), {
            type: "LeaderBySourceTable",
            tab: this._swNavigator.getApiParams().tab,
            webSource: "Desktop",
        });
    }

    protected _getProUrl() {
        let result: any = {
            tab: this.apiParams.tab,
        };
        result = Object.assign(super._getProUrlParams(), result);
        return this._swNavigator.href("industryAnalysis-categoryLeaders", result, {});
    }

    protected getSearchKey() {
        return "Domain";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    _getProUrlParams() {
        return Object.assign(super._getProUrlParams(), { tab: this.getWidgetModel().metric });
    }
}

LeaderBySourceTableWidget.register();
