import angular from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { HOME_ROUTE } from "routes/handlers/useCaseScreen/constants";
import { hasUseCaseConfig } from "use-case/common/config/useCaseConfig";
import useCaseService from "use-case/common/services/useCaseService/useCaseService";
import { USE_CASE_LIST_ROUTE, USE_CASE_ROUTES } from "./constants";
import { IAngularEvent } from "angular";
import { IRouterState } from "routes/allStates";

export const enforceUseCaseScreen = (swNavigator: SwNavigator) => (
    event: IAngularEvent,
    toState: IRouterState,
) => {
    const isUseCaseRoute = USE_CASE_ROUTES.includes(toState.name);

    if (hasUseCaseConfig(swSettings)) {
        if (!isUseCaseRoute && !useCaseService.isSeen()) {
            event.preventDefault();
            swNavigator.go(USE_CASE_LIST_ROUTE);
        }
    } else if (isUseCaseRoute) {
        // The user isn't eligible and trying to get to a use case route, redirect to home
        event.preventDefault();
        swNavigator.go(HOME_ROUTE);
    }
};

angular.module("sw.common").factory("enforceUseCaseScreen", enforceUseCaseScreen);
