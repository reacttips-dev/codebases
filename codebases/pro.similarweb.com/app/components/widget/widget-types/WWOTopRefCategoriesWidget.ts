import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";

export interface categoryItem {
    Category: string;
    Share: number;
}

export class WWOTopRefCategoriesWidget extends TableWidget {
    static $inject = ["$filter"];
    public CATEGORY_DIVIDER = "/";

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    protected _$filter: any;

    static getWidgetMetadataType() {
        return "WWOTopRefCategories";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
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
        this.viewOptions.ctaButtonTracking = `Marketing Mix/Top Referring Categories/${this._$filter(
            "i18n",
        )("wwo.referring.categories.button")}`;
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        // Server return always 6 results or less, remove "Unknown" if there's another category to show instead
        if (response.Data.length === 6) {
            response.Data = _.remove(response.Data, (item) => item["Category"] !== "Unknown");
            response.Records = _.remove(response.Records, (item) => item["Category"] !== "Unknown");
            if (response.Data.length === 6) {
                response.Data = response.Data.slice(0, 5);
                response.Records = response.Records.slice(0, 5);
            }
        }

        response.Data = _.map(response.Data, (item: categoryItem) => {
            return {
                Category: item.Category.replace("/", "~"),
                Share: item.Share,
            };
        });

        super.callbackOnGetData(response);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/wwotable.html`;
    }
}

WWOTopRefCategoriesWidget.register();
