import angular from "angular";
import * as _ from "lodash";
import { swSettings } from "../../common/services/swSettings";
import { apiHelper } from "../../common/services/apiHelper";

angular
    .module("sw.topapps")
    .controller("trendsCtrl", function (
        $scope,
        topAppsResource,
        topAppsResourceSI,
        swNavigator,
        $filter,
    ) {
        const ctrl = this;
        ctrl.isLoading = true;
        this.store = swNavigator.getParams().store;
        const { parent } = swNavigator.current();

        this.lastUpdate = "---";
        $scope.filtersSettings.isEnabled = false;
        const params = apiHelper.transformParamsForAPI($scope.filters);

        $scope.tablesData = parent.includes("salesIntelligence-appcategory")
            ? topAppsResourceSI.getTrends(params)
            : topAppsResource.getTrends(params);
        $scope.tablesData.$promise.then(function (response) {
            ctrl.isLoading = false;
            ctrl.lastUpdate = response.LastUpdated;
            $scope.filtersSettings.isEnabled = true;
        });

        const urlParams = swNavigator.getParams();

        this.checkForEngagement = function () {
            const countryLimit = swSettings.allowedCountry(
                    urlParams.country,
                    "TopAppsTrendsGoogleUsageRank",
                ),
                categoryLimit = !_.includes(["Widgets", "Live Wallpaper"], urlParams.category),
                modeLimit = _.includes(["Top Free", "Top Paid"], urlParams.mode),
                storeLimit = swNavigator.getParams().store == "Google";

            return countryLimit && categoryLimit && modeLimit && storeLimit;
        };

        this.rankTypes = [
            {
                value: "usageRank",
                title: $filter("i18n")("topapps.toggler.swrank"),
                switcherTabClassExt: "switcher-tab--wide",
                iconClass: "similar-icon-bw",
            },
            {
                value: "storeRank",
                title: $filter("i18n")("topapps.toggler.storerank"),
                switcherTabClassExt: "switcher-tab--wide",
                iconClass: "google-play",
            },
        ];

        ctrl.selectedRankType = this.checkForEngagement() ? urlParams.tab : "storeRank";

        this.showUsageRank = function () {
            return ctrl.selectedRankType == "usageRank";
        };

        this.showStoreRank = function () {
            return ctrl.selectedRankType == "storeRank";
        };

        // download excel
        $scope.totalCount = true;
        $scope.$watch("ctrl.selectedRankType", function (newVal, oldVal) {
            if (newVal) {
                swNavigator.updateParams({ tab: newVal });
                $scope.downloadUrl =
                    "/export/" +
                    "TopApps/GetTrendsTsv?" +
                    $.param(
                        $.extend({}, swNavigator.getParams(), {
                            Category: $scope.filters.category.id,
                            page: newVal == "usageRank" ? 0 : 1,
                        }),
                    );
            }
        });
    });
