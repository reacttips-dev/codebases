import { swSettings } from "common/services/swSettings";
import { SwNavigator } from "common/services/swNavigator";
import { IRouterState } from "routes/allStates";
export type Solutions2Package =
    | "digitalmarketing"
    | "marketresearch"
    | "salesIntelligence"
    | "legacy"
    | "workspace"
    | "dashboards";

/**
 * Checks if the user has access to the specified package name.
 * this is a solutions 2.0 extention, that checks which packages the user has access to.
 */
export const hasAccessToPackage = (packageName: Solutions2Package): boolean => {
    switch (packageName) {
        case "digitalmarketing":
            return swSettings.user.hasDM;

        case "marketresearch":
            return swSettings.user.hasMR;

        case "legacy":
            return swSettings.user.isSimilarWebUser || !swSettings.user.hasSolution2;

        case "salesIntelligence":
            return swSettings.user.isSimilarWebUser || swSettings.user.hasSI;

        case "workspace":
        case "dashboards":
            return true;

        // If we have no package name for the current state, we need to assume
        // that the user has access to it. this is done to have backward compatibility
        // with states that were not-yet tagged under a package name.
        default:
            return true;
    }
};

/**
 * Checks if the current state belongs to a package that the user has access to.
 */
export const hasAccessToState = (state: IRouterState, navigator: SwNavigator): boolean => {
    const statePackage = navigator.getPackageName(state) as Solutions2Package;
    return hasAccessToPackage(statePackage);
};

/**
 * In case the user navigates to a state that belongs to a legacy package (such as WebsiteResearch)
 * from a solutions 2.0 package - we want to reroute the navigation to an equivalent state that belongs
 * to the solutions 2.0 package (and in the same section - packageInnerLevel), this enables the user to stay within his current solutions 2.0 package, even
 * when navigating via internal page links.
 * i.e when user is in DMI package, in affiliates research in website performance page and clicks
 * the outgoing traffic cta he will be redirected to the outgoing traffic page of this section
 */
export const getLegacyState = (
    toState: IRouterState,
    packagePriority: Solutions2Package[],
    packageInnerLevel?: string,
): string => {
    // In case the target state is not a legacy state,
    // then there's no need to do any reroute.
    if (!toState.hasOwnProperty("legacy")) {
        return null;
    }

    const legacyPackageName = packagePriority?.find(
        (pkgName) => !!toState.legacy[pkgName] && hasAccessToPackage(pkgName),
    );

    return legacyPackageName
        ? packageInnerLevel
            ? toState.legacy[legacyPackageName][packageInnerLevel]
            : toState.legacy[legacyPackageName]
        : null;
};

/**
 * In case the user is trying to navigate to a state that belongs to a package which the user has no access to
 * (say, a state that belongs to market research/digital marketing package)
 * try to reroute the state to an aquivalent state in a package that the user HAS access to.
 */
export const getFallbackState = (toState: IRouterState, navigator: SwNavigator) => {
    let fallbackState;
    let currentState = toState;
    while (!fallbackState && currentState) {
        const hasFallbackStates = currentState.hasOwnProperty("fallbackStates");
        if (hasFallbackStates) {
            for (const [statePackage, stateName] of Object.entries(currentState.fallbackStates)) {
                const canAccess = hasAccessToPackage(statePackage as Solutions2Package);
                if (canAccess) {
                    fallbackState = stateName;
                }
            }
        }
        currentState = navigator.getState(currentState.parent);
    }

    return fallbackState;
};

/**
 * Sales 2.0 users go to old workspace;
 */

export const getRestrictionsPathForSI = (toState: IRouterState) => {
    const path = `/${toState.parent}${toState.url}`;

    if (path.startsWith("/home/modules") || path.startsWith("/insights/home")) {
        return "home_page";
    }

    if (path.startsWith("/workspace/sales")) {
        return "workspace";
    }

    return "";
};

export const isBundleUser = () => swSettings.user.hasDM && swSettings.user.hasMR;
