import angular from "angular";
import * as _ from "lodash";
import { openUnlockModal } from "../../../app/services/ModalService";
import { swSettings } from "../../common/services/swSettings";

angular
    .module("websiteAnalysis")
    .controller("ModalCompareInstanceCtrl", function (
        $scope,
        $rootScope,
        $modalInstance,
        chosenSites,
        swNavigator,
    ) {
        var ctrl = this;
        var vm = ($scope.competitorsData = {});
        var hasCompetitorsList = $scope.competitorsList ? $scope.competitorsList : null;
        $scope.isDemo = swSettings.current.isDemo;
        $scope.demoSimilarSites = $scope.isDemo ? swSettings.current.demo.websiteCompetitors : null;

        var totalCompetitorsCount = swSettings.current.totalCompetitorsCount;
        $scope.allowedCompetitorsCount = swSettings.current.allowedCompetitorsCount;

        function _sanitize(_item) {
            var item = _.clone(_item);
            if (!item.isVirtual) {
                item.name = item.urlName = swNavigator.getValidSearchTerm(item.name);
            } else {
                item.urlName = item.name;
            }
            return item;
        }

        function _init() {
            var list = _.fill(Array(totalCompetitorsCount), null);
            if (hasCompetitorsList) {
                var rest = hasCompetitorsList;
                for (var i = 0; i < rest.length; i++) {
                    var item = rest[i];
                    list[i] = {
                        name: item.name,
                        displayName: item.displayName,
                        isVirtual: item.isVirtual,
                        image: item.icon || item.image,
                    };
                }
            } else if (chosenSites.isCompare()) {
                // add compare
                var rest = chosenSites.get();
                for (var i = 1; i < rest.length; i++) {
                    var name = rest[i];
                    var siteInfo = chosenSites.getInfo(name);
                    list[i - 1] = {
                        name: name,
                        displayName: siteInfo.displayName,
                        isVirtual: siteInfo.isVirtual,
                        image: siteInfo.icon,
                    };
                }
            }
            vm.list = list;
            vm.site = chosenSites.getPrimarySite();
            vm.site.image = vm.site.icon;

            $scope.$on("swSiteAppItem.openUpgradeModal", () => {
                const unlockHook = { modal: "CompareFilters", slide: "Compare" };
                openUnlockModal(unlockHook, "compare mode");
            });
        }

        function _urlKey() {
            var res = _sanitize(vm.site).urlName;
            for (var i = 0; i < vm.list.length; i++) {
                if (vm.list[i]) {
                    var item = _sanitize(vm.list[i]);
                    res += "," + item.urlName;
                }
            }
            return res;
        }

        ctrl.submit = function () {
            // make sure all compared site names are lower-cased
            _.each(vm.list, function (item, index, list) {
                if (item) {
                    list[index].name = item.name.toLowerCase();
                }
            });
            if ($scope.customSubmit && typeof $scope.customSubmit === "function") {
                $scope.customSubmit({ key: _urlKey(vm.list) });
            } else {
                $rootScope.onSubmit({ key: _urlKey(vm.list) });
            }
            $modalInstance.close(vm.list);
        };

        ctrl.dismiss = function () {
            $modalInstance.close();
        };
        _init();
    });
