import * as _ from "lodash";
import { TableWidget } from "./TableWidget";

export class WWOTopPublishersTableSIWidget extends TableWidget {
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

    initWidget(widgetConfig: any, context: string) {
        const _inputParams = this._swNavigator.getParams();
        _inputParams.selectedTab = "publishers";
        this.viewOptions.link = this._swNavigator.href(
            "accountreview_website_display",
            _inputParams,
        );
        this.viewOptions.target = "_self";
        this.viewOptions.ctaButtonTracking = `Display Advertising/Top Publishers/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
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
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.webSource = "Desktop";
        widgetModel.metric = "DashboardIncomingAds";
        return widgetModel;
    }
}
WWOTopPublishersTableSIWidget.register();
