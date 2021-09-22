import angular from "angular";
import {
    IRoutingMiddleware,
    RoutingMiddlewareHandler,
    RoutingMiddlewareRunStage,
    RoutingState,
    RoutingParams,
} from "./types";
import { RawParams } from "@uirouter/angularjs";
import { IRouterState } from "routes/allStates";

import { IAngularEvent } from "angular";

export type Handlers = { [key in RoutingMiddlewareRunStage]: RoutingMiddlewareHandler[] };

const routingMiddleware = (): IRoutingMiddleware => {
    const handlers: Handlers = {
        beforeTransition: [],
        afterTransition: [],
    };

    return {
        run(
            stage: RoutingMiddlewareRunStage,
            event: IAngularEvent,
            toState: RoutingState,
            toParams: RoutingParams,
            fromState: RoutingState,
            fromParams: RoutingParams,
        ) {
            for (const handler of handlers[stage]) {
                if (!event.defaultPrevented) {
                    handler(event, toState, toParams, fromState, fromParams);
                }
            }
        },

        on(stage: RoutingMiddlewareRunStage, handler: RoutingMiddlewareHandler) {
            handlers[stage].push(handler);
        },
    };
};

angular.module("sw.common").factory("routingMiddleware", routingMiddleware);
