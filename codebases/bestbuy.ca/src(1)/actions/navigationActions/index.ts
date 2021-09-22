var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as url from "url";
import { errorActiontype } from "..";
import { ApiMenusContentProvider } from "../../providers/ContentProvider/ApiMenusContentProvider";
export const navigationActionTypes = {
    clear: "NAVIGATION_CLEAR",
    displayCategory: "NAVIGATION_DISPLAY_CATEGORY",
    retrieveCategory: "NAVIGATION_RETRIEVE_CATEGORY",
    viewCart: "NAVIGATION_VIEW_CART",
    toggleFlyoutOverlay: "NAVIGATION_TOGGLE_FLYOUT_OVERLAY",
    trackMenu: "NAVIGATION_TRACK_MENU",
    retrieveBrandsMenuContent: "NAVIGATION_RETRIEVE_BRANDS_MENU_CONTENT",
    retrieveShopMenuContent: "NAVIGATION_RETRIEVE_SHOP_MENU_CONTENT",
    retrieveGlobalMenuContent: "NAVIGATION_RETRIEVE_GLOBAL_MENU_CONTENT",
    findSearchSuggestions: "NAVIGATION_FIND_SEARCH_SUGGESTIONS",
};
export const navigationActionCreatorsFactory = ({ logger, config, }) => {
    const navigationActionCreators = {
        clear: () => ({
            type: navigationActionTypes.clear,
        }),
        trackMenu: (itemName) => ({
            type: navigationActionTypes.trackMenu,
            payload: {
                menuClicked: itemName,
            },
        }),
        toggleFlyoutOverlay: (open = false) => {
            return {
                type: navigationActionTypes.toggleFlyoutOverlay,
                open,
            };
        },
        displayCategory: (categoryId) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
            const state = getState();
            if (state.navigation.loading) {
                return;
            }
            dispatch({
                selectedCategory: categoryId,
                type: navigationActionTypes.displayCategory,
            });
        }),
        viewCart: () => (dispatch) => {
            const basketUrl = url.parse(config.basketServiceApiUrl);
            const formattedUrl = url.format(basketUrl);
            logger.info(`Navigating to the view cart URI: ${formattedUrl}`);
            dispatch({
                type: navigationActionTypes.viewCart,
            });
            window.location.assign(formattedUrl);
        },
        retrieveBrandsMenuContent: (locale) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
            const state = getState();
            try {
                const brandsMenuContent = state.navigation.brandsMenuContent ||
                    (yield new ApiMenusContentProvider(config.contentApiUrl, locale, logger).getBrandsMenu());
                dispatch({
                    type: navigationActionTypes.retrieveBrandsMenuContent,
                    brandsMenuContent,
                });
            }
            catch (error) {
                dispatch({
                    type: errorActiontype.error,
                });
            }
        }),
        retrieveShopMenuContent: (locale) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
            const state = getState();
            try {
                const shopMenuContent = state.navigation.shopMenuContent ||
                    (yield new ApiMenusContentProvider(config.contentApiUrl, locale, logger).getShopMenu());
                dispatch({
                    type: navigationActionTypes.retrieveShopMenuContent,
                    shopMenuContent,
                });
            }
            catch (error) {
                dispatch({
                    type: errorActiontype.error,
                });
            }
        }),
        retrieveGlobalMenuContent: (locale) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
            const state = getState();
            try {
                const globalMenuContent = state.navigation.globalMenuContent ||
                    (yield new ApiMenusContentProvider(config.contentApiUrl, locale, logger).getGlobalMenu());
                dispatch({
                    type: navigationActionTypes.retrieveGlobalMenuContent,
                    globalMenuContent,
                });
            }
            catch (error) {
                dispatch({
                    type: errorActiontype.error,
                });
            }
        }),
    };
    return navigationActionCreators;
};
//# sourceMappingURL=index.js.map