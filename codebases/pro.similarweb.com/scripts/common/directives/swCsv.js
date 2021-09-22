import angular from "angular";
import { swSettings } from "../services/swSettings";
import ExcelClientDownload from "../../../app/components/React/ExcelButton/ExcelClientDownload";
import { SwTrack } from "../../../app/services/SwTrack";

angular.module("sw.common").directive("swCsv", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/partials/directives/sw-csv.html",
        compile: function (tElement) {
            return {
                pre: function ($scope) {
                    $scope.tooltipConfig = {
                        width: 260,
                        height: "auto",
                        minHeight: 120,
                        templateUrl: "/partials/common/csv-not-permitted.html",
                        controller: "csvNotPermittedCtrl",
                        controllerAs: "ctrl",
                        placement: "bottom",
                        appendToBody: false,
                        isolateScope: true,
                        cssClass: "csvNotPermittedTooltip",
                        disableTracking: true,
                    };

                    $scope.downloadPermitted = true;
                    $scope.exportToCsv = async () => {
                        try {
                            if ($scope.downloadPermitted) {
                                SwTrack.all.trackEvent("Download", "submit-ok", "Table/Excel");
                                if ($scope.useClientSideCsvDownload) {
                                    $scope.clientSideDownloadInProgress = true;
                                    $scope.$apply();
                                    const { success, error } = await ExcelClientDownload(
                                        $scope.downloadUrl,
                                    );
                                    $scope.$apply(() => {
                                        $scope.clientSideDownloadInProgress = false;
                                    });
                                } else {
                                    window.location = $scope.downloadUrl;
                                }
                            } else {
                                if (!$scope.showTooltip) {
                                    SwTrack.all.trackEvent(
                                        "Download",
                                        "not permitted",
                                        "Table/Excel",
                                    );
                                }
                                $scope.showTooltip = !$scope.showTooltip;
                            }
                        } catch (e) {}
                    };
                    if (!swSettings.current.resources.IsExcelAllowed) {
                        $scope.downloadPermitted = false;
                        $scope.downloadUrl = "";
                    }
                },
            };
        },
    };
});
