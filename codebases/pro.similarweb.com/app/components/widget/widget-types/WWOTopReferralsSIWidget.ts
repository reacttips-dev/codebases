import * as _ from "lodash";
import { TableWidget } from "./TableWidget";

export class WWOTopReferralsSIWidget extends TableWidget {
    static $inject = ["$filter"];

    protected _$filter: any;

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
        this.viewOptions.link = this._swNavigator.href(
            "accountreview_website_referrals_incomingtraffic",
            this._swNavigator.getParams(),
        );
        this.viewOptions.target = "_self";
        this.viewOptions.ctaButtonTracking =
            "Marketing Mix/Top Referring Websites/" +
            this._$filter("i18n")(widgetConfig.properties.options.ctaButton);
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
        this.data.Records = response.Records.map((item: any) => {
            return {
                ...item,
                ShareList: item.ShareList
                    ? item.ShareList.reduce((acc, current, index) => {
                          return {
                              ...acc,
                              [this.legendItems[index].name]: current,
                          };
                      }, {})
                    : item.ShareList,
            };
        });
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
        return widgetModel;
    }
}
WWOTopReferralsSIWidget.register();
