import type RouteHandlers from './RouteHandlers';
import getParameters from './getParameters';
import navigateToRoute, { isNavigating, getForceRouteHandler } from './navigateToRoute';
import { getCurrentRoute } from './routerInstance';
import {
    getLastProcessedRoute,
    updateLastProcessedRouteHandlers,
    resetLastProcessedRoute,
} from './lastProcessedRoute';

export default function onRouteChanged(
    route: string,
    handlers: RouteHandlers,
    args: any[],
    setModuleForVdir?: () => void
): Promise<any> {
    const newParameters = getParameters(route, args);
    const lastProcessedRoute = getLastProcessedRoute();
    const currentRoute = getCurrentRoute();
    const forceRouteHandler = getForceRouteHandler();

    // Don't call the route handler if we've already processed this route (e.g.
    // because the route change was due an application state change)
    if (
        isDifferentRoute(currentRoute, lastProcessedRoute.route) &&
        (!isNavigating() || forceRouteHandler)
    ) {
        let shouldPreventNavigation: Promise<boolean> | boolean = false;
        if (lastProcessedRoute.handlers?.onNavigateFrom) {
            shouldPreventNavigation = lastProcessedRoute.handlers.onNavigateFrom(
                lastProcessedRoute.route,
                lastProcessedRoute.parameters,
                currentRoute,
                newParameters.named
            );
        }

        let handleNavigation = (preventNavigation: boolean) => {
            if (preventNavigation) {
                // Restore the old route without processing the new route's handlers
                navigateToRoute(lastProcessedRoute.route || []);
            } else {
                setModuleForVdir?.();

                // Invoke the handler for the new route
                handlers.onNavigateTo(newParameters.named, newParameters.all);

                // Update records for the last processed route
                resetLastProcessedRoute();
                updateLastProcessedRouteHandlers(handlers, newParameters);
            }
            return Promise.resolve();
        };

        if (typeof shouldPreventNavigation === 'boolean') {
            return handleNavigation(shouldPreventNavigation);
        } else {
            return shouldPreventNavigation.then(handleNavigation);
        }
    } else {
        // In the event this is a callback due to state change,
        // we still want to store the handlers and such for later cleanup
        updateLastProcessedRouteHandlers(handlers, newParameters);
        return Promise.resolve();
    }
}

function isDifferentRoute(newRoute: string[], oldRoute: string[] | null) {
    return (newRoute || []).join('/') !== (oldRoute || []).join('/');
}
