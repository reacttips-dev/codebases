import { TableWidget } from "./TableWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
export class WWOTopDestinationReferralsWidget extends TableWidget {
    static $inject = ["$filter"];
    protected _$filter;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        let innerLevelPackage;
        if (context.includes("affiliateanalysis")) {
            innerLevelPackage = "affiliateanalysis";
        } else if (context.includes("analyzepublishers")) {
            innerLevelPackage = "analyzepublishers";
        } else if (context.includes("competitiveanalysis") || context.includes("companyresearch")) {
            innerLevelPackage = "competitiveanalysis";
        } else {
            innerLevelPackage = null;
        }

        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-outgoing",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
            innerLevelPackage,
        );
        this.viewOptions.link = this._swNavigator.href(targetState, this._swNavigator.getParams());
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking =
            "Traffic Destination/Outgoing Links/" +
            this._$filter("i18n")(widgetConfig.properties.options.ctaButton);
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
    }

    setMetadata() {
        super.setMetadata();
    }

    onResize() {
        super.onResize();
    }

    validateData(response: any) {
        return super.validateData(response);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/wwotable.html`;
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.webSource = "Desktop";
        widgetModel.metric = "OutgoingReferrals";
        return widgetModel;
    }
}

WWOTopDestinationReferralsWidget.register();
