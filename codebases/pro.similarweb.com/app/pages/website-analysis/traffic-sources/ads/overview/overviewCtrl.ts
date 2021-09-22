import TotalVisitsSingle from "./widgets/TotalVisitsSingle";
import TotalVisitsCompare from "./widgets/TotalVisitsCompare";
import TopPublishersSingle from "./widgets/TopPublishersSingle";
import TopPublishersCompare from "./widgets/TopPublishersCompare";
import TopMediatorsSingle from "./widgets/TopMediatorsSingle";
import TopMediatorsCompare from "./widgets/TopMediatorsCompare";
import TrafficShare from "./widgets/TrafficShare";
import AvgVisitDuration from "./widgets/AvgVisitDuration";
import PagesPerVisit from "./widgets/PagesPerVisit";
import BounceRate from "./widgets/BounceRate";
import { getWidgetKey } from "components/widget/widgetUtils";
import PageSubtitleAndLegend from "components/React/PageSubtitleAndLegend/PageSubtitleAndLegend";
import DisplayAdsTrafficShare from "./widgets/TrafficShare";
import { SwTrack } from "services/SwTrack";

const engagementTabs = ["trafficShare", "avgVisitDuration", "pagesPerVisit", "bounceRate"];

export default class OverviewCtrl {
    widgets: any;
    private _activeTabIndex = 0;
    private state: any;

    constructor(
        private $scope: any,
        private chosenSites: any,
        private widgetFactoryService,
        private channelAnalysisFetcherFactory: any,
    ) {
        $scope.PageSubtitleAndLegend = PageSubtitleAndLegend;
        $scope.subTitleProps = {
            ...$scope.displayAdsPage.rawSelections,
        };
        const { rawSelections } = this.$scope.displayAdsPage;
        const params = {
            ...rawSelections,
            key: getWidgetKey(rawSelections.key),
            mode: this.chosenSites.isCompare() ? "compare" : "single",
        };
        this.state = {
            allChannels: ["Display Ads"],
            isCompare: this.isCompare,
            metric: "WebsiteAdsOverTimeOverview",
            selectedChannel: "Display Ads",
            controller: "WebsiteDisplayAds",
        };
        this.widgets = this.loadWidgets(params);
    }

    onTabSelected(tabIndex) {
        const currentTab = engagementTabs[this._activeTabIndex];
        const nextTab = engagementTabs[tabIndex];
        SwTrack.all.trackEvent(
            "Metric Button",
            "click",
            `Over Time Graph/display_and_video_engagement/${engagementTabs[tabIndex]}`,
        );
        this._activeTabIndex = tabIndex;
        this.notifyTabChange(currentTab, nextTab);
    }

    notifyTabChange(currentTab, nextTab) {
        Object.values<DisplayAdsTrafficShare>(this.widgets.channelEngagements).forEach((widget) =>
            widget.onTabChanged(currentTab, nextTab),
        );
    }

    get activateTab() {
        return this._activeTabIndex;
    }

    private isActive(channelName) {
        return engagementTabs.indexOf(channelName) === this.activateTab;
    }

    get isCompare() {
        return this.chosenSites.isCompare();
    }

    private getEngagementWidgetsParams(params) {
        const widgetDataFetcher = new this.channelAnalysisFetcherFactory(this.state, {
            resolveMetricNames: false,
        });
        return {
            ...params,
            engagementControllerState: { ...this.state },
            widgetDataFetcher,
            _apiController: this.state.controller,
        };
    }

    getEngagementWidgets(params) {
        const engagementWidgetsConfig = this.getEngagementWidgetsParams(params);
        return this.widgetFactoryService.createAllWithConfigs(engagementWidgetsConfig, {
            trafficShare: TrafficShare,
            avgVisitDuration: AvgVisitDuration,
            pagesPerVisit: PagesPerVisit,
            bounceRate: BounceRate,
        });
    }

    loadWidgets(params) {
        const { mode } = params;
        const channelEngagements = this.getEngagementWidgets(params);
        let restOfPageWidgets;
        switch (mode) {
            case "single":
                restOfPageWidgets = this.widgetFactoryService.createAllWithConfigs(params, {
                    totalVisits: TotalVisitsSingle,
                    topPublishers: TopPublishersSingle,
                    topMediators: TopMediatorsSingle,
                });
                break;
            case "compare":
                restOfPageWidgets = this.widgetFactoryService.createAllWithConfigs(params, {
                    totalVisits: TotalVisitsCompare,
                    topPublishers: TopPublishersCompare,
                    topMediators: TopMediatorsCompare,
                });
                break;
        }
        return {
            channelEngagements,
            ...restOfPageWidgets,
        };
    }

    static $inject = [
        "$scope",
        "chosenSites",
        "widgetFactoryService",
        "channelAnalysisFetcherFactory",
    ];
}
