import angular from "angular";
import React from "react";
import { ChartMarkerService } from "services/ChartMarkerService";
import { Injector } from "../ioc/Injector";
import { CHART_COLORS } from "../../../app/constants/ChartColors";
import { SwTrack } from "../../../app/services/SwTrack";

angular.module("sw.common").directive("swLegend", function (sitesResource) {
    const templates = {
        legend: "/partials/directives/legend.html",
        legendData: "/partials/directives/legend-data.html",
        legendReact: "/partials/directives/legend-react.html",
        legendReactWWO: "/partials/directives/legend-data-wwograph.html",
        legendBulletReact: "/partials/directives/legend-bullet-react.html",
    };
    return {
        restrict: "AE",
        template: "<div ng-include='template'></div>",
        scope: {
            items: "=",
            chartConfig: "=",
            legendData: "=",
            legendContainerClass: "=?",
            colorsSource: "=",
            trackName: "=",
            trackWidgetType: "=",
            onToggle: "&?",
            customTemplate: "=",
            useNewLegends: "=",
            legendsGridColumnGap: "=",
            showLegendsData: "=",
            useBulletLegends: "=",
            reactLegendComponent: "=?",
        },
        link: {
            pre: function (scope, element, attrs) {
                const swNavigator = Injector.get("swNavigator");
                const isSingleMode = swNavigator.$stateParams.key
                    ? swNavigator.$stateParams.key.split(",").length === 1
                    : null;
                const HasAutoCompareList = isSingleMode && scope.items.length > 1;
                scope.template = templates.legend;
                scope.itemMarker = function (color) {
                    return `url(${ChartMarkerService.createMarkerSrc(color)})`;
                };
                scope.getIcon = function (item) {
                    return item.icon || item.Icon || item.image;
                };
                if (scope.reactLegendComponent) {
                    const legendComponent = scope.reactLegendComponent;
                    scope.reactComponent = () => React.createElement(legendComponent, { scope });
                    scope.template = `/app/components/widget/widget-templates/react-legend-component.html`;
                } else if (scope.legendData) {
                    scope.template = templates.legendData;
                    scope.itemMarker = function (color) {
                        return (
                            '<span class="item-marker" style="background: ' + color + '"></span>'
                        );
                    };
                } else if (scope.customTemplate) {
                    scope.template = scope.customTemplate;
                }
                // in case of use newLegends we use the legend react template
                if (scope.useNewLegends) {
                    if (
                        scope.trackWidgetType === "WWOVisitsGraph" &&
                        isSingleMode &&
                        HasAutoCompareList
                    ) {
                        scope.template = templates.legendReactWWO;
                    } else {
                        scope.template = templates.legendReact;
                    }
                }
                if (scope.useBulletLegends) {
                    scope.template = templates.legendBulletReact;
                }
                scope.colors = scope.colorsSource
                    ? CHART_COLORS[scope.colorsSource]
                    : CHART_COLORS.compareMainColors;

                // fallback in case chosenSites service hasn't finished it's request yet
                if (scope.items && scope.items.length > 0 && !scope.getIcon(scope.items[0])) {
                    scope.items.forEach(function (item) {
                        if (item.icon && item.icon.match(/url=[^&]/)) {
                            sitesResource.GetWebsiteImage({ website: item.id }, function (data) {
                                item.icon = data.image;
                            });
                        }
                    });
                }

                scope.toggleSeries = function (item, show, $event, reRenderLegendsComponent) {
                    //in react context, in order to re-render after scope changes
                    if (scope.useNewLegends && !scope.$$phase) {
                        scope.$apply(() => {
                            scope.toggleSeriesInner(item, show, $event);
                            reRenderLegendsComponent && reRenderLegendsComponent();
                        });
                    } else {
                        scope.toggleSeriesInner(item, show, $event);
                    }
                };

                scope.toggleSeriesInner = function (item, show, $event) {
                    const hasValue = (obj, key) => obj.hasOwnProperty(key) && obj[key] !== null;

                    if (typeof item.onClick == "function") {
                        item.hidden = !item.hidden;
                        item.onClick(item.hidden);
                        return;
                    }
                    if (scope.chartConfig && scope.chartConfig.series) {
                        const series = scope.chartConfig.series.find(
                            (series) =>
                                (hasValue(series, "key") && series.key === item.id) ||
                                (hasValue(series, "id") && series.id === item.id) ||
                                (hasValue(series, "name") && series.name === item.id) ||
                                (hasValue(series, "name") && series.name === item.name),
                        );
                        if (series && !item.alwaysDisabled) {
                            series.visible = series.visible === false;
                            item.hidden = !series.visible;
                            if (scope.onToggle) {
                                scope.onToggle();
                            }
                            SwTrack.all.trackEvent(
                                "Click Filter",
                                item.hidden ? "remove" : "click",
                                scope.trackName + "/" + (item.name || item.Title),
                            );
                        } else {
                            scope.$emit("onSwLegendItemClick", item.name, show, $event);
                        }
                    }
                };
            },
        },
        // this watch intention is to shorten numbers/text when legend line breaks graph widget
        controller: function ($scope, $element, $timeout, $compile) {
            $scope.$watch("items[0].data", function (val) {
                $timeout(function () {
                    if (val) {
                        $(".legend-item").removeClass("disabled");
                        const potentialLegendWidth =
                                $($element).parent().innerWidth() -
                                $($element)
                                    .parent()
                                    .find(".swWidget-utilityGroup--titleRow")
                                    .innerWidth(),
                            elem = $($element).find(".legend-data"),
                            elemWidth = elem.innerWidth(),
                            elemChilds = elem.find(".item-name"),
                            margin = 30;
                        if (elemWidth > potentialLegendWidth - margin) {
                            $scope.items.forEach(function (item, index) {
                                if (
                                    $scope.items.length === 3 &&
                                    $(elemChilds[index]).text().length > 19
                                ) {
                                    $(elemChilds[index]).css({ maxWidth: "150px" });
                                } else if (
                                    $scope.items.length === 4 &&
                                    $(elemChilds[index]).text().length > 16
                                ) {
                                    $(elemChilds[index]).css({ maxWidth: "130px" });
                                } else if (
                                    $scope.items.length === 5 &&
                                    $(elemChilds[index]).text().length > 14
                                ) {
                                    $(elemChilds[index]).css({ maxWidth: "110px" });
                                }
                                if (
                                    item.format === "noFractionNumber" ||
                                    item.format === "decimalNumber"
                                ) {
                                    item.format = "abbrNumber";
                                }
                            });
                        }
                    }
                }, 1);
            });

            $scope.$watch("customTemplate", (newVal, oldVal) => {
                if (newVal !== oldVal && newVal && oldVal) {
                    $scope.template = newVal;
                }
            });
        },
    };
});
