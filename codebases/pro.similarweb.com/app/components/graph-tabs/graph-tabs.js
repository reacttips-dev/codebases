import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular.module("sw.common").directive("swGraphTabs", function () {
    return {
        restrict: "E",
        scope: {},
        bindToController: {
            tabs: "=",
            selectedTab: "=",
            isCompare: "=",
            isReady: "=",
            trackName: "=",
        },
        templateUrl: "/app/components/graph-tabs/graph-tabs.html",
        replace: true,
        controllerAs: "ctrl",
        controller: function ($scope) {
            const ctrl = this;
            ctrl.setSelected = function (tab) {
                $scope.$evalAsync(() => {
                    ctrl.selectedTab = tab;
                    SwTrack.all.trackEvent("Metric Button", "click", ctrl.trackName + "/" + tab.id);
                });
            };
        },
    };
});
