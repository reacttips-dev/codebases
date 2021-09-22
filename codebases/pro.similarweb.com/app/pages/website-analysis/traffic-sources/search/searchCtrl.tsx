import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import I18n from "components/React/Filters/I18n";
import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "services/SwTrack";

enum Tabs {
    overview,
    keywords,
    ads,
    phrases,
    plaResearch,
}
angular
    .module("websiteAnalysis")
    .controller("SearchPageController", function (
        $scope,
        swNavigator,
        i18nFilter,
        $controller,
        legendItems,
        $timeout,
        $rootScope,
        chosenSites,
        $ngRedux,
    ) {
        return new (class SearchPageController {
            private selections = { tab: null };
            private mobileWebSearchEnabled = true;
            private Keywords_filters: string;
            private Ads_filters: string;
            private devices = {
                desktop: "Desktop",
                mobile: "MobileWeb",
            };
            private isCompare;
            private webSources: any[];
            private webSource;
            private tabsHeadings: any;
            private pageTitle: string;

            constructor() {
                const params = swNavigator.getParams();
                // title for new sidenav re-org
                const pageTitles = {
                    overview:
                        i18nFilter("analysis.sources.search.title") +
                        " " +
                        i18nFilter(`analysis.search.overview.title`),
                    keywords: i18nFilter(`analysis.search.keywords.title`),
                    phrases: i18nFilter(`analysis.search.phrases.title`),
                    ads:
                        i18nFilter("analysis.sources.search.title") +
                        " " +
                        i18nFilter(`analysis.search.ads.title`),
                };
                this.pageTitle = pageTitles[params.selectedTab];
                this.tabsHeadings = this.getTabsHeadings();
                this.isCompare = chosenSites.isCompare();
                this.webSources = this.getWebSources();
                const webSourceFromParams = params.webSource;
                this.webSource = (
                    (webSourceFromParams &&
                        _.find(this.webSources, (item) => item.value === webSourceFromParams)) ||
                    this.webSources[0]
                ).value;
                this.selections.tab = params.selectedTab;
                this.Keywords_filters = params.Keywords_filters;
                this.Ads_filters = params.Ads_filters;
                $scope.legendItems = legendItems;
                if (this.validateParams() && this.validateCurrentTab()) {
                    $scope.$on("navUpdate", (event, toState, toParams, navType) => {
                        this.selections.tab = toParams.selectedTab;
                        this.webSource = toParams.webSource;
                        this.Keywords_filters = toParams.Keywords_filters;
                        this.Ads_filters = toParams.Ads_filters;
                    });
                    $scope.$watch("ctrl.webSource", (newVal, oldVal) => {
                        if (newVal !== oldVal) {
                            const newParams = { ...swNavigator.getParams(), webSource: newVal };
                            switch (newVal) {
                                case "MobileWeb":
                                    if (oldVal === "Desktop") {
                                        newParams.Keywords_filters = "OP;==;0";
                                        newParams.isWWW = "*";
                                    }
                                    break;
                                case "Desktop":
                                    if (oldVal === "MobileWeb") {
                                        newParams.Keywords_filters = null;
                                    }
                                    break;
                            }
                            if (this.validateCurrentTab(undefined, newParams)) {
                                // if currentTab policy is fine need to handle reload here
                                // otherwise the reload will occur in validateCurrentTab()
                                $timeout(function () {
                                    $scope.$destroy();
                                });
                                swNavigator.go(swNavigator.current().name, newParams, {
                                    reload: true,
                                });
                            }
                        }
                    });
                    $scope.$watch("ctrl.selections.tab", (newVal, oldVal) => {
                        if (newVal !== oldVal) {
                            this.validateCurrentTab();
                        }
                    });
                    $scope.$watchGroup(
                        ["ctrl.Keywords_filters", "ctrl.Ads_filters"],
                        this.initOldController.bind(this),
                    );
                }
            }

            private getWebSources() {
                const params = swNavigator.getParams();
                return [
                    {
                        value: this.devices.desktop,
                        title: i18nFilter("toggler.title.desktop"),
                        iconClass: "desktop",
                        disabled: false,
                    },
                    {
                        value: this.devices.mobile,
                        title: i18nFilter("toggler.title.mobile"),
                        iconClass: "mobile-web",
                        disabled: !this.hasMobileWebData(params),
                        //isMobileWebBeta: true
                    },
                ];
            }

            validateParams() {
                const newParams = swNavigator.getParams();
                const webSources: any = this.webSources;
                let isValid = true;
                // check if webSource url param is invalid.
                if (
                    !newParams.webSource ||
                    !webSources.map(({ value }) => value).includes(newParams.webSource)
                ) {
                    newParams.webSource = webSources[0].value;
                    isValid = false;
                }
                if (!isValid) {
                    $timeout(() => {
                        return swNavigator.go(swNavigator.current(), newParams, { reload: true });
                    });
                }
                return isValid;
            }

            validateCurrentTab(
                currentTab = this.selections.tab,
                currentParams = swNavigator.getParams(),
            ) {
                let isValid = true;
                const newParams = { ...currentParams };
                //check if tab param in url  is not valid
                if (isNaN(Tabs[newParams.selectedTab] as any)) {
                    newParams.selectedTab = "overview";
                    isValid = false;
                }
                //check if current tab is 'keywords' and websource is 'MobileWeb' and OP !== 0
                if (currentTab === "keywords" && this.webSource === "MobileWeb") {
                    const { Keywords_filters } = swNavigator.getParams();
                    if (Keywords_filters !== "OP;==;0") {
                        isValid = false;
                        newParams.Keywords_filters = "OP;==;0";
                    }
                }
                if (!isValid) {
                    $timeout(() => {
                        return swNavigator.go(swNavigator.current(), newParams, { reload: true });
                    });
                }
                return isValid;
            }

            onTabSelected(index) {
                const preservedParams: any = ["country", "duration", "isWWW", "key", "webSource"];
                const targetTab = Tabs[index];
                if (targetTab === "keywords") {
                    preservedParams.push("Keywords_filters");
                }
                const params = {
                    ..._.mapValues(swNavigator.getParams(), (currentParamValue, key) => {
                        let newParamValue = null;
                        if (preservedParams.includes(key)) {
                            newParamValue = currentParamValue;
                        }
                        return newParamValue;
                    }),
                    selectedTab: Tabs[index],
                };
                SwTrack.all.trackEvent("Tab", "click", "Table/" + Tabs[index]);
                swNavigator.go(swNavigator.current(), params);
            }

            get activeTab() {
                return Tabs[this.selections.tab];
            }

            initOldController() {
                $scope.oldCtrlScope = null;
                $timeout(() => {
                    const oldCtrlScope = ($scope.oldCtrlScope = $scope.$new());
                    oldCtrlScope.isNestedController = true;
                    // $controller('TrafficSearchCtrl as ctrl', {$scope: oldCtrlScope, data});
                });
            }

            hasMobileWebData({ duration, country }) {
                return (
                    swSettings.allowedDuration(duration, "MobileWebSearch") &&
                    swSettings.allowedCountry(country, "MobileWebSearch")
                );
            }

            getTabsHeadings() {
                return {
                    overview: () => (
                        <PlainTooltip text="analysis.source.search.tabs.overview">
                            <p className="sw-icon-history">
                                <I18n>analysis.source.search.tabs.title.overview</I18n>
                            </p>
                        </PlainTooltip>
                    ),
                    keywords: () => (
                        <PlainTooltip text="analysis.source.search.tabs.keywords">
                            <p className="sw-icon-keywords-list">
                                <I18n>analysis.source.search.tabs.title.keywords</I18n>
                            </p>
                        </PlainTooltip>
                    ),
                    ads: () => (
                        <PlainTooltip text="analysis.source.search.tabs.ads">
                            <p className="sw-icon-nav-paid">
                                <I18n>analysis.source.search.tabs.title.ads</I18n>
                            </p>
                        </PlainTooltip>
                    ),
                    phrases: () => (
                        <PlainTooltip text="analysis.source.search.tabs.phrases">
                            <p className="sw-icon-audience">
                                <I18n>analysis.source.search.tabs.title.phrases</I18n>
                            </p>
                        </PlainTooltip>
                    ),
                };
            }
        })();
    } as ng.Injectable<ng.IControllerConstructor>);
