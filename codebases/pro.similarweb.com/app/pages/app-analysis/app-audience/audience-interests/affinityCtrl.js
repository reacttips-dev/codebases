import angular from "angular";
import * as _ from "lodash";
import { chosenItems } from "../../../../../scripts/common/services/chosenItems";
import { AppsResourceService } from "../../../../services/AppsResourceService";

angular
    .module("sw.apps")
    .controller("affinityCtrl", function ($scope, $timeout, swNavigator, $filter) {
        $scope.appInfo = function (appId) {
            return _.find(chosenItems.$all(), { Id: appId });
        };
        $scope.filter = {};
        const stateParams = swNavigator.getParams();
        $scope.filter.appId = stateParams.compare || chosenItems.$first().Id;
        $scope.compareMode = stateParams.appId.split(",").length > 1;

        const appId = _.get($scope, "filter.appId.id", null) || _.get($scope, "filter.appId", null);
        const info = appId && $scope.appInfo(appId);
        if (info) {
            $scope.appName = info.Title;
        } else {
            swNavigator.updateParams({ compare: chosenItems.$first().Id });
        }

        $scope.affinitryResolved = false;
        // Fetch table data according with specified params
        $scope.affinityResource = AppsResourceService.affinity(swNavigator.getApiParams());
        $scope.affinityResource.then(function (response) {
            $scope.select2CategoryOptions.data = response[appId].Categories;
            $scope.tableData = response[appId].Table;
            $scope.topCategories = $scope.topCategories = response[appId].CategoryDistribution;
            $scope.affinitryResolved = true;
            // Slide apps out
            $timeout(function () {
                $scope.slideApps = true;
            }, 500);
        });

        const categoryFilter =
            stateParams.filter && angular.fromJson(stateParams.filter).MainCategoryID;
        $scope.filter.category = categoryFilter ? categoryFilter : "All";
        $scope.filterByCategory = function () {
            if (typeof $scope.filter.category == "string") {
                if ($scope.filter.category != "All")
                    window.location = $filter("tableFilter")(
                        $scope.filter.category,
                        "MainCategoryID",
                    );
                else {
                    swNavigator.go(
                        swNavigator.current(),
                        Object.assign({}, swNavigator.getParams(), { filter: null, page: null }),
                        { reload: true },
                    );
                }
            }
        };

        $scope.$watch(
            "filter.appId",
            function (newAppId, oldAppId) {
                newAppId = newAppId.id || newAppId;
                oldAppId = oldAppId.id || oldAppId;
                if (oldAppId && newAppId != oldAppId) {
                    swNavigator.go(swNavigator.current(), { compare: newAppId });
                }
            },
            true,
        );

        $scope.select2CategoryOptions = {
            minimumResultsForSearch: 0,
            formatResult: function (item) {
                return item.text + " (" + item.count + ")";
            },
            formatSelection: function (item) {
                if (item.id === "All") {
                    return (
                        '<span class="sw-parent-category">' +
                        $filter("i18n")("forms.category.all") +
                        "</span>"
                    );
                }
                return item.text + " (" + item.count + ")";
            },
        };

        $scope.select2CompareOptions = {
            data: _.map(chosenItems.$all(), function (item) {
                return { id: item.Id, text: item.Title, icon: item.Icon };
            }),
            formatResult: function (item) {
                return '<img class="favicon" src="' + item.icon + '"/> ' + item.text;
            },
            formatSelection: function (item) {
                return '<img class="favicon" src="' + item.icon + '"/> ' + item.text;
            },
        };
    });
