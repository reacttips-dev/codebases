import angular from "angular";
import * as _ from "lodash";
import { swSettings } from "../common/services/swSettings";
import DurationService from "services/DurationService";
import { chosenItems } from "../common/services/chosenItems";
import { apiHelper } from "../common/services/apiHelper";
import { statesAnalysisHideFavorites } from "../../app/pages/sales-intelligence/legacy-router-config/configuration/appAnalysisConfig";

angular
    .module("sw.common")
    .controller("appsNavigationCtrl", function ($scope, $rootScope, $http, $filter, swNavigator) {
        const pageName = getPageName() ?? swNavigator.current().name; // support new states with underscore
        let pageConfigId = swNavigator.current().configId;
        $scope.AppAnalysisFiltersProps = {};
        $scope.AppsQueryBarProps = { showHeader: $scope.showHeader };
        if ($rootScope.unsupportedFilter) {
            $scope.AppsQueryBarProps.customClassName = "app-header--disabled";
        }

        const handleCountrySelector = () => {
            const currentNamePage = swNavigator.current().name;
            const currPageName = getPageName() ?? currentNamePage;
            pageConfigId = swNavigator.current().configId;
            if (
                currPageName === "ranking" ||
                currPageName === "demographics" ||
                currPageName === "companyresearch_app_appranking" ||
                currPageName === "companyresearch_app_appdmg" ||
                currentNamePage === "salesIntelligence-apps-demographics" ||
                currentNamePage === "salesIntelligence-apps-ranking"
            ) {
                $scope.AppAnalysisFiltersProps.hideDurationSelector = true;
                $scope.AppAnalysisFiltersProps.hideCountrySelector = true;
            } else if (
                pageConfigId === "StorePage" ||
                currPageName === "performance" ||
                currPageName === "companyresearch_app_appperformance" ||
                currentNamePage === "salesIntelligence-apps-performance"
            ) {
                $scope.AppAnalysisFiltersProps.hideDurationSelector = true;
                $scope.AppAnalysisFiltersProps.hideCountrySelector = false;
            } else {
                $scope.AppAnalysisFiltersProps.hideCountrySelector = false;
            }
        };

        $scope.showTooltip = false;
        $scope.isDemoUser = swSettings.current.isDemo;
        $scope.datePickerPresets = swSettings.current.datePickerPresets;
        $scope.startDate = swSettings.current.startDate;
        $scope.endDate = swSettings.current.endDate;
        $scope.type = "mobileApps";
        $scope.showHeader = true;

        $scope.showTopBar = pageName !== "audienceForbiddenState";

        $scope.AppsQueryBarProps = { showHeader: $scope.showHeader };
        if ($rootScope.unsupportedFilter) {
            $scope.AppsQueryBarProps.customClassName = "app-header--disabled";
        }

        $scope.$on("navChangeComplete", handleCountrySelector);
        handleCountrySelector();
        const stateParams = swNavigator.getParams();
        const defaultParams = swSettings.current.defaultParams;
        const durationValue = stateParams.duration || defaultParams.duration;

        $scope.filters = {
            country: stateParams.country || defaultParams.country,
            duration: durationValue,
        };

        $scope.durationTooltip = DurationService.getDurationData(durationValue).forTooltip;

        function onStateChange(evt, toState, toParams, fromState, fromParams) {
            if (statesAnalysisHideFavorites.has(toState.name)) {
                $scope.AppsQueryBarProps.hideFavorites = true;
            }

            $scope.showTooltip = false;
            const previousDuration = fromParams.duration,
                currentDuration = toParams.duration,
                unsupportedDuration =
                    previousDuration &&
                    !swSettings.allowedDuration(previousDuration) &&
                    fromState.name !== "apps-ranking" &&
                    fromState.name !== "salesIntelligence-apps-ranking" &&
                    fromState.name !== "companyresearch_app_appranking" &&
                    previousDuration.indexOf("d") === -1;

            if (previousDuration != currentDuration && unsupportedDuration) {
                $scope.showTooltip = true;
                $scope.tooltipText = $filter("i18n")("duration.unavailable.tooltip", {
                    duration: DurationService.getDurationData(
                        fromParams.duration,
                        null,
                        "WebAnalysis",
                    ).forTitle,
                });
            } else {
                $scope.showTooltip = false;
            }

            const toPageName = toState.name.split("-")[1] ?? toState.name; // new states with underscores
            const fromPageName = fromState.name.split("-")[1] ?? fromState.name; // new states with underscores

            /*        if (toPageName === 'home') {
            chosenItems.$clear(); // Clear chosenItems when moving to homepages
            }*/
            //TODO: is this still relevant ?
            $scope.showNavigation = toPageName !== "home";
            //TODO: is this still relevant ?
            $scope.showTopBar = toPageName !== "audienceForbiddenState";
            $scope.durationTooltip = DurationService.getDurationData(toParams.duration).forTooltip;
            $scope.bannerType = getDemoBannerType();

            // Disable duration selectors on pages below
            $scope.AppAnalysisFiltersProps.hideDurationSelector =
                toPageName === "ranking" ||
                toPageName === "companyresearch_app_appranking" ||
                pageConfigId === "StorePage" ||
                toPageName === "performance" ||
                toPageName === "companyresearch_app_appperformance" ||
                toState.name === "salesIntelligence-apps-performance" ||
                toState.name === "salesIntelligence-apps-ranking" ||
                toState.name === "salesIntelligence-apps-demographics";

            if (toPageName === "instoresearch" && fromPageName !== "instoresearch") {
                // need to persist keywords within instoresearch for selection from table, otherwise table selection should be cleared
                chosenItems.keywords = "";
            }

            $scope.datePickerPresets = swSettings.current.datePickerPresets;
            $scope.startDate = swSettings.current.startDate;
            $scope.endDate = swSettings.current.endDate;
            if ($rootScope.unsupportedFilter) {
                if (!$scope.countries) {
                    $scope.countries = swSettings.components["AppAnalysis"].allowedCountries;
                }
            } else {
                $scope.countries = swSettings.current.allowedCountries;
            }

            $scope.filters = {
                country: toParams.country,
                duration: toParams.duration,
            };
        }
        $scope.$on("$stateChangeSuccess", onStateChange);
        const currentState = swNavigator.current();
        const currentParams = swNavigator.getParams();
        //running this first time since it is expected to run but stateChangeSuccess not triggered.
        onStateChange(null, currentState, currentParams, currentState, currentParams);

        $scope.$watchCollection("filters", function (newVal, oldVal) {
            const pageName = swNavigator.current().name.split("-")[1];
            const pageParams = Object.assign({}, swNavigator.getParams(), newVal);
            // do not reload the ranking page
            if (pageName == "ranking") {
                if (
                    !_.isEqual(newVal.country, oldVal.country) ||
                    !_.isEqual(newVal.timeframe, oldVal.timeframe)
                ) {
                    swNavigator.go("apps-ranking", pageParams, { location: true, notify: false });
                    return;
                }
            }
            Object.assign(
                newVal,
                newVal.category ? apiHelper.parseCategoryForApi(newVal.category) : {},
            );
            Object.assign(
                oldVal,
                oldVal.category ? apiHelper.parseCategoryForApi(oldVal.category) : {},
            );
            if (
                !_.isEqual(newVal, oldVal) &&
                oldVal.duration &&
                swSettings.allowedDuration(oldVal.duration, pageName)
            ) {
                const params = swNavigator.getParams();
                params.filter = null;
                params.page = null;
                swNavigator.go(
                    swNavigator.current(),
                    Object.assign({}, params, { filter: null, page: null }, newVal),
                );
                return;
            }
        });

        function getPageName() {
            return swNavigator.current().name.split("-")[1];
        }

        function getDemoBannerType() {
            const parent = swNavigator.current().parent;

            if (parent === "apps") {
                return "apps";
            }

            return "basic";
        }
    });
