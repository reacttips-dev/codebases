import angular from "angular";

angular.module("sw.common").directive("swShowLoading", function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            var activityIndecator =
                "" +
                '<div class="sw-spinner center">' +
                '<div class="rect1"></div>' +
                '<div class="rect2"></div>' +
                '<div class="rect3"></div>' +
                '<div class="rect4"></div>' +
                '<div class="rect5"></div>' +
                "</div>";

            element.wrap('<div style="position: relative" class="activityWrapper"></div>');
            element.css({ position: "relative" });
            var currentlyVisible;
            var updateVisibilty = function (val) {
                if (val === undefined) {
                    val = !!scope[attrs.swShowLoading];
                }
                if (currentlyVisible !== val) {
                    if (val) {
                        element.css({ opacity: 0.2 });
                        element.after(activityIndecator);
                        element.bind("click", function (e) {
                            e.stopPropagation();
                            return false;
                        });
                    } else {
                        element.css({ opacity: 1 });
                        element.next().remove();
                        element.unbind("click");
                    }
                    currentlyVisible = val;
                }
            };
            scope.$watch(attrs.swShowLoading, updateVisibilty);
            $timeout(updateVisibilty);
        },
    };
});
