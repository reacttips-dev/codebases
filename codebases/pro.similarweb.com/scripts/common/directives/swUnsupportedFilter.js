import angular from "angular";
import CountryService from "../../../app/services/CountryService";
import { swSettings } from "../services/swSettings";
import { SwTrack } from "../../../app/services/SwTrack";

angular.module("sw.common").directive("swUnsupportedFilter", function () {
    return {
        restrict: "E",
        scope: {
            type: "@",
            page: "@",
        },
        replace: true,
        templateUrl: "/partials/directives/unsupported-filter.html",
        controller: function ($scope, $filter, swNavigator, $window) {
            switch ($scope.type) {
                case "country":
                    Object.assign($scope, {
                        originalParameter: swNavigator.getParams().country,
                        optionalParameters: swSettings.current.allowedCountries,
                        selectedParameter: swSettings.current.defaultParams.country,
                        selectOptions: {
                            formatSelection: select2FormatCountries,
                            formatResult: select2FormatCountries,
                        },
                    });
                    var countryName =
                        Number($scope.originalParameter) == 999
                            ? "WorldWide"
                            : CountryService.countriesById[$scope.originalParameter].text;
                    var store = swNavigator.getParams().appId
                        ? swNavigator.getParams().appId.startsWith("1")
                            ? "iOS"
                            : "Android"
                        : "";
                    var noAppData =
                        swNavigator.getParams().appId &&
                        swSettings.components.Home.resources.HasAppsIOS
                            ? " " + store + " apps in"
                            : "";
                    $scope.destinationPage = $filter("i18n")($scope.page || "");
                    $scope.title = $filter("i18n")("unsupportedFilter.country.title", {
                        destPage: $scope.destinationPage,
                        country: countryName,
                        noAppData: noAppData,
                    });
                    $scope.subTitle = $filter("i18n")("unsupportedFilter.country.subTitle");
                    $scope.trackName = "Country Filter";
                    break;
                case "store":
                    Object.assign($scope, {
                        originalParameter: swNavigator.getParams().store,
                        optionalParameters: [
                            { id: "Apple", text: "App Store", icon: "app-sprite-appstore-apple-m" },
                            {
                                id: "Google",
                                text: "Play Store",
                                icon: "app-sprite-appstore-google-m",
                            },
                        ],
                        selectedParameter: "Google",
                        selectOptions: {
                            formatSelection: select2FormatStoreSelection,
                            formatResult: select2FormatStoreResult,
                        },
                        disabledSelect: true,
                    });
                    $scope.title = $filter("i18n")("unsupportedFilter.store.title");
                    $scope.subTitle = $filter("i18n")("unsupportedFilter.store.subTitle");
                    $scope.trackName = "Store Filter";
                    break;
            }

            function select2FormatCountries(item) {
                return '<i class="flag flag-' + item.css + '"></i>' + item.text;
            }

            function select2FormatStoreSelection(item) {
                return (
                    '<i class="app-sprite-appstore-' +
                    item.id.toLowerCase() +
                    '-m" style="display: inline-block; position: relative; margin-right: 5px"></i>' +
                    item.text
                );
            }

            function select2FormatStoreResult(item) {
                const store = item.id.toLowerCase();
                return (
                    '<i class="app-sprite-appstore-' +
                    store +
                    "-m " +
                    store +
                    '-small" style="display: inline-block; position: relative; margin-right: 5px"></i>' +
                    item.text
                );
            }

            $scope.goBack = function () {
                SwTrack.all.trackEvent("Internal Link", "click", "Unsupported/Previous page");
                $window.history.back();
            };

            $scope.go = function () {
                const params = {};
                const type = $scope.type;
                const selectedParamCode = $scope.selectedParameter;
                const selectedParam = $scope.optionalParameters.find((item) => {
                    return item.id === selectedParamCode;
                });
                SwTrack.all.trackEvent(
                    "Button",
                    "click",
                    "Unsupported/Go/" + (selectedParam ? selectedParam.text : ""),
                );
                params[type] = selectedParamCode;
                swNavigator.updateParams(params);
            };
        },
    };
});
