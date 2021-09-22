import keepRouteCurrent from './keepRouteCurrent';
import navigateToRoute, { setVdir } from './navigateToRoute';
import type RouterOptions from './RouterOptions';
import router from './routerInstance';
import { getRegisterRouteFunction } from './registerRoute';

export async function initializeRouter(routerOptions: RouterOptions) {
    await registerRouterRoutes(routerOptions);

    setVdir(routerOptions.vdir);
    router.configure({
        notfound: () => {
            routerOptions.routeGenerator.then(generator => {
                navigateToRoute(generator());
            });
        },
        html5history: true,
        convert_hash_in_init: false,
        run_handler_in_init: true,
        strict: false,
        async: true,
    });

    router.init();

    if (!routerOptions.staticUrl) {
        routerOptions.routeGenerator.then(generator => {
            keepRouteCurrent(generator);
        });
    }
}

export function registerRouterRoutes(routerOptions: RouterOptions, registerAll?: boolean) {
    return routerOptions.registerRoutes(
        getRegisterRouteFunction(routerOptions.vdir, routerOptions.setModuleForVdir),
        registerAll
    );
}
