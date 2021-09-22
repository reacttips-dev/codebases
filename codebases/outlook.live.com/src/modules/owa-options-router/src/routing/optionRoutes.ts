import type { RegisterRouteFunction } from 'owa-router';
import {
    lazyMountAndShowFullOptions,
    lazyHideFullOptions,
    lazyConfirmDirtyOptionsAndPerformAction,
} from 'owa-options-view';

export const OPTION_ROUTE_KEYWORD = 'options';

interface OptionRouteParameters {
    category?: string;
    subcategory?: string;
    option?: string;
}

async function optionsRouteHandler(parameters: OptionRouteParameters) {
    let { category, subcategory, option } = parameters;
    await lazyMountAndShowFullOptions.importAndExecute(category, subcategory, option);
}

async function optionsRouteCleanupHandler(
    oldRoute?: string[],
    oldParameters?: OptionRouteParameters,
    newRoute?: string[],
    newParameters?: OptionRouteParameters
): Promise<boolean> {
    const isOptionsClosing = newRoute[0] !== OPTION_ROUTE_KEYWORD;
    const needToSaveDiscard =
        isOptionsClosing ||
        oldParameters.category != newParameters.category ||
        oldParameters.subcategory != newParameters.subcategory;
    return new Promise<boolean>(async resolve => {
        const confirmDirtyOptionsAndPerformAction = await lazyConfirmDirtyOptionsAndPerformAction.import();

        if (needToSaveDiscard) {
            confirmDirtyOptionsAndPerformAction(
                async () => {
                    resolve(false /* preventNavigation */);
                    if (isOptionsClosing) {
                        // We're navigating away from options
                        const hideFullOptions = await lazyHideFullOptions.import();
                        hideFullOptions(false);
                    }
                },
                () => resolve(true /* preventNavigation */)
            );
        } else {
            resolve(false /* preventNavigation */);
        }
    });
}

export function initializeOptionRoutes(registerRouteFunc: RegisterRouteFunction) {
    const registerRoute = (route: string) => {
        registerRouteFunc(route, optionsRouteHandler, optionsRouteCleanupHandler);
    };
    registerRoute(`/${OPTION_ROUTE_KEYWORD}`);
    registerRoute(`/${OPTION_ROUTE_KEYWORD}/:category`);
    registerRoute(`/${OPTION_ROUTE_KEYWORD}/:category/:subcategory`);
    registerRoute(`/${OPTION_ROUTE_KEYWORD}/:category/:subcategory/:option`);
}
