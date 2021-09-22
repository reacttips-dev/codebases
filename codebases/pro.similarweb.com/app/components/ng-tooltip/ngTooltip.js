import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular
    .module("sw.common")
    .directive("ngTooltip", function ($position, $controller, $compile, $document, $timeout) {
        return {
            scope: {
                ngTooltipConfig: "=",
                ngTooltip: "=",
                swTrackerLabel: "@",
            },
            link: function (scope, element, attrs) {
                const defaults = {
                    width: 150, // tooltip width
                    height: 250, // tooltip height
                    minHeight: null,
                    maxHeight: null,
                    templateUrl: "",
                    controller: "", // with $tooltipInstance injected
                    controllerAs: null,
                    placement: "top",
                    cssClass: "",
                    appendToBody: false, // append to body?
                    isolateScope: true, // inject isolate scope to controller, or the parent scope?
                    eventName: {
                        onOpen: _.identity,
                        onClose: _.identity,
                    },
                    disableTracking: null,
                };

                let ttElem;
                let silentClose = false;
                // calculate config
                const config = Object.assign({}, defaults, scope.ngTooltipConfig);
                const appendToBody = angular.isDefined(config.appendToBody)
                    ? config.appendToBody
                    : false;
                const isolateScope = angular.isDefined(config.isolateScope)
                    ? config.isolateScope
                    : true;
                const ttTemplate =
                    "<ng-tooltip-content automation-tooltip><ng-include src=\"'" +
                    config.templateUrl +
                    "'\"></ng-include></ng-tooltip-content>";
                const linker = $compile(ttTemplate);

                function onBodyClick(event) {
                    // if we click on the directive's element itself
                    if (event.target === element[0]) {
                        return;
                    }
                    // close on click outside popup
                    const $elem = angular.element(event.target);
                    const closest = $elem.closest(ttElem[0]);
                    if (!closest.length) {
                        // close tooltip
                        scope.$apply(function (_scope) {
                            _scope.ngTooltip = false;
                        });
                    }
                }

                function openPopup() {
                    // scope
                    const ttScope = isolateScope ? scope.$new(true) : scope.$parent;
                    ttScope.$$ttConfig = config;
                    ttScope.$$ttClose = function (silent) {
                        // close tooltip
                        scope.ngTooltip = false;
                        silentClose = !!silent;
                    };
                    // controller
                    const ctrlLocals = {
                        $scope: ttScope,
                        $tooltipInstance: {
                            config: config,
                            close: function (silent) {
                                // close tooltip
                                scope.ngTooltip = false;
                                silentClose = !!silent;
                            },
                        },
                    };

                    if (config.controller) {
                        const ttCtrl = $controller(
                            config.controller +
                                (config.controllerAs ? " as " + config.controllerAs : ""),
                            ctrlLocals,
                        );
                    }
                    // elem
                    ttElem = linker(ttScope, function cloneAttachFn(clonedElement, scope) {
                        if (appendToBody) {
                            $document.find("body").append(clonedElement);
                        } else {
                            element.after(clonedElement);
                        }
                    });

                    // capture click
                    $document.find("body")[0].addEventListener("click", onBodyClick, true);

                    const popupElem = ttElem.find(".ng-tooltip-element");
                    popupElem.css({
                        height: config.height,
                        "min-height": config.minHeight,
                        "max-height": config.maxHeight,
                        width: config.width,
                        opacity: 0, // don't show initially drawn popup before re-positioning
                    });
                    function positionCss() {
                        return $position.positionElements(
                            element,
                            popupElem,
                            config.placement || "bottom",
                            appendToBody,
                        );
                    }
                    $timeout(function () {
                        // position and show popup after it's content is rendered and it's position is calculated correctly according to dynamic width
                        popupElem.css(Object.assign(positionCss(), { opacity: 1 }));
                    });
                    if (!config.disableTracking) {
                        SwTrack.all.trackEvent(
                            "Drop Down",
                            "open",
                            config.eventName.onOpen(scope.swTrackerLabel),
                        );
                    }
                }

                function closePopup() {
                    // remove capture click
                    $document.find("body")[0].removeEventListener("click", onBodyClick, true);
                    scope.ngTooltip = false;
                    if (ttElem) {
                        ttElem.remove();
                        ttElem = null;
                    }
                    if (!silentClose && !config.disableTracking) {
                        SwTrack.all.trackEvent(
                            "Drop Down",
                            "close",
                            config.eventName.onClose(scope.swTrackerLabel),
                        );
                    } else {
                        silentClose = false;
                    }
                }

                scope.$watch("ngTooltip", function onToggle(newVal, oldVal) {
                    if (!_.isEqual(newVal, oldVal)) {
                        if (!newVal) {
                            closePopup();
                        } else {
                            $timeout(function () {
                                openPopup();
                            });
                        }
                    }
                });
            },
        };
    });

angular.module("sw.common").directive("ngTooltipContent", function () {
    return {
        transclude: true,
        templateUrl: "/app/components/ng-tooltip/ng-tooltip-template.html",
    };
});
