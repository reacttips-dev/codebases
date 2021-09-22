import angular from "angular";
import autobind from "autobind-decorator";
import I18n from "components/React/Filters/I18n";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import * as React from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "../../../../services/fetchService";
import OverviewCtrl from "./overview/overviewCtrl";
import { SwTrack } from "services/SwTrack";

let tabs: any[] = null;

const DEFAULT_WEBSOURCE = "Desktop";
const DEFAULT_TAB = "overview";

export class AdsCtrl {
    public static $inject = [
        "swNavigator",
        "chosenSites",
        "i18nFilter",
        "$scope",
        "$timeout",
        "$controller",
    ];
    public rawSelections: any;
    public webSource: any;
    public tabsHeadings: any;
    public dirName = "/app/pages/website-analysis/traffic-sources/ads";
    private initializedOldController = false;
    private showCreativeModalUpsale: boolean;
    private fetchService: DefaultFetchService;

    constructor(
        private swNavigator: any,
        private chosenSites: any,
        private i18nFilter: any,
        private $scope: any,
        private $timeout: any,
        private $controller: any,
    ) {
        this.fetchService = DefaultFetchService.getInstance();
        tabs = this.getAvailableTabs();
        this.showCreativeModalUpsale = false;
        this.tabsHeadings = this.getTabsHeadings();
        this.$scope.$on("navChangeComplete", this.setParams);
        this.$scope.$on("navUpdate", this.setParams);
        this.setParams();
        this.bindPageControllers();
    }

    private getAvailableTabs() {
        return ["overview", "publishers"].reduce(
            (allTabs, tabName) => [
                ...allTabs,
                {
                    name: tabName,
                    loaded: false,
                },
            ],
            [],
        );
    }

    @autobind
    public setParams() {
        const { replaceHistory, ...nextParams } = this.reloadAllParams();
        if (replaceHistory) {
            this.$timeout(() => {
                if (!this.$scope.$$destroyed) {
                    this.swNavigator.go(this.swNavigator.current(), nextParams, {
                        location: "replace",
                        reload: true,
                    });
                }
            });
        } else {
            this.rawSelections = nextParams;
            tabs = tabs.map((tab) => {
                return tab.name === this.rawSelections.selectedTab
                    ? {
                          ...tab,
                          loaded: true,
                      }
                    : tab;
            });
            this.webSource = this.getAvailableWebSources().find(
                ({ value }) => value.toLowerCase() === this.rawSelections.webSource.toLowerCase(),
            );
            const { selectedTab } = this.rawSelections;
            if (selectedTab === "publishers") {
                this.loadOldController();
            }
        }
    }

    private reloadAllParams() {
        const { isValid: validTab, selectedTab } = this.getSelectedTabFromQuery();
        const { isValid: validWebSource, webSource } = this.getSelectedWebSourceFromQuery();
        return {
            ...this.swNavigator.getParams(),
            selectedTab,
            webSource,
            replaceHistory: !(validTab && validWebSource),
        };
    }

    private bindPageControllers() {
        this.$scope.OverviewCtrl = OverviewCtrl;
    }

    private getSelectedTabFromQuery() {
        let isValid = true;
        let { selectedTab } = this.swNavigator.getParams();
        if (!selectedTab || !tabs.some(({ name }) => name === selectedTab)) {
            selectedTab = DEFAULT_TAB;
            isValid = false;
        }
        return {
            selectedTab,
            isValid,
        };
    }

    private getSelectedWebSourceFromQuery() {
        let isValid = true;
        const availableWebSources = this.getAvailableWebSources();
        let { webSource, selectedTab } = this.swNavigator.getParams();
        if (
            !webSource ||
            !availableWebSources.find(
                ({ value }) => value.toLowerCase() === webSource.toLowerCase(),
            )
        ) {
            webSource = DEFAULT_WEBSOURCE;
            isValid = false;
        }
        return {
            webSource,
            isValid,
        };
    }

    get activeTabIndex() {
        return tabs.findIndex(({ name }) => name === this.rawSelections.selectedTab);
    }

    get durationTitle() {
        const { forWidget } = DurationService.getDurationData(this.rawSelections.duration);
        return forWidget;
    }

    get runMode() {
        return this.chosenSites.isCompare() ? "compare" : "single";
    }

    get isCompare() {
        return this.chosenSites.isCompare();
    }

    public onTabSelected(selectedTab) {
        const { name } = tabs[selectedTab];
        SwTrack.all.trackEvent("Tab", "click", `Display_page/${name}`);
        this.swNavigator.updateParams({ selectedTab: name });
    }

    public getAvailableWebSources() {
        return [
            {
                value: "Desktop",
                title: this.i18nFilter("toggler.title.desktop"),
                iconClass: "desktop",
                disabled: false,
            },
        ];
    }

    public isTabActiveOrLoaded(index) {
        return index === this.activeTabIndex || tabs[index].loaded;
    }

    public getTabsHeadings() {
        return {
            overview: () => (
                <PlainTooltip text="analysis.source.ads.tabs.overview.tooltip">
                    <p>
                        <I18n>analysis.source.ads.tabs.overview.title</I18n>
                    </p>
                </PlainTooltip>
            ),
            publishers: () => (
                <PlainTooltip text="analysis.source.ads.tabs.publishers.tooltip">
                    <p>
                        <I18n>analysis.source.ads.tabs.publishers.title</I18n>
                    </p>
                </PlainTooltip>
            ),
        };
    }

    @autobind
    public closeModal() {
        this.$scope.$apply(() => {
            this.showCreativeModalUpsale = false;
        });
    }

    public initOldController(trafficDisplayAdvertising, adNetworks) {
        this.$scope.$apply(() => {
            const oldCtrlScope = (this.$scope.oldCtrlScope = this.$scope.$new());
            oldCtrlScope.isNestedController = true;
            this.$controller("TrafficAdvertisingCtrl", {
                $scope: oldCtrlScope,
                trafficDisplayAdvertising,
                adNetworks,
            });
        });
    }

    public async loadOldController() {
        if (!this.initializedOldController) {
            this.initializedOldController = true;
            const {
                country,
                from,
                isWWW,
                isWindow,
                key,
                orderby,
                page,
                to,
                webSource,
            } = this.swNavigator.getApiParams({
                ...this.rawSelections,
                page: 1,
                orderby: "Share desc",
            });
            const params = {
                country,
                from,
                isWWW,
                isWindow,
                key,
                orderby,
                page,
                to,
                webSource,
            };
            const [res1, res2] = await Promise.all([
                this.fetchService.get(`/api/websiteanalysis/GetTrafficDisplayAdvertising`, params),
                this.fetchService.get(
                    `/api/websiteanalysis/GetTrafficDisplayAdvertisingAdsTable`,
                    params,
                ),
            ]);
            const [trafficDisplayAdvertising, adNetworks] = [res1, res2];
            this.initOldController(trafficDisplayAdvertising, adNetworks);
        }
    }
}

angular.module("shared").controller("adsCtrl", AdsCtrl as ng.Injectable<ng.IControllerConstructor>);
