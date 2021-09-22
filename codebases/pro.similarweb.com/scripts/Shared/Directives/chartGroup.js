import angular from "angular";

angular.module("shared").directive("chartGroup", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: '<div class="chart-group" ng-transclude></div>',
        scope: {
            options: "=",
        },
        link: function (scope, element, attrs) {
            if ("nonResponsive" in attrs) {
                element.addClass("non-responsive");
            } else {
                element.addClass("responsive");
            }
        },
        controller: function ($scope) {
            $scope.data = [];

            var getLegendItems = function (chartScope) {
                var items = [];
                if (chartScope && chartScope.data) {
                    chartScope.data.forEach(function (a, i) {
                        if (angular.isArray(a)) {
                            items.push({
                                label: a[0],
                                value: a[1],
                                color: chartScope.colors[i],
                                id: a[2],
                            });
                        } else if (a) {
                            items.push(
                                $.extend(
                                    {
                                        label: a.name,
                                        value: a.y,
                                        color: chartScope.colors[i],
                                        id: a.id,
                                    },
                                    a.legend,
                                ),
                            );
                        }
                    });
                }
                return items;
            };

            this.showLegend = function () {
                $scope.legend && $scope.legend.showLegend();
            };

            this.registerChart = function (chartScope) {
                //console.log('registerChart', arguments);
                $scope.chart = chartScope;
                chartScope.$watch("data", function () {
                    if ($scope.legend) {
                        $scope.legend.data = getLegendItems(chartScope);
                    }
                });
            };
            this.registerLegend = function (legendScope) {
                //console.log('registerLegend', arguments);
                $scope.legend = legendScope;
                $scope.legend.data = getLegendItems($scope.chart);
            };
        },
    };
});
