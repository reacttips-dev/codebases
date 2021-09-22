import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
export class WWOTopReferralsWidget extends TableWidget {
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

    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficReferrals",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
        );
        this.viewOptions.link = this._swNavigator.href(targetState, this._swNavigator.getParams());
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
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
                url: this._swNavigator.href("websites-worldwideOverview", {
                    ...this._swNavigator.getParams(),
                    key: item.Domain,
                }),
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
WWOTopReferralsWidget.register();
