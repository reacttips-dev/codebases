import angular from "angular";
angular.module("sw.common").directive("swCarouselItem", function () {
    "use strict";
    return {
        require: "^swCarousel",
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: "/app/components/carousel/carousel-item.html",
        scope: {},
        link: function (scope, element, attr, carouselCtrl: any) {
            carouselCtrl.addCarouselItem(element);
        },
    };
});
