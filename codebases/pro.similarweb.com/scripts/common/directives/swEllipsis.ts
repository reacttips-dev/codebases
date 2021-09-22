import angular from "angular";

angular.module("sw.common").directive("swEllipsis", function () {
    return {
        restrict: "E",
        template:
            '<div><sw-react component="EllipsisUtilityContainer" props="{onClick: onClick, onToggle: onToggle, items: utility.properties.items, options: {isExcelAllowed: isExcelAllowed,isHaveBanner : isHaveBanner}}"></sw-react></div>',
        replace: true,
        scope: {
            widget: "=",
            utility: "=",
            onClick: "=",
            onToggle: "=",
            isExcelAllowed: "=",
            isHaveBanner: "&",
        },
    };
});
