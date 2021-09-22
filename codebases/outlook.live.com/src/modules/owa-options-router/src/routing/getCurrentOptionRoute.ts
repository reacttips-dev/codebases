import { getOptionRouteState } from 'owa-options-view';
import { OPTION_ROUTE_KEYWORD } from './optionRoutes';

export default function getCurrentOptionRoute(): string[] {
    let route: string[] = [];

    let optionState = getOptionRouteState();
    if (
        optionState.isFullOptionsShown &&
        optionState.areAllAllowedSubCategoriesLoaded &&
        optionState.currentCategoryKey &&
        optionState.currentSubCategoryKey
    ) {
        route = [
            OPTION_ROUTE_KEYWORD,
            optionState.currentCategoryKey,
            optionState.currentSubCategoryKey,
        ];

        if (optionState.currentOptionKey) {
            route.push(optionState.currentOptionKey);
        }
    }

    return route;
}
