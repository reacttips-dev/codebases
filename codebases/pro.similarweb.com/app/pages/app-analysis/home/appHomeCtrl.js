import angular from "angular";
import * as _ from "lodash";

angular
    .module("sw.apps")
    .controller("appHomeCtrl", function ($scope, $filter, swConnectedAccountsService) {
        $scope.showAvailableAppsIntro = swConnectedAccountsService.getUiOptions().showAvailableAppsIntro;

        $scope.topAndroidOptions = Object.assign({}, $scope.defaultTableOptions);
        $scope.topAndroidOptions.showFooter = true;

        $scope.topIosOptions = Object.assign({}, $scope.defaultTableOptions);
        $scope.topIosOptions.showFooter = true;

        $scope.trendingTabMode = "android";

        // updates on every state change
        $scope.$on("$stateChangeSuccess", function (evt, toState, toParams, fromState, fromParams) {
            document.title = $filter("i18n")("titleTag.mobileapps");
        });
    });
