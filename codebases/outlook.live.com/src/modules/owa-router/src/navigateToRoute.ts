import router, { getCurrentRoute } from './routerInstance';
import { resetLastProcessedRoute } from './lastProcessedRoute';
import getScopedPath from 'owa-url/lib/getScopedPath';

let isNavigatingFlag = false;
let forceRouteHandlerFlag = false;

export function isNavigating() {
    return isNavigatingFlag;
}

export function setForceRouteHandler(value: boolean) {
    forceRouteHandlerFlag = value;
}

export function getForceRouteHandler() {
    return forceRouteHandlerFlag;
}

let vdirPrefix: string = '';
export function setVdir(vdir: string) {
    vdirPrefix = getScopedPath(vdir).substr(1) + '/';
}

export default function navigateToRoute(pathSegments: string[]) {
    let encodedPath: string = vdirPrefix + pathSegments.map(encodeURIComponent).join('/');

    // Because of when director.js calls onChange for html5history, the navigation needs to:
    // 1. Prevent navigation during navigation
    // 2. Prevent navigation if the routes are the SAME due to autorun in keepRouteCurrent
    if (isNavigating() || getCurrentRoute().join('/') == encodedPath) {
        return;
    }

    isNavigatingFlag = true;

    try {
        router.setRoute('/' + encodedPath + location.search);
    } finally {
        isNavigatingFlag = false;
        forceRouteHandlerFlag = false;
    }

    resetLastProcessedRoute();
}
