/**
 * Created by liorb on 3/29/2017.
 */
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { TableWidget } from "./TableWidget";

const TABLE_ROW_HEIGHT = 34;
const TABLE_HEADER_HEIGHT = 30;
export class DesktopVSMobileWidget extends TableWidget {
    static getWidgetMetadataType() {
        return "DesktopVSMobile";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    public isMobileWebCountry: boolean;

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        if (
            _.includes(
                swSettings.components.MobileWeb.resources.Countries,
                parseInt(this._params.country),
            )
        ) {
            this.isMobileWebCountry = true;
        } else {
            this.isMobileWebCountry = false;
        }
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        if (!this.isMobileWebCountry) {
            this.viewData.height =
                TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * this._params.keys.split(",").length;
        }
    }

    public canAddToDashboard() {
        return this.isMobileWebCountry;
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/desktopVSMobileTable.html`;
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.metric = "EngagementDesktopVsMobileVisits";
        return widgetModel;
    }
}

DesktopVSMobileWidget.register();
