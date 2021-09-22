/**
 * Created by eran.shain on 19/06/2017.
 */
/** use this directive on a scrollable container.
    the directive will reset the container scrollTop to 0 each time a new navigation occurs in the app */

import angular from "angular";

function resetScrollTop(element: HTMLElement) {
    if (element.scrollHeight > element.clientHeight) {
        element.scrollTop = 0;
    }
}

function autoScrollTop() {
    return ($scope, $element) => {
        const element = $element[0];
        const resetElementScrollTop = resetScrollTop.bind(null, element);
        $scope.$on("navChangeComplete", resetElementScrollTop);
        setTimeout(resetElementScrollTop, 200);
    };
}

export default resetScrollTop;
angular.module("sw.common").directive("autoScrollTop", autoScrollTop);
