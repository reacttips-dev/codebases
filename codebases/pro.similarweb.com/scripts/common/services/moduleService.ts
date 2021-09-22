import noop from "lodash/noop";
import { Injector } from "../ioc/Injector";
import { canNavigate } from "./pageClaims";

export function getActiveSibling(toState, toParams) {
    const swNavigator: any = Injector.get("swNavigator");

    const currentModule = swNavigator.getStateModule(toState);

    const siblings = swNavigator
        .getModuleStates(currentModule)
        .filter((s) => !s.abstract)
        .filter((s) => canNavigate(s, toParams));

    if (siblings.length === 0) {
        return null;
    }

    const notHomeSiblings = siblings.filter((s) => !swNavigator.isHomePage(s));
    if (notHomeSiblings.length > 0) {
        return notHomeSiblings[0].name;
    }
    return siblings[0].name;
}

export function getHomePage(toState, toParams) {
    const swNavigator: any = Injector.get("swNavigator");

    const isGrow = swNavigator.isLeadGenerator(toState);
    const growHomeState = swNavigator.getGrowHomeState();

    if (isGrow && canNavigate(growHomeState, toParams)) {
        return growHomeState;
    }

    return swNavigator.getResearchHomeState();
}

let matcherCache: any[] = null;
function setAbsoluteUrl(state) {
    if (!state || state.absoluteUrl !== undefined) {
        return;
    }

    const stateUrl = state.url || "";
    if (!state.parent) {
        state.absoluteUrl = stateUrl;
        return;
    }

    const $state: any = Injector.get("$state");

    const parentState: any = $state.get(state.parent);

    if (parentState.absoluteUrl === undefined) {
        setAbsoluteUrl(parentState);
    }

    state.absoluteUrl = parentState.absoluteUrl + stateUrl;
}

function initMatcherCache() {
    if (matcherCache) {
        return;
    }

    const $state: any = Injector.get("$state");
    const $urlMatcherFactory: any = Injector.get("$urlMatcherFactory");

    const states = $state.get().filter((s) => !s.abstract);

    states.forEach((s) => setAbsoluteUrl(s));

    matcherCache = states.map((s: any) => ({
        stateName: s.name,
        matcher: $urlMatcherFactory.compile(
            s.absoluteUrl.startsWith("^") ? s.absoluteUrl.substring(1) : s.absoluteUrl,
        ),
    }));
}

function parseUrl(url: string) {
    const $state: any = Injector.get("$state");

    initMatcherCache();

    const decodedUrl = decodeURI(url).replace("/#", "");

    const queryParamsIndex = decodedUrl.indexOf("?");
    const path = queryParamsIndex >= 0 ? decodedUrl.substring(0, queryParamsIndex + 1) : decodedUrl;
    const paramsString = queryParamsIndex >= 0 ? decodedUrl.substring(queryParamsIndex + 1) : "";

    const params = {};
    paramsString
        .split("&")
        .filter((p) => p)
        .forEach((p) => {
            const keyValue = p.split("=");
            if (keyValue && keyValue.length > 0) {
                params[keyValue[0]] = keyValue.length > 1 ? keyValue[1] : true;
            }
        });

    for (let m of matcherCache) {
        const match = m.matcher.exec(path, params);
        if (match) {
            const state = $state.get(m.stateName);
            return {
                state,
                params: match,
            };
        }
    }

    return null;
}

function getActiveChildLink(url: string) {
    try {
        const parsedUrl = parseUrl(url);

        if (!parsedUrl) {
            return url;
        }

        const $state: any = Injector.get("$state");

        const { state, params } = parsedUrl;

        const navigate = canNavigate(state, params);
        if (navigate) {
            return url;
        }

        /****
        * Note: This functionality is currently not in use *
        * reroutes a click on a locked link to first unlocked sibling link.
        * const activeSibling = getActiveSibling(state, params);
        if (activeSibling){
            return $state.href(activeSibling, params);
        }
        ***/
        return null;
    } catch (e) {}

    return url;
}

export function processMenuItem(menuItem) {
    if (!menuItem || !menuItem.link) {
        return menuItem;
    }

    const moduleChildLink = getActiveChildLink(menuItem.link);
    const moduleChildLinks = menuItem.subLinks?.filter(getActiveChildLink);

    if (!moduleChildLink && !(moduleChildLinks?.length > 0)) {
        menuItem.isDisabled = true;
        menuItem.onClick = noop;
    }

    return menuItem;
}
