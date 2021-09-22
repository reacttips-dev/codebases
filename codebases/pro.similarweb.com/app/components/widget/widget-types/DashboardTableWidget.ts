import { TableWidget } from "components/widget/widget-types/TableWidget";
import { WidgetState } from "components/widget/widget-types/Widget";
import { DefaultFetchService } from "services/fetchService";
import { TableSearchKeywordsDashboardWidgetFilters } from "components/widget/widget-types/TableSearchKeywordsDashboardWidgetFilters";

export class DashboardTableWidget extends TableWidget {
    constructor() {
        super();
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/table.html";
    }

    static getWidgetDashboardType() {
        return "Table";
    }
    static getFiltersComponent() {
        return TableSearchKeywordsDashboardWidgetFilters;
    }
    getData() {
        const that = this;
        that._updateWidgetCache();
        that.widgetState = WidgetState.LOADING;
        const requestParams = this._params;
        const { endpoint } = this.apiParams;
        return this._$timeout(() => {
            return DefaultFetchService.getInstance()
                .get(endpoint, { ...requestParams, key: requestParams.keys })
                .then((response) => {
                    this.emit("widgetGetDataSuccess", response);
                    if (requestParams === that._params) {
                        return this.onNewDataReceived(response);
                    } else {
                        return this.getData();
                    }
                })
                .catch((reason) => {
                    this.emit("widgetGetDataFail", reason);
                    that.widgetState = WidgetState.ERROR;
                    that.handleDataError(reason.status);
                });
        });
    }
}

DashboardTableWidget.register();
