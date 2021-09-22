import angular from "angular";
import { USE_CASE_ROUTES } from "routes/handlers/useCaseScreen/constants";
import { IAngularEvent } from "angular";
import useCaseService, {
    IUseCaseService,
} from "use-case/common/services/useCaseService/useCaseService";
import { IRouterState } from "routes/allStates";

const useCaseScreenSeenStateHandler = () => (event: IAngularEvent, toState: IRouterState) => {
    if (USE_CASE_ROUTES.includes(toState.name)) {
        useCaseService.markSeen();
    } else {
        useCaseService.commitOnboarding();
    }
};

angular.module("sw.common").factory("useCaseScreenSeenStateHandler", useCaseScreenSeenStateHandler);
