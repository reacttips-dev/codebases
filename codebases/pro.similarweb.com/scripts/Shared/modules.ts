import angular from "angular";
import * as angularInview from "angular-inview";
import ngRedux from "ng-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { UI_ROUTER_REACT_HYBRID } from "@uirouter/react-hybrid";
import { Visualizer } from "@uirouter/visualizer";
import { isDevToolsOpen } from "services/dev-toggle/devToggle";

declare const SW_ENV: { debug: boolean };
export interface IDefaultParams {
    duration: string;
    country: string;
    category: string;
}

export const defaultParams: IDefaultParams = {
    duration: "6m",
    country: "999",
    category: "All",
};

export const monthIntervals = [1, 3, 6, 12, 18, 24];
export const monthIntervalsShort = [1, 2, 3];
export const weekIntervals = [1, 2, 3];

angular.module("ui.bootstrap", [
    "ui.bootstrap.modal",
    "ui.bootstrap.tabs",
    "ui.bootstrap.typeahead",
    "ui.bootstrap.popover",
    "ui.bootstrap.tpls",
    "ui.bootstrap.dropdown",
]);
angular
    .module("ui", [
        "ui.bootstrap",
        "ui.select2",
        "ui.router",
        "ui.router.state.events",
        UI_ROUTER_REACT_HYBRID,
    ])
    .value("uiSelect2Config", {
        allowClear: true,
        minimumResultsForSearch: 10,
        dropdownAutoWidth: true,
        width: "element",
    })
    .config(($modalProvider) => {
        // ui-bootstrap 0.13 has issues with new animation interface of angular 1.4
        // temporary disabling them for modals here
        $modalProvider.options.animation = false;
    })
    .config([
        "$uiRouterProvider",
        ($uiRouterProvider) => {
            if (isDevToolsOpen()) {
                $uiRouterProvider.plugin(Visualizer);
            }
        },
    ]);

angular.module("sw", [
    "sw.common",
    "sw.home",
    "sw.apps",
    "sw.keywords",
    "sw.topapps",
    "websiteAnalysis",
    "industryAnalysis",
    "gridster",
    "keywordAnalysis",
    "sw.form",
    "deepInsights",
]);

// module for development, used as a dependency to sw.env module only in dev environment
angular.module("sw.dev", ["ngMockE2E"]);

angular.module("sw.charts", []);

angular
    .module("sw.common", [
        ngRedux,
        "ui",
        "ngResource",
        "ngAnimate",
        "ngSanitize",
        "ngRoute",
        "sun.scrollable",
        "ngCookies",
        "sw.charts",
        angularInview.name,
    ])
    .constant("nanoScrollerDefaults", {
        nanoClass: "sw-scroller",
        contentClass: "sw-scroller-content",
        paneClass: "sw-scroller-pane",
        sliderClass: "sw-scroller-slider",
    });

angular.module("sw.home", ["sw.common"]);

angular.module("sw.apps", ["sw.common"]);

angular.module("sw.keywords", ["sw.common"]);

angular.module("sw.mediabuy", ["sw.common"]);

angular.module("sw.topapps", ["sw.common"]);

angular.module("sw.form", ["sw.common"]);

angular
    .module("shared", ["ngRoute", "sw.common"])
    .value("chosenDataGetter", {
        get: () => {
            return null;
        },
    })
    .filter("getFromToText", (swNavigator) => {
        return (val) => {
            return (
                val +
                " " +
                DurationService.getDurationData(swNavigator.getParams().duration).forTitle
            );
        };
    });

angular.module("keywordAnalysis", ["ngSanitize", "ui", "shared", "ngResource"]);

angular.module("website", ["ngSanitize", "ui", "shared", "ngResource"]);

angular.module("websiteAnalysis", ["ngSanitize", "ui", "shared", "ngResource"]);

angular.module("industryAnalysis", ["ngSanitize", "ui", "shared", "ngResource"]);

angular.module("topSites", []);

angular.module("category", []);

angular.module("deepInsights", ["ui", "shared", "ngResource"]);

angular.module("sw.common").directive("swTracker", () => {
    return {
        restrict: "A",
        scope: {
            swTrackerCategory: "@",
            swTrackerAction: "@",
            swTrackerLabel: "@",
        },
        link: function postLink(scope, elem, attr) {
            const analyticsAction = scope.swTrackerAction || "click";

            elem.on("click", () => {
                allTrackers.trackEvent(
                    scope.swTrackerCategory,
                    analyticsAction,
                    scope.swTrackerLabel,
                );
            });
        },
    };
});
