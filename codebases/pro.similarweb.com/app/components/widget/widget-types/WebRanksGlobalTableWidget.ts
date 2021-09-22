/**
 * Created by olegg on 04-Apr-17.
 */
import { TableWidget } from "./TableWidget";
import CountryService from "services/CountryService";

export class WebRanksGlobalTableWidget extends TableWidget {
    private _internalLinksService;

    static $inject = ["internalLinksService"];

    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.subtitleData = {};
        this.subtitleData["country"] = CountryService.countriesById[999];
    }

    getProUrl(rowParams?) {
        if (rowParams) {
            return super.getProUrl(rowParams);
        } else {
            return this._internalLinksService.getTopSitesLink();
        }
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

WebRanksGlobalTableWidget.register();
