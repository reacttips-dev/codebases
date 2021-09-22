import angular, { IScope } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { isSimilarwebUrl } from "use-case/common/validation/isSimilarwebUrl";

angular
    .module("sw.common")
    .controller("useCaseInputController", ($scope: IScope, swNavigator: SwNavigator) => {
        const routeParams = swNavigator.getParams();

        if (!isSimilarwebUrl(routeParams.backUrl)) {
            swNavigator.go("useCase-list");
        }

        $scope.routeParams = routeParams;
    });
