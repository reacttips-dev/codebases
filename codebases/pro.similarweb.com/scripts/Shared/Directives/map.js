import angular from "angular";

angular.module("shared").directive("map", function ($timeout) {
    function buildGeoMap(elem, geoData, geoOptions) {
        var geomap = new google.visualization.GeoChart(elem);
        var options = {
            legend: "none",
            colors: ["#E5EFF5", "#3999C1"],
        };
        var formatter = new google.visualization.NumberFormat({
            fractionDigits:
                geoOptions &&
                (angular.isDefined(geoOptions.fractionDigits) ? geoOptions.fractionDigits : 2),
        });

        var data = new google.visualization.arrayToDataTable(geoData);
        formatter.format(data, 1);
        var stop = $timeout(function () {
            $timeout.cancel(stop);
            geomap.draw(data, options);
        }, 0);

        // handle content resize
        return {
            redraw: function () {
                geomap.draw(data, options);
            },
        };
    }

    return {
        restrict: "E",
        scope: {
            geoData: "=",
            geoOptions: "=",
        },
        link: function (scope, element) {
            var map;
            if (!scope.geoData || scope.geoData.length < 2) {
                return;
            }
            map = buildGeoMap(element[0], scope.geoData, scope.geoData);

            scope.$on("content-resize", function () {
                if (map) map.redraw();
            });
        },
        template: '<div class="sw-geo-map chart"></div>',
        replace: true,
    };
});
