import angular from "angular";

angular.module("shared").directive("swSiteColor", function (chosenSites) {
    return {
        restrict: "A",
        link: function (scope, el, attrs) {
            //console.log("el + color, attrs", el, chosenSites.getSiteColor(attrs.swSiteColor), attrs.title);
            el.css("background", chosenSites.getSiteColor(attrs.swSiteColor));
        },
    };
});
