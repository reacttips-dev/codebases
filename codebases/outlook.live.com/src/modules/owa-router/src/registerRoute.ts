import type OnNavigateFromRouteHandler from './OnNavigateFromRouteHandler';
import type OnNavigateToRouteHandler from './OnNavigateToRouteHandler';
import onRouteChanged from './onRouteChanged';
import router from './routerInstance';
import getScopedPath from 'owa-url/lib/getScopedPath';

export type RegisterRouteFunction = (
    route: string,
    onNavigateTo: OnNavigateToRouteHandler,
    onNavigateFrom?: OnNavigateFromRouteHandler
) => void;

export function getRegisterRouteFunction(
    vdir: string,
    setModuleForVdir?: () => void
): RegisterRouteFunction {
    return (
        route: string,
        onNavigateTo: OnNavigateToRouteHandler,
        onNavigateFrom?: OnNavigateFromRouteHandler
    ) => registerRoute(route, onNavigateTo, onNavigateFrom, vdir, setModuleForVdir);
}

export default function registerRoute(
    partialRoute: string,
    onNavigateTo: OnNavigateToRouteHandler,
    onNavigateFrom: OnNavigateFromRouteHandler | undefined,
    vdir: string,
    setModuleForVdir?: () => void
) {
    const route = getScopedPath('/' + vdir) + partialRoute;
    router.on(route, function (...args: any[]) {
        // director.js's async router.on API dictates that the last argument passed to the callback will be
        // a "next" function to indicate the router handling is done
        const next = args.pop();

        const results = onRouteChanged(
            route,
            {
                onNavigateTo: onNavigateTo,
                onNavigateFrom: onNavigateFrom,
            },
            args,
            setModuleForVdir
        );

        results.then(next);
    });
}
