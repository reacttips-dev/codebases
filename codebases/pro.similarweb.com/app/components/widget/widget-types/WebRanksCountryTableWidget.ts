/**
 * Created by olegg on 04-Apr-17.
 */
import { TableWidget } from "./TableWidget";

export class WebRanksCountryTableWidget extends TableWidget {
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
        this.viewData.proUrl = this._internalLinksService.getTopSitesLink({
            country: this.subtitleData["country"].id,
        });
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

WebRanksCountryTableWidget.register();
