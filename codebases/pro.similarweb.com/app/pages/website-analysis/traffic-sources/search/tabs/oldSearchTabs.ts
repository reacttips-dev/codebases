/**
 * Created by Eran.Shain on 3/7/2017.
 */
angular.module("sw.common").directive("oldSearchTab", ($compile) => {
    return {
        link($scope: any, $element, $attrs: any) {
            let $childScope = $scope.oldCtrlScope.$new();
            $childScope.templateUrl = $attrs.oldSearchTab;
            $childScope.webSource = $scope.ctrl.webSource;
            $compile('<div ng-include="templateUrl"></div>')($childScope).appendTo($element);
        },
    };
});
