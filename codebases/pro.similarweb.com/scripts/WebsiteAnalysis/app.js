import angular from "angular";
import getWebsiteStateConfig from "../../app/routes/websiteStateConfig";
import { SwTrack } from "../../app/services/SwTrack";

angular
    .module("websiteAnalysis")
    .config(function ($compileProvider, $httpProvider, $sceProvider, $stateProvider) {
        let websiteStateConfig = getWebsiteStateConfig();
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        //$httpProvider.interceptors.push('sw_httpInterceptor');
        $sceProvider.enabled(false);

        angular.forEach(websiteStateConfig, function (value, key) {
            $stateProvider.state(key, value);
        });
    })
    .run(function (
        $rootScope,
        $route,
        $location,
        $http,
        $modal,
        chosenDataGetter,
        s_ViewGroup,
        chosenSites,
        columnsMutator,
        limitToFilter,
        swRoute,
        swNavigator,
    ) {
        $rootScope.global = $rootScope.global || {};
        Object.assign($rootScope.global, {
            loading: false,
            alert: false,
            getValidSearchTerm: swNavigator.getValidSearchTerm,
            site: {
                similarSites: [],
            },
            businessInfo: {
                openOverlay: function (domain, favicon) {
                    $modal.open({
                        templateUrl: "/partials/websites/modal-business-info.html",
                        controller: "ModalBusinessInfoInstanceCtrl",
                        controllerAs: "ctrl",
                        resolve: {
                            site: function () {
                                return {
                                    domain: domain,
                                    favicon: favicon,
                                };
                            },
                        },
                    });
                },
            },
            compare: {
                sitesListInfo: chosenSites.listInfo,
                isActive: function () {
                    return chosenSites.isCompare();
                },
                isVirtual: function (name) {
                    return chosenSites.getInfo(name).isVirtual;
                },
                getDisplayName: function (name) {
                    return chosenSites.getInfo(name).displayName;
                },
                openCompare: function () {
                    SwTrack.all.trackEvent("Compare", "open", "Header");
                    $modal.open({
                        templateUrl: "/partials/websites/modal-compare.html",
                        controller: "ModalCompareInstanceCtrl",
                        controllerAs: "ctrl",
                    });
                },
                removeCompareMain: function (item) {
                    chosenSites.removeItem(item);
                    swNavigator.updateParams({ key: chosenSites.get() });
                },
            },
            isWindow: function () {
                return swRoute.duration().isWindow();
            },
        });

        Object.assign($rootScope, {
            requestServiceProvider: "analysis", //TODO dataTable controller utl creation to service and change this to provider pattern

            onSubmit: function (config) {
                swNavigator.updateParams(config);
                return false;
            },

            similarSites: [],

            siteSuggestions: function (query) {
                if (!query) {
                    return [];
                }
                return $http
                    .get("/autocomplete/websites", {
                        cache: true,
                        params: { term: query.toLowerCase() },
                    })
                    .then(function (response) {
                        return limitToFilter(response.data, 10);
                    });
            },
        });

        $rootScope.$on("navChangeStart", redirect);

        function redirect(event, to, toParams) {
            // redirect to the new states
            if (to.replacedBy) {
                SwTrack.all.trackEvent("Redirect", "click", "To/" + to.replacedBy);
                event.preventDefault();
                setTimeout(function () {
                    swNavigator.go(to.replacedBy, toParams, null, "state");
                });
            }
        }
    });
