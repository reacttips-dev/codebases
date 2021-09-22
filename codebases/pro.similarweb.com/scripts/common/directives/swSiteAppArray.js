import angular from "angular";
import * as _ from "lodash";
import { AppsResourceService } from "../../../app/services/AppsResourceService";
import { sitesResourceService } from "../../../app/services/sitesResource/sitesResourceService";

angular.module("sw.common").directive("swSiteAppArray", function () {
    return {
        restrict: "AE",
        templateUrl: function (elem, attrs) {
            return attrs.templateUrl || "/partials/directives/site-app-array.html";
        },
        controllerAs: "ctrl",
        scope: {
            sitesList: "=",
            searchType: "@",
            exclude: "=",
            appStore: "@",
            mainItem: "=",
            //include Only : List of selection object that overrides default behaviour and enables selection only in item from this closed list
            includeOnly: "<",
            //includeOnlyTitle : relevant only in case of include only list: "Name of Select Only List"
            includeOnlyTitle: "@",
            similarItems: "=",
            isDemoInCompare: "@",
            trackingCategory: "@",
            trackingName: "@",
            templateUrl: "@",
            allowedCompetitorsCount: "=",
        },
        controller: [
            "$scope",
            "$http",
            "sitesResource",
            function ($scope) {
                /* INIT */
                const ctrl = this;
                const itemsLength = $scope.sitesList.length;
                ctrl.isDemoInCompare = $scope.isDemoInCompare === "true";
                ctrl.includeOnly = $scope.includeOnly
                    ? excludeSearchResults($scope.includeOnly, $scope.exclude)
                    : $scope.includeOnly;
                ctrl.excludeList = $scope.exclude ? $scope.exclude.slice() : [];
                ctrl.allowedCompetitorsCount = $scope.allowedCompetitorsCount;
                ctrl.onItemChange = function () {
                    const tempArr = new Array(itemsLength);
                    ctrl.excludeList = $scope.exclude ? $scope.exclude.slice() : [];
                    ctrl.sitesCount = 0;
                    let j = 0;
                    for (let i = 0; i < tempArr.length; i++) {
                        const arrObj = $scope.sitesList[i];
                        if (arrObj) {
                            tempArr[j] = arrObj;
                            ctrl.excludeList.push(arrObj.id || arrObj.name);
                            ctrl.sitesCount++;
                            j++;
                        }
                    }
                    for (let k = j; k < tempArr.length; k++) {
                        tempArr[k] = null;
                    }
                    $scope.sitesList = tempArr;
                    ctrl.includeOnly = $scope.includeOnly
                        ? excludeSearchResults($scope.includeOnly, ctrl.excludeList)
                        : $scope.includeOnly;
                };

                function excludeSearchResults(items, excludeList) {
                    return items.filter(function (item) {
                        return excludeList.indexOf(item.id) == -1;
                    });
                }

                $scope.$watch("includeOnly", function (newVal) {
                    ctrl.onItemChange();
                });

                //ctrl.trackingName = $scope.trackingName;
                //ctrl.trackingCategory = $scope.trackingCategory;
                $scope.$watch("mainItem", function (newval) {
                    if (newval == undefined) {
                        return;
                    }
                    if ($scope.includeOnly) {
                        return;
                    }
                    _getSimilarItems();
                });

                /* PRIVATE */
                function _getSimilarItems() {
                    ctrl.similarItems = [];
                    if ($scope.appStore) {
                        const params = { appId: $scope.mainItem.id };
                        if ($scope.appStore !== "both") {
                            params.store = $scope.appStore;
                        }

                        AppsResourceService.similarApps(params, function (data) {
                            if ($scope.similarItems) {
                                ctrl.similarItems = _.filter(data, function (item) {
                                    return $scope.similarItems.indexOf(item.ID.toLowerCase()) >= 0;
                                });
                            } else {
                                ctrl.similarItems = data;
                            }
                        });
                    } else {
                        sitesResourceService
                            .getSimilarInfo($scope.mainItem.name, 20)
                            .then(function (data) {
                                if ($scope.similarItems) {
                                    ctrl.similarItems = _.filter(data, function (item) {
                                        return (
                                            $scope.similarItems.indexOf(
                                                item.Domain.toLowerCase(),
                                            ) >= 0
                                        );
                                    });
                                } else {
                                    ctrl.similarItems = data;
                                }
                            });
                    }
                }
            },
        ],
    };
});
