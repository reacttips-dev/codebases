import angular from "angular";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { isGAOn } from "services/GAService";
import widgetSettings from "components/dashboard/WidgetSettings";
import { dynamicFilterFilter } from "filters/dynamicFilter";

export interface IGraphTab {
    title: string | any;
    icon: string;
    format: string;
    id: string;
    metric: string;
    granularityRestriction?: string;
    tooltip?: string;
    beta?: boolean;
    new?: boolean;
}
export class SWWidget {
    public static widgetUtilityGraphTabs: angular.IComponentOptions = {
        bindings: {
            utility: "=",
            widget: "=",
        },
        template: `<sw-graph-tabs tabs="ctrl.tabs" selected-tab="ctrl.selectedTab" is-compare="ctrl.isCompare" is-ready="ctrl.isReady" track-name="ctrl.widget._widgetConfig.properties.trackName"></sw-graph-tabs>`,
        controllerAs: "ctrl",
        controller($scope, widgetResource, $filter, widgetModelAdapterService, $ngRedux) {
            const ctrl = this;
            const utilityParams: any = {};
            utilityParams[ctrl.utility.properties.param] = ctrl.utility.properties.default;
            const params: any = Object.assign({}, ctrl.widget.apiParams, utilityParams);
            params.timeGranularity = "Monthly";
            params.ShouldGetVerifiedData = isGAOn();
            if (this.widget._widgetConfig.properties.duration === "28d") {
                params.timeGranularity = "Daily";
            }
            delete params.metric;
            let resource = widgetResource
                .resourceByController(
                    ctrl.utility.properties.apiController,
                    ctrl.utility.properties.default,
                )
                [ctrl.utility.properties.resource](params);
            let legendData: any;
            // in category
            if (ctrl.widget.apiParams.keys[0] === "$") {
                ctrl.isCompare = false;
            } else {
                ctrl.isCompare = ctrl.widget.apiParams.keys.split(",").length > 1;
            }

            ctrl.isReady = false;

            ctrl.tabs = createTabs(ctrl.utility, this.widget._widgetConfig.properties.duration);
            ctrl.selectedTab = _.find(ctrl.tabs, {
                metric: ctrl.widget._widgetConfig.properties.metric,
            });
            $scope.$watch("ctrl.selectedTab", (newVal, oldVal) => {
                const updateWidgetParams = () => {
                    let webSource = ctrl.widget.apiParams.webSource;
                    if (
                        ctrl.widget.apiParams.webSource === "Total" ||
                        ctrl.widget.apiParams.webSource === "Combined"
                    ) {
                        // set default to 'Total'
                        webSource = "Total";

                        // change to 'Combined' if all conditions are true:
                        // 1. single mode
                        // 2. user have mobile-web permission
                        // 3. graph is not in 'line' toggle

                        // and one of this conditions is true
                        // 3. metric is using 'Combined' instead of 'Total'
                        // 4. metric is *not* using 'Combined' instead of 'Total' AND no period over period
                        const isSingleMode = ctrl.widget.apiParams.keys.split(",").length === 1;
                        const isMobileWebPermitted = swSettings.components.MobileWeb.isAllowed;
                        const notInLineToggle = this.widget.chartType !== "line";
                        const isCombinedinsteadOfTotal = widgetSettings.getMetricProperties(
                            newVal.metric,
                        ).useCombinedInsteadOfTotal;
                        const isPeriodOverPeriod = !_.isEmpty(ctrl.widget.apiParams.compareFrom);

                        if (isSingleMode && isMobileWebPermitted && notInLineToggle) {
                            if (isCombinedinsteadOfTotal !== false) {
                                if (isCombinedinsteadOfTotal || !isPeriodOverPeriod) {
                                    webSource = "Combined";
                                }
                            }
                        }
                    }
                    const paramsToUpdate: any = {
                        metric: newVal.metric,
                        webSource,
                        apiController: newVal.apiController,
                    };

                    // Update widget properties (for the "add to dashboard" feature)
                    ctrl.widget._widgetConfig.properties.metric = paramsToUpdate.metric;
                    ctrl.widget._widgetConfig.properties.apiController =
                        paramsToUpdate.apiController;
                    ctrl.widget._widgetConfig.properties.webSource =
                        webSource === "Combined" ? "Total" : webSource;
                    ctrl.widget._metricConfig.dashboard = widgetSettings.getMetricProperties(
                        paramsToUpdate.metric,
                    ).dashboard;

                    // this code used for disabling the ga-verify label in certain cases only.
                    const gaVerifyUtility: any = _.find(ctrl.widget.utilityGroups[1].utilities, {
                        id: "ga-verify",
                    });
                    if (gaVerifyUtility) {
                        if (newVal.hideGaVerify) {
                            gaVerifyUtility.hideUtility = true;
                        } else {
                            gaVerifyUtility.hideUtility = false;
                        }
                    }

                    // this code used for disabling the time granularity buttons in certain cases only.
                    const granularityUtility: any = _.find(ctrl.widget.utilityGroups[1].utilities, {
                        id: "time-granularity",
                    });
                    if (granularityUtility) {
                        if (newVal.granularityRestriction) {
                            paramsToUpdate.timeGranularity = newVal.granularityRestriction;
                            granularityUtility.hideUtility = true;
                        } else {
                            granularityUtility.hideUtility = false;
                        }
                    }

                    ctrl.widget.mergeViewData({ title: i18nFilter()(newVal.title) });
                    ctrl.widget.apiParams = paramsToUpdate;
                };
                let shouldUpdateParams = true;
                if (ctrl.widget.onTabSelected) {
                    shouldUpdateParams = ctrl.widget.onTabSelected(newVal);
                }
                if (shouldUpdateParams) {
                    updateWidgetParams();
                    getData();
                }
                setUtilityData(newVal);
                if (newVal.cache === false) {
                    ctrl.widget.clearWidgetCache();
                }
                if (ctrl.isCompare && legendData) {
                    updateLegend();
                }
            });
            const unsubscribe = $ngRedux.subscribe(() => {
                const {
                    common: { showGAApprovedData },
                } = $ngRedux.getState();
                if (showGAApprovedData !== ctrl.widget.apiParams.ShouldGetVerifiedData) {
                    const requiredTimeGranularity =
                        this.widget._widgetConfig.properties.duration === "28d"
                            ? "Daily"
                            : "Monthly";

                    $scope.$evalAsync(() => {
                        ctrl.widget._params = {
                            ...ctrl.widget.apiParams,
                            ShouldGetVerifiedData: showGAApprovedData,
                        };
                        resource = widgetResource
                            .resourceByController(
                                ctrl.utility.properties.apiController,
                                ctrl.utility.properties.default,
                            )
                            [ctrl.utility.properties.resource]({
                                ...ctrl.widget.apiParams,
                                timeGranularity: requiredTimeGranularity,
                            });
                        if (ctrl.selectedTab.id === "DedupUniqueUsers") {
                            ctrl.selectedTab = ctrl.tabs[0];
                            return;
                        }
                        getData();
                    });
                }
            });

            $scope.$on("$destroy", unsubscribe);

            function getData() {
                resource.$promise.then((response) => {
                    legendData = response.Data;
                    ctrl.widget.mergeGAVerifiedFlag(response);
                    setUtilityData(ctrl.selectedTab);
                    const keys = ctrl.widget._params.keys.split(",");
                    let isGAVerified = false;
                    for (let i = 0; i < keys.length; i++) {
                        if (response.KeysDataVerification[keys[i]]) {
                            isGAVerified = true;
                            break;
                        }
                    }
                    const tabs: any = createTabs(
                        ctrl.utility,
                        ctrl.widget._widgetConfig.properties.duration,
                    );
                    if (!ctrl.isCompare) {
                        const source =
                            ctrl.widget.apiParams.webSource === "Combined"
                                ? "Total"
                                : ctrl.widget.apiParams.webSource || "Desktop";
                        const dataBySource = _.find(legendData, { Source: source });
                        if (dataBySource) {
                            angular.forEach(tabs, (tab) => {
                                tab.value = dataBySource[tab.id];
                                tab.isGAVerified = legendData[0].isGAVerified;
                                tab.isGAPrivate = legendData[0].isGAPrivate;
                            });
                        }
                    }
                    if (isGAVerified) {
                        _.remove(tabs, (tab: any) => {
                            return tab.metric === "EngagementDedup";
                        });
                    }
                    ctrl.tabs = tabs;
                    updateLegend();
                    ctrl.isReady = true;
                });
            }

            function createTabs(utility, duration) {
                const tabs = _.map(utility.properties.tabs, (tab: IGraphTab) => {
                    const tabCopy: IGraphTab = _.clone(tab);
                    if (duration === "28d") {
                        tabCopy.title = tabCopy.title.window;
                    } else {
                        tabCopy.title = tabCopy.title.snapshot;
                    }
                    return tabCopy;
                });
                return tabs;
            }

            function updateLegend() {
                const data: any = legendData;
                angular.forEach(ctrl.widget.viewData.key, (legend, i) => {
                    const domainData: any = _.find(data, { Domain: legend.name });
                    const metric: any = _.find(ctrl.tabs, { metric: ctrl.selectedTab.metric });
                    if (domainData) {
                        legend.data = domainData[metric.id];
                        legend.format = metric.format;
                        legend.isGAVerified = legendData[i].isGAVerified;
                        legend.isGAPrivate = legendData[i].isGAPrivate;
                    }
                });
            }

            function setUtilityData(tab) {
                const metricesValues = [];
                const source =
                    ctrl.widget.apiParams.webSource === "Combined"
                        ? "Total"
                        : ctrl.widget.apiParams.webSource || "Desktop";
                const items = _.filter(legendData, { Source: source });
                // add data for requested domains to the widget utility data
                angular.forEach(ctrl.widget.apiParams.keys.split(","), (domain, index) => {
                    const item = _.find(items, { Domain: domain });
                    // if domains doesn't have data, add an empty string (for PNG export porpuse)
                    if (item) {
                        const format =
                            tab.format === "noFractionNumber" ? "abbrNumber" : tab.format;
                        metricesValues.push(dynamicFilterFilter()(item[tab.id], format));
                    } else {
                        metricesValues.push("");
                    }
                });
                ctrl.widget.setUtilityData(ctrl.utility.id, metricesValues);
            }
        },
    };
}

angular.module("sw.common").component("swWidgetUtilityGraphTabs", SWWidget.widgetUtilityGraphTabs);
