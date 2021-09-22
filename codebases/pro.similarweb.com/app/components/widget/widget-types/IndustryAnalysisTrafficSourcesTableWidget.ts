/**
 * Created by olegg on 03-Jul-17.
 */
import * as _ from "lodash";
import DurationService from "services/DurationService";
import { TableWidget } from "./TableWidget";
export class IndustryAnalysisTrafficSourcesTableWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        return widgetModel;
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
            key: row.Domain,
        };
        return {
            ...row,
            url: this._swNavigator.href(
                "websites-worldwideOverview",
                Object.assign({}, stateParams, this._swNavigator.getParams()),
                {},
            ),
        };
    }
}

IndustryAnalysisTrafficSourcesTableWidget.register();
