import angular from "angular";
import * as _ from "lodash";

angular
    .module("sw.common")
    .directive("inputPresets", function ($compile, $parse, $q, $document, $position, $timeout) {
        var HOT_KEYS = [9, 13, 27, 38, 40];
        var stores = ["Google", "Apple"];
        return {
            require: "ngModel",
            link: function (originalScope, element, attrs, modelCtrl) {
                //create a child scope for the typeahead directive so we are not polluting original scope
                //with typeahead-specific data (matches, query etc.)

                var scope = originalScope.$new();
                scope.loading = true;
                scope.opened = false;

                originalScope.$on("$destroy", function () {
                    scope.$destroy();
                    $document.off("click.inputpresets");
                });

                var appendToBody = attrs.typeaheadAppendToBody
                    ? scope.$eval(attrs.typeaheadAppendToBody)
                    : false;
                var onSelectCallback = $parse(attrs.inputPresetsOnSelect);
                var $setModelValue = $parse(attrs.ngModel).assign;

                scope.query = undefined;
                scope.matches = [];
                scope.activeIdx = -1;
                scope.select = function (idx) {
                    var item = scope.matches[idx];
                    if (item) {
                        $setModelValue(originalScope, item.model);
                        onSelectCallback(originalScope, {
                            $item: item.model,
                            $model: "",
                            $label: item.label,
                        });
                    }

                    toggleSuggestions();
                };

                var onClick = function (evt) {
                    // if input is not empty, do not toggle
                    var val = element.val();
                    if (val) {
                        return;
                    }
                    toggleSuggestions();
                    scope.$apply();
                };

                var addMatches = function (items) {
                    scope.matches = [];
                    //transform labels
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (
                            attrs.inputPresetsExcludeList.indexOf(item.ID) > -1 ||
                            attrs.inputPresetsExcludeList.indexOf(item.Domain) > -1
                        ) {
                            continue;
                        }

                        // websites
                        if (item.Domain) {
                            scope.matches.push({
                                label: item.Domain,
                                model: {
                                    name: item.Domain,
                                    image: item.Favicon,
                                },
                            });
                        }

                        // apps
                        if (item.Title) {
                            scope.matches.push({
                                label: item.Title,
                                // to fit the structure of object returned from autocomplete api for mobile apps
                                model: {
                                    id: item.ID,
                                    image: item.Icon,
                                    name: item.Title,
                                    publisher: item.Author,
                                    store: stores[item.Store].toLowerCase(),
                                },
                            });
                        }
                    }
                    //scope.matches = scope.matches.slice(0, 5);
                };

                var showSuggestions = function () {
                    //if (scope.isPresetValue) {
                    //    scope.opened = true;
                    //}

                    //if not loading and full array - open popup
                    // if still loading -  wait for array and open popup
                    if (!scope.loading && scope.isPresetValue) {
                        scope.opened = true;
                    } else if (scope.loading) {
                        var unbind = originalScope.$watch("isPresetValue", function (
                            newVal,
                            oldVal,
                        ) {
                            if (newVal) {
                                scope.opened = true;
                                unbind();
                            }
                        });
                    }
                };

                var hideSuggestions = function (evt) {
                    scope.opened = false;
                };

                var toggleSuggestions = function () {
                    if (!scope.opened) {
                        showSuggestions();
                    } else {
                        hideSuggestions();
                        element[0].focus();
                    }
                };

                var onDocumentClick = function (evt) {
                    if (!element.parent().find(evt.target).length) {
                        hideSuggestions();
                        scope.$apply();
                    }
                };

                var onKeyDown = function (evt) {
                    if (HOT_KEYS.indexOf(evt.which) === -1) {
                        hideSuggestions();
                        scope.$apply();
                    }
                };

                var onKeyUp = function (evt) {
                    if (!element.val()) {
                        showSuggestions();
                        scope.$apply();
                    }
                };

                // watch items value
                originalScope.$watch(attrs.inputPresets, function (newVal, oldVal) {
                    scope.loading = false;
                    if (newVal && newVal.length) {
                        addMatches(newVal);
                        scope.isPresetValue = true;
                    } else {
                        scope.isPresetValue = false;
                    }
                });

                $timeout(
                    function () {
                        scope.position = appendToBody
                            ? $position.offset(element)
                            : $position.position(element);
                        scope.position.top = scope.position.top + element.prop("offsetHeight");

                        element.on("click", onClick).on("keydown", onKeyDown).on("keyup", onKeyUp);

                        $document.on("click.inputpresets", onDocumentClick);

                        //pop-up element used to display matches
                        var popUpEl = angular.element("<div input-presets-popup></div>");
                        popUpEl.attr({
                            matches: "matches",
                            active: "activeIdx",
                            select: "select(activeIdx)",
                            query: "query",
                            opened: "opened",
                            position: "position",
                        });
                        //custom item template
                        if (angular.isDefined(attrs.inputPresetsMatchTemplateUrl)) {
                            popUpEl.attr("template-url", attrs.inputPresetsMatchTemplateUrl);
                        }
                        popUpEl.attr("popup-title", attrs.popUpTitle);

                        var $popup = $compile(popUpEl)(scope);

                        if (appendToBody) {
                            $("body").append($popup);
                        } else {
                            element.after($popup);
                        }
                        showSuggestions();
                    },
                    10,
                    false,
                );
            },
        };
    })

    .directive("inputPresetsPopup", function () {
        return {
            restrict: "EA",
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "=",
                opened: "=",
                popupTitle: "@",
                select: "&",
            },
            replace: true,
            templateUrl: "template/typeahead/typeahead-popup-presets.html",
            link: function (scope, element, attrs) {
                scope.templateUrl = attrs.templateUrl;

                scope.isOpen = function () {
                    return scope.opened;
                };

                scope.isActive = function (matchIdx) {
                    return scope.active == matchIdx;
                };

                scope.selectActive = function (matchIdx) {
                    scope.active = matchIdx;
                };

                scope.selectMatch = function (activeIdx) {
                    scope.select({ activeIdx: activeIdx });
                };
            },
        };
    });
