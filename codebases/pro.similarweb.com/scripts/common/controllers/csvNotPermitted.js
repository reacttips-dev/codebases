import angular from "angular";
import { swSettings } from "../services/swSettings";
import { SwTrack } from "../../../app/services/SwTrack";

angular.module("sw.common").controller("csvNotPermittedCtrl", function ($scope) {
    const ctrl = this;
    this.clickLink = function () {
        SwTrack.all.trackEvent("Upgrade", "click", "Table/Excel");
        window.open(swSettings.swurls.UpgradeAccountURL);
    };
    this.close = function () {
        SwTrack.all.trackEvent("Upgrade", "close", "Table/Excel");
        $scope.$$ttClose();
    };
});
