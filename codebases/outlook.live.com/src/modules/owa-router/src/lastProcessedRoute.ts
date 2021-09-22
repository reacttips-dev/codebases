import type RouteHandlers from './RouteHandlers';
import { getCurrentRoute } from './routerInstance';

export interface ProcessedRouteRecord {
    route: string[] | null;
    handlers: RouteHandlers | null;
    parameters: any;
}

let lastProcessedRoute: ProcessedRouteRecord = {
    route: ['no_route'],
    handlers: null,
    parameters: null,
};

export function getLastProcessedRoute() {
    return lastProcessedRoute;
}

export function updateLastProcessedRouteHandlers(handlers: any, parameters: any) {
    lastProcessedRoute.handlers = handlers;
    lastProcessedRoute.parameters = parameters;
}

export function resetLastProcessedRoute() {
    lastProcessedRoute.route = getCurrentRoute();
}
