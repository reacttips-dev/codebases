/**
 * Created by olegg on 04-Apr-17.
 */
import { TableWidget } from "./TableWidget";

export class WebRanksCategoryTableWidget extends TableWidget {
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
            country: this._params.country,
            category: this.subtitleData.category.replace("/", "~"),
        });
    }

    getProUrl(rowParams?) {
        if (rowParams) {
            return super.getProUrl(rowParams);
        }
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

WebRanksCategoryTableWidget.register();
