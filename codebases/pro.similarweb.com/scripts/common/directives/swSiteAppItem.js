import { AssetsService } from "services/AssetsService";
import angular from "angular";
import _ from "lodash";
import searchTypesHelperService, { SearchTypes } from "../services/searchTypesHelperService";
import { SwTrack } from "../../../app/services/SwTrack";

angular
    .module("sw.common")
    .directive("swSiteAppItem", function (
        $timeout,
        swNavigator,
        $filter,
        sitesResource,
        autoCompleteService,
    ) {
        return {
            restrict: "AE",
            templateUrl: "/partials/directives/site-app-item.html",
            controllerAs: "ctrl",
            scope: {
                searchType: "@",
                valueObj: "=",
                exclude: "=",
                appStore: "@",
                onChange: "&",
                similarItems: "=",
                includeOnlyItems: "=",
                customTitle: "@",
                isDemoMode: "@",
                trackingCategory: "@",
                trackingName: "@",
                typeSiteApp: "@",
                locked: "@",
            },
            controller: [
                "$scope",
                "$http",
                function ($scope, $http) {
                    /* INIT */

                    const ctrl = this;
                    ctrl.popupTitle = $scope.customTitle
                        ? $scope.customTitle
                        : $scope.searchType === "mobileApps"
                        ? $filter("i18n")("analysis.competitors.similarapps.title")
                        : $filter("i18n")("analysis.competitors.similarsites.title");
                    // this check allows us to use the searchType 'website' or 'websites' for compatibility with autocomplete and other directives
                    _setTypeSiteApp();
                    _setValue($scope.valueObj);

                    $scope.$watch("searchType", function (newVal, oldVal) {
                        if (newVal === oldVal) return;
                        _setTypeSiteApp();
                    });

                    /* PRIVATE */

                    function _setTypeSiteApp() {
                        ctrl.typeSiteApp = $scope.typeSiteApp
                            ? $filter("i18n")($scope.typeSiteApp)
                            : searchTypesHelperService.standardSearchType($scope.searchType) ===
                              SearchTypes.WEBSITE
                            ? $filter("i18n")("quickstartWizard.addCompetitors.website")
                            : $filter("i18n")("quickstartWizard.addCompetitors.app");
                    }

                    function _notifyDataChange() {
                        // notify by callback
                        $timeout(function () {
                            // timeout is used so onChange() will happen after and not during the digest loop
                            $scope.onChange();
                        });
                    }

                    function _canAddItem(item, excludeList) {
                        const candidate = !item.isVirtual ? item.id || item.name : "*" + item.name;
                        return !(excludeList.indexOf(candidate) > -1);
                    }

                    function trackSiteAppItem(inputValue, searchType, state) {
                        if (!inputValue) {
                            inputValue = {
                                name: "",
                                fromSuggestions: "",
                            };
                        }
                        let trackAction,
                            typeName =
                                $scope.trackingName ||
                                searchTypesHelperService.searchTypeName(searchType);

                        let trackName = "Add " + typeName;
                        switch (state) {
                            case "edit":
                                trackAction = "open";
                                break;
                            case "full":
                                trackAction = "click";
                                break;
                            case "empty":
                                trackAction = "click";
                                trackName = "Remove " + typeName;
                                break;
                            default:
                                trackAction = "click";
                        }
                        const { name = inputValue } = inputValue;
                        SwTrack.all.trackEvent(
                            $scope.trackingCategory || "Drop down",
                            trackAction,
                            trackName +
                                "/" +
                                name +
                                ((inputValue.fromSuggestions && "/autocomplete") || ""),
                            searchTypesHelperService.standardSearchType(searchType),
                        );
                    }

                    function _notifyStateChange() {
                        // notify by event
                        if (ctrl.state != "empty") {
                            //don't track twice the 'Remove' click
                            trackSiteAppItem(ctrl.inputValue, $scope.searchType, ctrl.state);
                        }
                        $scope.$emit("swSiteAppItem.stateChange", ctrl.state);
                    }

                    function _syncState() {
                        if ($scope.valueObj) {
                            ctrl.state = "full";
                        } else if ($scope.locked == "true") {
                            ctrl.state = "locked";
                        } else {
                            ctrl.state = "empty";
                        }
                        document.body.removeEventListener("click", onBodyClick, true);
                    }

                    function _setValue(newValue) {
                        $scope.valueObj = newValue;
                        ctrl.inputValue = $scope.valueObj ? $scope.valueObj.name : "";
                        _syncState();
                        _notifyDataChange();
                    }

                    /**
                     * check whether the event has occurred on element with a class or on a child of element with a class
                     * @param event
                     * @param className
                     * @returns {boolean}
                     */
                    function isClickedInsideClass($elm, className) {
                        return !_.isEmpty($elm.closest("." + className));
                    }

                    function onBodyClick(event) {
                        const $elm = angular.element(event.target);
                        switch (true) {
                            // click on close button
                            case isClickedInsideClass($elm, "addCompetitor-closeInput"):
                                //ctrl.clearValue(); // taken care by the ng-click on the "i" element.
                                break;
                            // click on the input itself
                            case isClickedInsideClass($elm, "inputInvisible"):
                            // click on item from a list
                            case isClickedInsideClass($elm, "typeahead-list"):
                                return;
                            // click outside with empty value
                            case _.isEmpty(ctrl.inputValue):
                                ctrl.clearValue();
                                break;
                            // click outside with non empty value
                            default:
                                ctrl.onSelected(null, ctrl.inputValue, $scope.searchType);
                                break;
                        }
                    }

                    function loadResourceImage(resource) {
                        let imageRequest;
                        switch (searchTypesHelperService.standardSearchType($scope.searchType)) {
                            case 0:
                                imageRequest = sitesResource.GetWebsiteImage({
                                    website: resource.name,
                                }).$promise;
                                break;
                        }
                        if (imageRequest) {
                            imageRequest.then(function (data) {
                                resource.image = data.image || resource.image;
                            });
                        }
                    }

                    /* PUBLIC */

                    ctrl.clearValue = function () {
                        trackSiteAppItem(ctrl.inputValue, $scope.searchType, "empty");
                        _setValue(null);
                        _notifyStateChange();
                    };

                    ctrl.startEdit = function () {
                        ctrl.inputValue = "";
                        ctrl.state = "edit";
                        document.body.addEventListener("click", onBodyClick, true);
                        _notifyStateChange();
                    };

                    ctrl.openUpgradeModal = function () {
                        $scope.$emit("swSiteAppItem.openUpgradeModal");
                    };

                    /**
                     * called when an autocomplete value is selected (click/enter)
                     * @param item item object
                     * @param model item string
                     * @param searchType
                     */
                    ctrl.onSelected = function (item, model, searchType) {
                        if (item) {
                            // autocomplete
                            item.fromSuggestions = true;
                            if (item.isVirtual) {
                                item.displayName = item.name;
                                item.name = "*" + item.name;
                            }
                            $scope.valueObj = item;
                        } else {
                            // text input only (supported on websites)
                            if (
                                searchTypesHelperService.standardSearchType($scope.searchType) !==
                                    SearchTypes.WEBSITE ||
                                !model
                            ) {
                                ctrl.clearValue();
                                return;
                            }
                            model = swNavigator.getValidSearchTerm(model);

                            const newValue = {
                                name: model,
                                image: AssetsService.assetUrl("/images/website.ico"),
                                isVirtual: false,
                            };

                            // check that the website is not already selected
                            if (
                                $scope.exclude &&
                                $scope.exclude.length &&
                                !_canAddItem(newValue, $scope.exclude)
                            ) {
                                ctrl.clearValue();
                                return;
                            }

                            $scope.valueObj = newValue;
                            loadResourceImage(newValue);
                        }
                        _syncState();
                        _notifyDataChange();
                        _notifyStateChange();
                    };

                    ctrl.getSuggestions = function (query) {
                        return autoCompleteService.getAutoCompleteSuggestions(
                            query,
                            $scope.searchType,
                            $scope.appStore,
                            10,
                            $scope.exclude,
                        ).promise;
                    };

                    /* LISTENERS */

                    $scope.$watch("valueObj", function (newValue, oldValue) {
                        _setValue(newValue);
                    });
                },
            ],
        };
    });
