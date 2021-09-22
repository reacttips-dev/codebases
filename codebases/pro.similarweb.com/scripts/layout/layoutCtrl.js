/**
 * Created by ofers on 14-Jun-15.
 */
import angular from "angular";

angular.module("sw.common").controller("layoutCtrl", function ($scope, swNavigator) {
    /* API */
    var ctrl = this;
    ctrl.state = getCurrentState();

    ctrl.isDashboard = swNavigator.isDashboard(swNavigator.current());
    ctrl.showNavigation = swNavigator.current().name !== "keywordAnalysis-home";

    /* PRIVATE */
    function getCurrentState() {
        return angular.copy(swNavigator.current());
    }

    $scope.$on("navChangeComplete", function () {
        ctrl.state = getCurrentState();
    });
});
