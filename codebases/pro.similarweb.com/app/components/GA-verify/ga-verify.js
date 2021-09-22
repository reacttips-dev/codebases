import angular from "angular";
import * as _ from "lodash";
import { isGAOn, subscribe } from "services/GAService";
import { swSettings } from "../../../scripts/common/services/swSettings";

angular
    .module("sw.common")
    .directive("swGaVerify", function (sitesResource, swNavigator, $modal, $ngRedux) {
        return {
            restrict: "E",
            scope: {
                trackingConfig: "=",
            },
            templateUrl: "/app/components/GA-verify/ga-verify.html",
            replace: true,
            controllerAs: "ctrl",
            controller: function ($scope) {
                var ctrl = this;
                ctrl.GaMode = swSettings.components.Home.resources.GaMode !== "Skip";

                // No check for compare mode because we only show this button in single mode
                const key = swNavigator.getParams().key.toLowerCase();

                function getGaToken() {
                    sitesResource.getSiteInfo({ keys: key }, function (data) {
                        ctrl.noGaToken = !data[key].hasGaToken;
                        ctrl.notVirtualSite = !data[key].isVirtual;
                        ctrl.privacyStatus = data[key].privacyStatus;
                    });
                }

                ctrl.isGAOn = isGAOn();

                getGaToken();

                ctrl.openGaWizard = function () {
                    $modal.open({
                        templateUrl: "/app/components/GA-verify/ga-wizard.html",
                        controller: "gaVerifyModalCtrl",
                        windowClass: "ga-modal",
                        scope: $scope,
                    });
                };

                const unSubscribe = subscribe((isGAOn) => {
                    $scope.$evalAsync(() => {
                        ctrl.isGAOn = isGAOn;
                    });
                });

                $scope.$on("$destroy", unSubscribe);
            },
        };
    });
