import angular from "angular";
import * as _ from "lodash";
import { BarChartWidget } from "./BarChartWidget";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { SwTrack } from "services/SwTrack";

export class WWOTrafficSourcesBarWidget extends BarChartWidget {
    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "BarChart";
    }

    static getWidgetResourceType() {
        return "BarChart";
    }

    constructor() {
        super();
    }

    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-trafficOverview",
            [this._swNavigator.getPackageName(this._swNavigator.current())],
            this._swNavigator,
        );
        this.viewOptions.link = this._swNavigator.href(targetState, {
            ...this._swNavigator.getParams(),
            selectedTab: "overview",
        });
        this.viewOptions.hook = {
            component: "WsWebTrafficChannels",
            hookModal: "WebTrafficChannelsFeature",
        };
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }

    callbackOnGetData(response: any) {
        super.callbackOnGetData(response);
        this.chartConfig = angular.merge(this.chartConfig, {
            options: {
                chart: {
                    marginLeft: 0,
                },
                yAxis: {
                    visible: false,
                },
            },
        });
        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
    }

    get templateUrl() {
        return "/app/components/widget/widget-templates/barchart.html";
    }

    buildLinkUrl() {
        return false;
    }

    //hack for tracking on the link click
    onWidgetMount($el) {
        $el.on("click", "[data-ts-category]", (evt) => {
            const trafficSource = evt.target.getAttribute("data-ts-category");
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                `Marketing Mix/Channels Overview/${trafficSource}`,
            );
        });
    }

    getWidgetModel() {
        const widgetModel = super.getWidgetModel();
        widgetModel.type = "BarChart";
        widgetModel.webSource = "Desktop";
        return widgetModel;
    }
}

WWOTrafficSourcesBarWidget.register();
