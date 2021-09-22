import angular from "angular";
import * as _ from "lodash";
import { swSettings } from "../common/services/swSettings";
import DurationService from "services/DurationService";
import { apiHelper } from "../common/services/apiHelper";

angular
    .module("sw.common")
    .controller("topAppsNavigationCtrl", function (
        $scope,
        $filter,
        swNavigator,
        storeOptions,
        keywordsCategories,
        $timeout,
    ) {
        $scope.filters = {};
        var pageName = getPageName();
        $scope.showLayout = pageName !== "home";
        var stateParams = swNavigator.getParams();

        $scope.filtersSettings = {
            hideMode: false,
            showDeviceFilter: stateParams.store != "Google",
            isEnabled: true,
            disableCategory: false,
        };
        $scope.devices = [
            { id: "iPhone", text: "iPhone" },
            { id: "iPad", text: "iPad" },
        ];

        $scope.stores = [
            { id: "Google", text: "Play Store", icon: "google-play" },
            { id: "Apple", text: "App Store", icon: "i-tunes" },
        ];

        $scope.updateFromReactComponent = (filters) => {
            $timeout(() => {
                //trigger digest
                $scope.filters = Object.assign($scope.filters, filters);
            }, 0);
        };

        if (pageName === "topkeywords") {
            if (stateParams.store === "Apple") {
                stateParams.device = "iPhone";
            }
            setTopKeywordsParams();
        }
        $scope.showDatePicker = pageName === "topkeywords";
        Object.assign($scope.filters, stateParams);
        $scope.filters.orderby = getOrderBy();
        $scope.durationTooltip = DurationService.getDurationData(stateParams.duration).forTooltip;
        $scope.storeOptions = storeOptions;
        //if (pageName !== 'home') {
        //  $scope.showNavigation = true;
        updateFilters($scope.filters.store, $scope.filters.device);
        //}

        var flatCategories = {
            iPhone: flattenCategories("iPhone"),
            iPad: flattenCategories("iPad"),
            AndroidPhone: flattenCategories("AndroidPhone"),
        };

        function getPageName() {
            return swNavigator.current().name.split(".")[1];
        }

        function flattenCategories(device) {
            var store = device == "AndroidPhone" ? "Google" : "Apple",
                categories = storeOptions[store][device].Categories,
                nestedCategories = _.flatten(
                    _.map(
                        _.filter(categories, function (val) {
                            return val.children.length > 0;
                        }),
                        "children",
                    ),
                );
            return _.union(nestedCategories, categories);
        }

        $scope.$on("$stateChangeSuccess", function (evt, toState, toParams, fromState, fromParams) {
            let toStateName = toState.name.split(".")[1];
            if (toStateName === "topkeywords") {
                toParams.store = "Google";
                Object.assign($scope.filtersSettings, {
                    fixedStore: true,
                });
                setTopKeywordsParams();
            } else {
                Object.assign($scope.filtersSettings, {
                    fixedStore: false,
                    hideMode: false,
                    showDeviceFilter: $scope.filters.store == "Apple",
                    disableCategory: false,
                });

                $scope.datePickerPresets = false;
            }
            $scope.showLayout = toStateName !== "home";

            $scope.showDatePicker = pageName === "topkeywords";
            Object.assign($scope.filters, toParams);
            $scope.filters.orderby = getOrderBy();
            updateFilters($scope.filters.store, $scope.filters.device);
        });

        $scope.$watchCollection("filters", function (newVal, oldVal) {
            Object.assign(newVal, apiHelper.parseCategoryForApi(newVal.category));
            Object.assign(oldVal, apiHelper.parseCategoryForApi(oldVal.category));
            if (!_.isEqual(newVal, oldVal)) {
                if (newVal.store != oldVal.store || newVal.device != oldVal.device) {
                    // Store was changed to Google
                    if (newVal.store == "Google") {
                        newVal.device = "AndroidPhone";
                        newVal.orderby = "UsageRank desc";
                    }
                    // Store was changed to Apple or Apple device was changed
                    else {
                        newVal.device = newVal.device == "AndroidPhone" ? "iPhone" : newVal.device;
                        newVal.orderby = "StoreRank desc";
                    }

                    if (swNavigator.current().name === "appcategory.topkeywords") {
                        newVal.orderby = "Popularity desc";
                    }
                    updateFilters(newVal.store, newVal.device);

                    // Check if currently selected category is in updated category list
                    var category = newVal.category.id || newVal.category;
                    if (!_.find(flatCategories[newVal.device], { id: category })) {
                        // if not change to All
                        newVal.category = "All";
                    }
                }

                // Check if currently selected country is in updated country list
                if (!_.find($scope.countries, { id: Number(newVal.country) })) {
                    // if not change to default country
                    newVal.country = swSettings.current.defaultParams.country;
                }

                if (newVal.page == oldVal.page) newVal.page = null;
                swNavigator.go(swNavigator.current(), newVal);
            }
        });

        function updateFilters(store, device) {
            var pageName = getPageName();
            if (pageName == "topkeywords" || pageName == "home") {
                $scope.categories = keywordsCategories;
            } else {
                //TODO: remove storeOptions api when page has widget infrastructure
                $scope.categories = storeOptions[store][device].Categories;
            }
            $scope.countries = swSettings.current.allowedCountries;

            if (!_.find($scope.countries, { id: Number($scope.filters.country) })) {
                $scope.filters.country = swSettings.current.defaultParams.country;
            }
            if ($scope.select2CategoryOptions) {
                $scope.select2CategoryOptions.data = $scope.categories;
            }
            $scope.modes = store && device ? getModes(store, device) : [];
            $scope.showDeviceFilter = store != "Google";
        }

        function getModes(store, device) {
            return storeOptions[store][device].Modes.map(function (mode) {
                return { id: mode, text: mode };
            });
        }

        function getOrderBy() {
            var playStore = $scope.filters.store == "Google";
            if (getPageName() === "topkeywords") {
                return $scope.filters.orderby || "Popularity desc";
            }
            return $scope.filters.orderby || (playStore ? "UsageRank desc" : "StoreRank desc");
        }

        function setTopKeywordsParams() {
            $scope.datePickerPresets = swSettings.current.datePickerPresets;
            $scope.startDate = swSettings.current.startDate;
            $scope.endDate = swSettings.current.endDate;
            Object.assign($scope.filtersSettings, {
                fixedStore: swNavigator.getParams().store == "Google",
                hideMode: true,
                showDeviceFilter: false,
            });
            if (swSettings.current.isDemo) {
                $scope.filtersSettings.disableCategory = true;
            }
        }
    });
