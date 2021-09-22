import {RoutingState} from "reducers";
import {RouteManager} from "@bbyca/apex-components";
import {default as curry} from "lodash-es/curry";

export const getSkuFromLocation = curry((router: RouteManager, language: Language, path: string): string => {
    const {sku} = router.getParams(language, path) as {sku: string};
    return sku;
});

export type TransitionLocations = Pick<RoutingState, "locationBeforeTransitions" | "previousLocationBeforeTransitions">;
const isSamePdp = (
    {previousLocationBeforeTransitions, locationBeforeTransitions}: TransitionLocations,
    language: Language,
    routeManager: RouteManager,
): boolean => {
    const previousLocationPathname =
        (previousLocationBeforeTransitions && previousLocationBeforeTransitions.pathname) || "";
    const currentLocationPathname = (locationBeforeTransitions && locationBeforeTransitions.pathname) || "";
    const currentSku = currentLocationPathname && getSkuFromLocation(routeManager, language, currentLocationPathname);
    const previousSku =
        previousLocationPathname && getSkuFromLocation(routeManager, language, previousLocationPathname);
    return !!(currentSku && previousSku && currentSku === previousSku);
};

export default isSamePdp;
