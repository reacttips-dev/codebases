/**
 * Created by liorb on 3/29/2017.
 */
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { DesktopVSMobileWidget } from "./DesktopVSMobileWidget";

const TABLE_ROW_HEIGHT = 34;
const TABLE_HEADER_HEIGHT = 30;
export class DesktopVSMobileWWOWidget extends DesktopVSMobileWidget {
    static getWidgetMetadataType() {
        return "DesktopVSMobile";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    public isMobileWebCountry: boolean;

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        let mobileWebComponent = "MobileWeb";
        let websiteOverviewComponent = "WorldwideOverview";
        //SIM-16385: enable mobile web for worldwide
        if (
            _.includes(
                swSettings.components[websiteOverviewComponent].resources.Countries,
                parseInt(this._params.country),
            )
        ) {
            this.isMobileWebCountry = true;
        } else if (
            _.includes(
                swSettings.components[mobileWebComponent].resources.Countries,
                parseInt(this._params.country),
            )
        ) {
            this.isMobileWebCountry = true;
        } else {
            this.isMobileWebCountry = false;
        }
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/desktopVSMobileTable.html`;
    }
}

DesktopVSMobileWWOWidget.register();
