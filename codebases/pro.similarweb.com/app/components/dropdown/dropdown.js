import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular
    .module("sw.common")
    .constant("dropdownConfig", {
        openClass: "is-opened",
    })
    .filter("nestedFilter", function () {
        return function (items, query, showSearch) {
            function contains(item, query) {
                return item.text.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
            if (!items) return;
            if (!showSearch || !items.length) return items;
            return items.filter(function (item) {
                if (item.children && item.children.length) {
                    let validCount = item.children.length;
                    item.children.forEach(function (childItem) {
                        // Hide child elements that don't pass the test
                        // and decrement validCount
                        if (!contains(item, query) && !contains(childItem, query)) {
                            childItem.hidden = true;
                            validCount--;
                        } else {
                            childItem.hidden = false;
                        }
                    });
                    if (validCount) {
                        // If there are some valid children show the parent
                        item.disabled = !contains(item, query);
                        return true;
                    } else {
                        return contains(item, query);
                    }
                } else return contains(item, query);
            });
        };
    })
    .directive("swDropdown", function ($timeout, $filter) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                items: "=",
                selected: "=",
                ngDisabled: "=",
                placeholder: "@",
                contactFormIsVisible: "@",
                onChange: "&?",
            },
            require: "?^dropdown",
            templateUrl: "/app/components/dropdown/dropdown.html",
            compile: function (element, attrs) {
                // private methods
                function findNestedItem(items, itemId) {
                    let childResult = null;
                    const returnedValue = _.find(items, function (item) {
                        if (item.id == itemId) return true;
                        else if (item.children && item.children.length) {
                            childResult = findNestedItem(item.children, itemId);
                            return !_.isEmpty(childResult);
                        } else return false;
                    });
                    return childResult || returnedValue;
                }

                function getSelectedText(trackName, item) {
                    let text;
                    switch (trackName) {
                        //SIM-5748 special case for widget metrics
                        case "Metric":
                            text = item.id;
                            break;
                        //SIM-5748 special case for subdomains
                        case "Domain level":
                            text = item.text.substring("wwwselector.".length);
                            break;
                        default:
                            text = item.text;
                    }
                    return text;
                }

                return {
                    pre: function (scope, element, attrs) {
                        const showSearch = angular.isDefined(attrs.showSearch)
                            ? attrs.showSearch
                            : false;
                        scope.appendToBody = scope.$eval(attrs.appendToBody) || false;
                        scope.emptySelect = scope.$eval(attrs.emptySelect) || false;
                        scope.maxWidth = attrs.maxWidth || "450px";
                        scope.minWidth = attrs.minWidth || "200px";
                        scope.width = attrs.width;
                        scope.textAlign = attrs.textAlign || "left";
                        scope.showSearch = scope.$eval(showSearch);
                        scope.search = { string: "" };
                        scope.placeholder = scope.placeholder || "";
                        scope.onChange = scope.onChange || function () {};
                        scope.getGroupText = function (item) {
                            const label =
                                item.text || item.title || (item.getText && item.getText());
                            if (!label) return "";
                            return (
                                $filter("i18n")(label) +
                                (item.count ? " (" + $filter("number")(item.count) + ")" : "")
                            );
                        };
                    },
                    post: function (scope, element, attrs, dropdownCtrl) {
                        let trackName = attrs.swTrackName || "";
                        const trackValue = attrs.swTrackValue || "";
                        scope.removeSelection = function () {
                            let text = getSelectedText(trackName, scope.selectedItem);
                            if (text === "forms.category.all") {
                                trackName = "All Categories";
                                text = "";
                            }
                            let addSlash = false;
                            if (trackName.length > 0 && text.length > 0) {
                                addSlash = true;
                            }
                            SwTrack.all.trackEvent(
                                "Drop down",
                                "remove",
                                trackName + (addSlash === true ? "/" : "") + text,
                                trackValue,
                            );
                            scope.selected = null;
                            scope.disableOpenTracking = true;
                        };
                        scope.selectItem = function (item) {
                            if (item.inactive || item.disabled) {
                                return;
                            }
                            //if upgrade link is clicked - don't select - redirect
                            if (item.id === -2) {
                                return;
                            } else {
                                scope.selectedItem = item;
                                scope.selected = item.id;
                                scope.search.string = "";
                                scope.onChange({ item: item });
                            }
                        };
                        scope.$watch("selected", function (newVal, oldVal) {
                            if (newVal) {
                                scope.selectedItem = findNestedItem(scope.items, newVal);
                                if (scope.selectedItem) {
                                    let selectedText = getSelectedText(
                                        trackName,
                                        scope.selectedItem,
                                    );
                                    const valueChanged = newVal != oldVal;
                                    if (valueChanged && dropdownCtrl.isOpen()) {
                                        if (selectedText === "forms.category.all") {
                                            trackName = "All Categories";
                                            selectedText = "";
                                        }
                                        let addSlash = false;
                                        if (trackName.length > 0 && selectedText.length > 0) {
                                            addSlash = true;
                                        }
                                        SwTrack.all.trackEvent(
                                            "Drop down",
                                            "click",
                                            trackName +
                                                (addSlash === true ? "/" : "") +
                                                selectedText,
                                            trackValue,
                                        );
                                    }
                                }
                            } else {
                                scope.selectedItem = null;
                            }
                        });
                        scope.$watch(
                            function () {
                                return dropdownCtrl.isOpen();
                            },
                            function (newVal) {
                                if (newVal) {
                                    $timeout(function () {
                                        dropdownCtrl.$element.find(".search-input").focus();
                                    }, 1);
                                    if (!scope.disableOpenTracking) {
                                        SwTrack.all.trackEvent(
                                            "Drop down",
                                            "open",
                                            trackName,
                                            trackValue,
                                        );
                                    } else {
                                        scope.disableOpenTracking = false;
                                    }
                                }
                            },
                        );
                    },
                };
            },
        };
    });
