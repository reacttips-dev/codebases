import angular, { IController } from "angular";
import * as TrafficSourcesSearchWidgetsConfig from "../config.widgets";
import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

enum ChannelAnalysisTabs {
    "traffic_share",
    "avg_visit_duration",
    "pages_per_visit",
    "bounce_rate",
}

export class SearchTabOverviewController implements IController {
    private keys;
    private widgets: any = { overview: {}, channelEngagements: {} };
    private isCompare;
    private isMobileWeb;
    public activeTab = ChannelAnalysisTabs.traffic_share;
    public channelAnalysisManager;
    private state;

    constructor(
        private swNavigator,
        private chosenSites,
        private widgetFactoryService,
        private channelAnalysisFetcherFactory,
    ) {
        this.keys = this.swNavigator
            .getParams()
            .key.split(",")
            .map((website) => ({
                id: website,
                name: website,
                image: this.chosenSites.getInfo(website).icon,
            }));
        this.isCompare = this.chosenSites.isCompare();
        this.isMobileWeb = this.swNavigator.getParams().webSource === "MobileWeb";
        this.state = {
            allChannels: [],
            isCompare: this.isCompare,
            selectedChannel: "Organic Search",
            metric: "SearchOrganicPaidOverview",
            controller: "TrafficSourcesSearch",
        };
        this.channelAnalysisManager = new this.channelAnalysisFetcherFactory(this.state);
        _.forEach(
            TrafficSourcesSearchWidgetsConfig.overview,
            (widgetConfig: any, widgetName: string) => {
                let _widgetConf = {};
                if (this.isCompare) {
                    _widgetConf = widgetConfig.compare ? widgetConfig.compare : null;
                } else {
                    _widgetConf = widgetConfig.single ? widgetConfig.single : null;
                }

                if (_widgetConf) this.widgets.overview[widgetName] = this.createWidget(_widgetConf);
            },
        );
    }

    $onInit() {}

    private createWidget(widgetConfig, widgetGroupName?) {
        const { duration, country, isWWW } = this.swNavigator.getParams();
        const widgetsDynamicProperties = {
            key: this.keys.slice(),
            duration,
            country,
            isWWW,
            webSource: this.swNavigator.getParams().webSource,
        };
        const targetConfig: any = _.merge({}, widgetConfig, {
            properties: {
                ...widgetsDynamicProperties,
                engagementControllerState: this.state,
            },
        });
        if (widgetGroupName) {
            targetConfig.widgetDataFetcher = this.channelAnalysisManager;
            targetConfig._apiController = this.state.controller;
        }
        return this.widgetFactoryService.create(targetConfig);
    }

    private onTabSelected(tabIndex: number) {
        this.activeTab = ChannelAnalysisTabs[ChannelAnalysisTabs[tabIndex]];
        const widgetInFocus =
            TrafficSourcesSearchWidgetsConfig.channelEngagements[
                _.camelCase(ChannelAnalysisTabs[tabIndex])
            ];
        SwTrack.all.trackEvent(
            "Metric Button",
            "click",
            "Over Time Graph/Channel Analysis/" + widgetInFocus.properties.trackName,
        );
        this.widgets.channelEngagements[
            _.camelCase(ChannelAnalysisTabs[tabIndex])
        ] = this.createWidget(widgetInFocus, "channelEngagements");
    }

    private isActive(channelName) {
        return _.snakeCase(channelName) === ChannelAnalysisTabs[this.activeTab];
    }

    private getKeywordsUrl() {
        return this.swNavigator.getStateUrl(
            "websites-competitorsOrganicKeywords",
            Object.assign({}, this.swNavigator.getParams(), { selectedTab: null }),
        );
    }

    // private changeChannelMetric(item) {
    //     this.state.selectedChannel = item.text;
    //     this.buidlChannelEngagementsWidgets();
    // }

    // private buidlChannelEngagementsWidgets() {
    //     _.forEach(TrafficSourcesSearchWidgetsConfig.channelEngagements, (widgetConfig: any, widgetName: string) => {
    //         this.widgets.channelEngagements[widgetName] = this.createWidget(widgetConfig, true);
    //     });
    // }
}

class SearchTabOverview implements ng.IComponentOptions {
    public bindings: any = {};
    public templateUrl =
        "/app/pages/website-analysis/traffic-sources/search/tabs/search-tab-overview.html";

    public controller;

    constructor() {
        this.controller = SearchTabOverviewController;
    }
}
angular.module("sw.common").component("searchTabOverview", new SearchTabOverview());
