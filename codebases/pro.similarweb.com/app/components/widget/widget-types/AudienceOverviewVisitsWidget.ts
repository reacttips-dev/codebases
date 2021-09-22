import { swSettings } from "common/services/swSettings";
import { SingleMetricWidget } from "./SingleMetricWidget";

export class AudienceOverviewVisitsWidget extends SingleMetricWidget {
    static getWidgetMetadataType() {
        return "SingleMetric";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    private _swSettings = swSettings;
    public isMobileWebCountry: boolean;
    public showTrafficShare: boolean;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        const country = this._params.country;

        // show traffic share in desktop/mobileweb and in mobileweb countries
        if (
            (this._params.webSource == "Desktop" || this._params.webSource == "MobileWeb") &&
            this._swSettings.allowedCountry(parseInt(country), "MobileWeb")
        ) {
            this.showTrafficShare = true;
        } else {
            this.showTrafficShare = false;
        }
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/singlemetric.html`;
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "SingleMetric";
        return widgetModel;
    }
}

AudienceOverviewVisitsWidget.register();
