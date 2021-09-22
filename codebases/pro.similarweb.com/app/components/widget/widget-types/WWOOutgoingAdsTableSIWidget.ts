import * as _ from "lodash";
import { TableWidget } from "./TableWidget";

export class WWOOutgoingAdsTableSIWidget extends TableWidget {
    static $inject = ["$filter"];
    protected _$filter;

    static getWidgetMetadataType() {
        return "WWOOutgoingAdsTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig: any, context: string) {
        this.viewOptions.link = this._swNavigator.href("accountreview_website_paidoutgoing", {
            ...this._swNavigator.getParams(),
            selectedTab: "advertisers",
        });
        this.viewOptions.target = true ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking =
            "Traffic Destination/Outgoing Ads/" +
            this._$filter("i18n")(widgetConfig.properties.options.ctaButton);
        super.initWidget(widgetConfig, context);
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
        widgetModel.metric = "DashboardTopOutgoingAds";
        return widgetModel;
    }
}

WWOOutgoingAdsTableSIWidget.register();
