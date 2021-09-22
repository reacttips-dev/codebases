import { getUuid } from "UtilitiesAndConstants/UtilityFunctions/crypto";
import { IChosenItem } from "../../@types/chosenItems";
import {
    CURRENT_PAGE,
    SET_CHOSEN_ITEMS,
    SET_CHOSEN_ITEMS_HEADER_DATA,
    TOGGLE_PINK_BADGE,
    URL_CHANGE,
    SET_PAGE_TRANSITION,
} from "../../action_types/routing_action_types";

export interface INRoutingState {
    currentPage?: string;
    currentModule?: string;
    pageChanged?: boolean;
    moduleChanged?: boolean;
    currentStateId?: string;
    chosenItems?: IChosenItem[];
    pageTitleConfig?: any;
    isPageTransitioning?: boolean;
}

function getDefaultState(): INRoutingState {
    return {};
}

function pageUniqueNumber() {
    return getUuid() ?? Math.ceil(Math.random() * 1000000);
}

function routing(state: INRoutingState = getDefaultState(), action): object {
    const currentPage = state.currentPage;
    const currentModule = state.currentModule;
    switch (action.type) {
        case CURRENT_PAGE: {
            return Object.assign({}, state, {
                currentModule: action.module,
                currentPage: action.page,
                pageChanged: action.page !== currentPage,
                moduleChanged: action.module !== currentModule,
                currentStateId: action.stateId,
                pageUniqueNumber: pageUniqueNumber(),
                params: action.params,
                stateConfig: action.stateConfig,
                pageTitleConfig: action.pageTitleConfig,
            });
        }
        case URL_CHANGE:
            return {
                ...state,
                params: action.params,
                pageUniqueNumber: pageUniqueNumber(),
                pageTitleConfig: {
                    ...state.pageTitleConfig,
                    pageTitle: action.pageTitleConfig.pageTitle,
                },
            };
        case SET_CHOSEN_ITEMS:
            return {
                ...state,
                chosenItems: action.chosenItems.map((item) => ({ ...item })),
            };
        case SET_CHOSEN_ITEMS_HEADER_DATA:
            const chosenItems = state.chosenItems
                ? state.chosenItems.map((item) => {
                      // find the corresponding domain data
                      const data = action.items[item.name];
                      return {
                          ...item,
                          ...data,
                      };
                  })
                : null;
            return {
                ...state,
                chosenItems,
            };
        case TOGGLE_PINK_BADGE:
            return {
                ...state,
                pageTitleConfig: {
                    ...state.pageTitleConfig,
                    pinkBadgeTitle: action.pinkBadgeTitle,
                },
            };
        case SET_PAGE_TRANSITION:
            return {
                ...state,
                isPageTransitioning: action.isPageTransitioning,
            };

        default:
            return state;
    }
}

export default routing;
