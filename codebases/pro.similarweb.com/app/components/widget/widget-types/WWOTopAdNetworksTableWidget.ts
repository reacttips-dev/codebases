import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
export class WWOTopAdNetworksTableWidget extends TableWidget {
    static $inject = ["$filter"];

    protected _$filter;

    static getWidgetMetadataType() {
        return "WWOTopAdNetworksTable";
    }
    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        const innerLevelPackage = context.includes("analyzepublishers")
            ? "analyzepublishers"
            : context.includes("competitiveanalysis") ||
              context.includes("companyresearch") ||
              context.includes("affiliateanalysis")
            ? "competitiveanalysis"
            : null;
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficDisplay-adNetworks",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
            innerLevelPackage,
        );
        const _inputParams = this._swNavigator.getParams();
        _inputParams.selectedTab = "mediators";
        this.viewOptions.link = this._swNavigator.href(targetState, _inputParams);
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
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
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        widgetModel.webSource = "Desktop";
        widgetModel.metric = "DashboardAdNetworks";
        return widgetModel;
    }
}

WWOTopAdNetworksTableWidget.register();
