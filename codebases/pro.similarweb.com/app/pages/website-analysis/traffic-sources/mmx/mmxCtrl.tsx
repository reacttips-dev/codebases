import { IconButton } from "@similarweb/ui-components/dist/button";
import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import * as React from "react";
import DurationService from "services/DurationService";
import { channelAnalysisWidgetsConfig } from "./config.widgets";
import MMXMobileWebNotificationBar from "./components/MMXMobileWebNotificationBar";
import { IChannelAnalysisChartProps } from "./components/ChannelAnalysisChart/ChannelAnalysisChartContainer";
import { hasAccessToPackage } from "common/services/solutions2Helper";
import { SwTrack } from "services/SwTrack";

enum ChannelAnalysisTabs {
    "traffic_share",
    "avg_visit_duration",
    "pages_per_visit",
    "bounce_rate",
}

const Granularity = { 0: "Daily", 1: "Weekly", 2: "Monthly" };

angular
    .module("websiteAnalysis")
    .controller("MmxPageController", function (
        $scope,
        channelAnalysisFetcherFactory,
        widgetFactoryService,
        swNavigator,
        $timeout,
        chosenSites,
    ) {
        const webSources = [
            /* {
         value: 'Total',
         title: 'websources.total',
         buttonClass: 'toggle-website',
         iconClass: 'sw-icon-widget-total'
         },
         */
            {
                value: "Desktop",
                title: "websources.desktop",
                buttonClass: "toggle-website",
                iconClass: "desktop",
            },
            {
                value: "MobileWeb",
                title: "websources.mobileweb",
                buttonClass: "toggle-website",
                iconClass: "mobile-web",
            },
        ];

        return new (class MmxPageController {
            public widgets: any;
            public channelAnalysisManager: any;
            private isCompare: boolean;
            private isDurationCompare: boolean;
            private ChannelAnalysisChartContainerProps: IChannelAnalysisChartProps;
            private MMXMobileWebNotificationBar = () => <MMXMobileWebNotificationBar />;
            private keys: any = [];
            private dateSubTitle: string;
            public webSource: any;
            public activeTab = ChannelAnalysisTabs.traffic_share;
            private state = {
                allChannels: [],
                isCompare: chosenSites.isCompare(),
                selectedChannel: "Direct",
                metric: "TrafficSourcesOverview",
                controller: "MarketingMix",
                timeGranularity: "Monthly",
                availableGranularities: [],
                comparedDuration: swNavigator.getParams().comparedDuration,
            };

            constructor() {
                this.dateSubTitle = DurationService.getDurationData(
                    swNavigator.getParams().duration,
                ).forWidget as string;
                this.webSource =
                    _.find(
                        webSources,
                        (item) => item.value === swNavigator.getParams().webSource,
                    ) || webSources[0];
                this.keys = swNavigator
                    .getParams()
                    .key.split(",")
                    .map((website) => ({
                        id: website,
                        name: website,
                        image: chosenSites.getInfo(website).icon,
                        smallIcon: true,
                    }));
                this.isCompare = this.keys.length > 1;
                this.channelAnalysisManager = new channelAnalysisFetcherFactory(this.state);
                this.widgets = this.buildWidgets();
                this.isDurationCompare = !!this.state.comparedDuration;
                this.ChannelAnalysisChartContainerProps = {
                    ctrl: this,
                    durationService: DurationService,
                    swNavigator,
                    webSources,
                    chosenSites,
                } as IChannelAnalysisChartProps;

                $scope.$watch("ctrl.state.selectedChannel", (newVal, oldVal) => {
                    if (newVal !== oldVal && oldVal !== null) {
                        const newWidgets: any = this.buildWidgets();
                        this.widgets.channelEngagements = newWidgets.channelEngagements;
                    }
                });
            }

            public selectGranularity = (selected) => {
                this.state.timeGranularity = Granularity[selected];
                $scope.$evalAsync(() => {
                    this.channelAnalysisManager = new channelAnalysisFetcherFactory(this.state);
                    const newWidgets: any = this.buildWidgets();
                    this.widgets.channelEngagements = newWidgets.channelEngagements;
                });
                SwTrack.all.trackEvent(
                    "Time Frame Button",
                    "switch",
                    "Over Time Graph" + "/" + this.state.metric + "/" + this.state.timeGranularity,
                );
            };

            public getSwitcherComponent = () => {
                let selectedIndex = 2;

                const { duration } = swNavigator.getParams();
                const durationRaw = DurationService.getDurationData(duration).raw;
                const monthDiff = durationRaw.to.diff(durationRaw.from, "months");

                if (monthDiff <= 1 && this.state.availableGranularities.includes("Daily")) {
                    //also checks if daily granularity isn't disabled (e.g. on April 2017)
                    selectedIndex = 0;
                    this.selectGranularity(selectedIndex);
                }

                const gran = [
                    { title: "D", disabled: !this.state.availableGranularities.includes("Daily") },
                    { title: "W", disabled: !this.state.availableGranularities.includes("Weekly") },
                    {
                        title: "M",
                        disabled: !this.state.availableGranularities.includes("Monthly"),
                    },
                ];
                if (!gran) {
                    return null;
                }
                return (
                    <SwitcherGranularityContainer
                        itemList={gran}
                        selectedIndex={selectedIndex}
                        onItemClick={this.selectGranularity}
                        customClass={"CircleSwitcher"}
                    />
                );
            };

            public getExcelComponent = () => {
                const apiParams = swNavigator.getApiParams();
                const { duration } = swNavigator.getParams();
                const durationData = DurationService.getDurationData(
                    duration,
                    apiParams.comparedDuration,
                    swSettings.current.componentId,
                    false,
                );
                const { compareFrom, compareTo } = durationData.forAPI;
                const requestParams = (params: { [key: string]: any }): string => {
                    return _.toPairs(params)
                        .map(
                            ([key, value]) =>
                                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
                        )
                        .join("&");
                };
                const key = apiParams.key.split(",")[0];

                const excelParams = requestParams({
                    country: apiParams.country,
                    from: apiParams.from,
                    compareTo,
                    compareFrom,
                    includeSubDomains: !apiParams.isWWW,
                    isWindow: apiParams.isWindow,
                    keys: key,
                    timeGranularity: this.state.timeGranularity,
                    to: apiParams.to,
                });

                const excelUrl = `/widgetApi/MarketingMix/TrafficSourcesOverview/Excel?${excelParams}`;

                function trackExcelDownload() {
                    SwTrack.all.trackEvent("Download", "submit-ok", "Over Time Graph/Excel");
                }

                return (
                    <DownloadExcelContainer href={excelUrl} onClick={trackExcelDownload.bind(this)}>
                        <IconButton iconName="excel" type="flat" />
                    </DownloadExcelContainer>
                );
            };

            public createWidget(widgetConfig, widgetGroupName) {
                const { duration, country, isWWW, comparedDuration } = swNavigator.getParams();
                const widgetsDynamicProperties = {
                    key: this.keys.slice(),
                    duration,
                    country,
                    isWWW,
                    comparedDuration,
                    webSource: this.webSource.value,
                };
                const targetConfig: any = _.merge({}, widgetConfig, {
                    properties: widgetsDynamicProperties,
                });
                if (widgetGroupName === "channelEngagements") {
                    targetConfig.widgetDataFetcher = this.channelAnalysisManager;
                }
                if (widgetConfig.type === "MmxTrafficSourcesTable") {
                    targetConfig.properties.options.showLegend = this.state.isCompare;
                }
                targetConfig.selectedChannel = this.state.selectedChannel;
                targetConfig.timeGranularity = this.state.timeGranularity;
                targetConfig._apiController = this.state.controller;
                return widgetFactoryService.create(targetConfig);
            }

            public addEngagementControllerState(widgetConfig) {
                angular.extend(widgetConfig, {
                    selectedChannel: this.state.selectedChannel,
                    timeGranularity: this.state.timeGranularity,
                });
                widgetConfig.properties.engagementControllerState = this.state;
                widgetConfig._apiController = this.state.controller;
            }

            public buildWidgets() {
                const { webSource, isWWW } = swNavigator.getParams();
                const includeSubDomains = isWWW === "*";
                const config = channelAnalysisWidgetsConfig(
                    this.isCompare,
                    this.state.comparedDuration,
                    webSource,
                    includeSubDomains,
                    swNavigator.getPackageName(swNavigator.current()) === "marketresearch" &&
                        hasAccessToPackage("digitalmarketing"),
                );

                return _.mapValues(config, (widgetGroupConfig, widgetGroupName) => {
                    return _.mapValues(widgetGroupConfig, (widgetConfig: any, widgetName) => {
                        this.addEngagementControllerState(widgetConfig);
                        switch (widgetGroupConfig) {
                            default:
                                return this.createWidget(widgetConfig, widgetGroupName);
                        }
                    });
                });
            }

            public isActive(channelName) {
                return _.snakeCase(channelName) === ChannelAnalysisTabs[this.activeTab];
            }
        })();
    } as ng.Injectable<ng.IControllerConstructor>);
