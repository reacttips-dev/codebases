import angular from "angular";
import { swSettings } from "../../common/services/swSettings";
import { SwTrack } from "../../../app/services/SwTrack";

angular
    .module("websiteAnalysis")
    .controller("ModalBusinessInfoInstanceCtrl", function (
        $scope,
        $rootScope,
        $timeout,
        $http,
        $modalInstance,
        chosenSites,
        site,
    ) {
        const ctrl = this;
        ctrl.business = null;
        ctrl.pending = true;
        ctrl.site = site;
        ctrl.isDemo = swSettings.current.isDemo;

        $http
            .get("/api/websiteanalysis/getcontactinfodata", {
                cache: true,
                params: { domain: site.domain },
            })
            .success(function (businessInfo) {
                if (businessInfo) {
                    ctrl.business = businessInfo;
                }
                ctrl.pending = false;
            })
            .error(function (data, status) {
                ctrl.pending = false;
            });

        $scope.trackSimilarTechClick = function () {
            SwTrack.all.trackEvent(
                "ExternalLink",
                "click",
                "Table/SimilarTech/value" + site.domain,
            );
        };

        ctrl.cancel = function (reason) {
            $modalInstance.dismiss(reason);
            $timeout(function () {
                ctrl.pending = true;
                ctrl.business = null;
            });
            SwTrack.all.trackEvent("Pop up", "close", "Table/SimilarTech/" + site.domain, reason);
        };

        ctrl.trackLink = function () {
            SwTrack.all.trackEvent("ExternalLink", "click", "Table/SimilarTech/" + site.domain);
        };

        SwTrack.all.trackEvent("Pop up", "open", "Table/SimilarTech/" + site.domain);
    });
