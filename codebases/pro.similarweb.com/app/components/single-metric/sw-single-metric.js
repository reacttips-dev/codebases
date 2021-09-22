import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

const SINGLE_METRIC_TEMPLATE_PATH = "/app/components/single-metric/cell-templates/";
angular
    .module("sw.common")
    .service("singleMetricService", function () {
        /*
         * @param {obj} config
         * @returns {obj} row configuration object
         */
        function Row(config) {
            this.field = config.field || "TotalVisits";
            this.displayName = config.displayName || "Total Visits";
            this.cellTemplate =
                SINGLE_METRIC_TEMPLATE_PATH + (config.cellTemplate || "default") + ".html";
            this.headerTemplate =
                config.headerTemplate === "none"
                    ? false
                    : SINGLE_METRIC_TEMPLATE_PATH +
                      (config.headerTemplate || "default-header") +
                      ".html";
            this.format = config.format || "";
            this.titleFormat = config.titleFormat || "";
            this.rowClass = config.rowClass || null;
            this.isBeta = config.isBeta;
            this.ppt = config.ppt;
        }
        return {
            row: function (config) {
                return new Row(config);
            },
        };
    })
    .directive("swSingleMetric", function (singleMetricService, ngHighchartsConfig, swNavigator) {
        return {
            restrict: "E",
            scope: {
                data: "=",
                rows: "=",
                options: "=",
                widget: "=",
            },
            template: '<div ng-if="data" ng-include="templateUrl" style="height: 100%;"></div>',
            //replace: true,
            controllerAs: "ctrl",
            controller: function ($scope) {
                // for use with the trend-line cell template
                const ctrl = this;
                ctrl.widget = $scope.widget;
                $scope.templateUrl =
                    $scope.options.template || "/app/components/single-metric/single-metric.html";
                if (!$scope.options.template) {
                    $scope.rows.forEach(function (row) {
                        if (row.cellTemplate.indexOf("trend-line") > 0) {
                            const data = $scope.data[row.field];
                            const isWindow = ctrl.widget.apiParams.isWindow;
                            if (data && data.length > 1 && !isWindow) {
                                ctrl.chartConfig = ngHighchartsConfig.trendLineWidget(
                                    data,
                                    $scope.rows[0].format,
                                );
                                ctrl.hasTrendLine = true;
                            } else {
                                ctrl.chartConfig = ngHighchartsConfig.trendLineWidget([]);
                                ctrl.hasTrendLine = false;
                            }
                        }
                    });
                }

                $scope.getGeographyLink = function (countryId) {
                    const params = swNavigator.getParams();
                    return swNavigator.href("websites-audienceGeography", {
                        country: countryId,
                        duration: params.duration,
                        isWWW: params.isWWW,
                        key: params.key,
                    });
                };

                $scope.getCountryLink = function (countryId) {
                    return swNavigator.href("industryAnalysis-topSites", {
                        country: countryId,
                        duration: "1m",
                        category: "All",
                    });
                };

                $scope.getCategoryLink = function (category) {
                    category = category.replace("/", "~");
                    return swNavigator.href("industryAnalysis-topSites", {
                        country: swNavigator.getParams().country,
                        duration: "1m",
                        category: category,
                    });
                };

                $scope.getSubCategoryText = function (category) {
                    const splitCategory = category.split("/");
                    // if subcategory exists, indicate it with '...>'
                    return splitCategory.length > 1
                        ? `.../${splitCategory[splitCategory.length - 1]}`
                        : splitCategory[splitCategory.length - 1];
                };

                $scope.getIconClass = function () {
                    if ($scope.data.Change < 0) {
                        return "sw-icon-change-icon arrow--negative-rounded";
                    } else if ($scope.data.Change > 0) {
                        return "sw-icon-change-icon arrow--positive-rounded";
                    } else if ($scope.data.Change == 0) {
                        return "no-change-rounded";
                    } else {
                        return "na--icon";
                    }
                };

                $scope.getTextClass = function () {
                    if ($scope.data.Change < 0) {
                        return "negative-text";
                    } else if ($scope.data.Change > 0) {
                        return "positive-text";
                    } else {
                        return "no-change-text";
                    }
                };

                $scope.hasChangeValue = function () {
                    return angular.isNumber($scope.data.Change);
                };

                $scope.trackClick = function (category, name) {
                    SwTrack.all.trackEvent(category, "click", name);
                };
            },
        };
    });
