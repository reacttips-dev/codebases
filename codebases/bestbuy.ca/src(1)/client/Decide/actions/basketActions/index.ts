import {xor} from "lodash-es";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {routerActions} from "react-router-redux";
import {Location} from "history";
import {Action, ActionCreatorsMapObject} from "redux";
import {LineItemType, trackAddFromCart, trackRemoveFromCart} from "@bbyca/ecomm-checkout-components";
import {
    ERROR_UPDATE_QUANTITY,
    ERROR_REMOVE_ITEM,
    ERROR_REMOVE_WARRANTY,
    ERROR_ADD_WARRANTY,
} from "@bbyca/ecomm-checkout-components/dist/redux/cart/actionTypes";
import {IChildItemAddition} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import {State} from "store";
import {routingActionCreators} from "actions";
import {userActionCreators, getNearbyStores, userActionTypes, useQueryPostalCode} from "actions/userActions";

import routeManager from "utils/routeManager";
import {ApiAvailabilityProvider, ApiLocationProvider, sessionStorage} from "providers";
import {
    ThunkInjectables,
    ThunkResult,
    CartLineItem,
    Warranty,
    getStateFunc,
    Dispatch,
    Availabilities,
    Summary,
    CartAvailability,
    Promotion,
    ChildLineItem,
} from "models";
import {
    getIntlLanguage,
    getUserShippingLocationPostalCode,
    getUserShippingLocationRegionCode,
    getIntlLocale,
    getUserShippingLocationIds,
    isFutureDatePricingEnabled,
    getFeatureToggle,
} from "store/selectors";
import {FEATURE_TOGGLES} from "config/featureToggles";

import {errorActionCreators} from "actions/errorActions";
import {CheckoutFlow, UserState} from "reducers";
import {HttpRequestError} from "errors";

import {ApiCartProvider, ApiBasketProvider} from "../../providers";
import {
    getChildLineItemById,
    hasWarrantyInCart,
    getBasketServiceApiUrl,
    getLineItems,
    getLineItemBySku,
    getGspChildForLineItem,
    getLineItemById,
} from "../../pages/BasketPage/selectors";
import getProductListId from "../../utils/getProductListId";
import {setTermsOnStorage} from "../../pages/BasketPage/utils/termsChecked";
import {productListActionCreators} from "../productListActions";
import {ProductListIdCookieProvider} from "../../providers/ProductListIdCookieProvider";
import isCartEmpty from "../../utils/isCartEmpty";

export const cartActionTypes = {
    ANALYTICS_CART_LOADED: "cart/ANALYTICS_CART_LOADED",
    ANALYTICS_CART_PAYPAL_CLICKED: "analytics-paypal-click",
    ANALYTICS_CART_VISA_CLICKED: "analytics-visa-click",
    ANALYTICS_CART_MATERPASS_CLICKED: "cart/ANALYTICS_CART_MATERPASS_CLICKED",
    ANALYTICS_CART_ITEM_REMOVED: "cart/ANALYTICS_ITEM_REMOVED",
    ANALYTICS_CART_ITEM_SAVED: "cart/ANALYTICS_ITEM_SAVED",
    ANALYTICS_CART_QUANTITY_UPDATED: "cart/ANALYTICS_QUANTITY_UPDATED",
    ANALYTICS_WARRANTY_ADDED: "cart/ANALYTICS_WARRANTY_ADDED",
    FETCH_CART_SUCCESS: "cartPage/FETCH_CART_SUCCESS",
    CART_ERROR: "cartPage/CART_ERROR",
    MERGE_BASKET_SUCCESS: "cart/MERGE_BASKET_SUCCESS",
    MERGE_BASKET_ERROR: "cart/MERGE_BASKET_ERROR",
    UPDATE_LINE_ITEM: "cartPage/UPDATE_LINE_ITEM",
    CLEAN_UP: "cartPage/CLEAN_UP",
    UPDATE_CART: "cart/UPDATE_CART",
    CART_PROCESSING: "cartPage/CART_PROCESSING",
    CART_PROCESSING_DONE: "cartPage/CART_PROCESSING_DONE",
    CHILD_ITEM_REMOVED: "cart/CHILD_ITEM_REMOVED",
    SAVE_FOR_LATER_ERROR: "cartPage/SAVE_FOR_LATER_ERROR",
    UPDATE_CHECKOUT_FLOW: "cartPage/UPDATE_CHECKOUT_FLOW",
};

export interface BasketActionCreators extends ActionCreatorsMapObject {
    analyticsCartLoaded: () => void;
    syncRequiredPartsStateWithLocation: (location: Location) => ThunkResult<void>;
    syncBasketStateWithLocation: (location: Location) => ThunkResult<void>;
    analyticsPaypalClicked: () => void;
    analyticsVisaClicked: () => void;
    analyticsMasterpassClicked: () => void;
    removeChildItem: (lineItemId: string, childLineItemId: string) => ThunkResult<void>;
    removeItem: (lineItemId: string, sku: string) => ThunkResult<void>;
    getCart: (updateCartIndicator?: boolean) => ThunkResult<void>;
    mergeBasket: () => ThunkResult<void>;
    cleanUp: () => void;
    updateLineItemQuantity: (lineItemId: string, quantity: number) => ThunkResult<void>;
    updateWarrantyForSku: (sku: string, selectedWarranty: Warranty | null) => ThunkResult<void>;
    onLoad: () => ThunkResult<void>;
    cartProcessing: (isProcessing: boolean) => ThunkResult<void>;
    changePostalCode: (postalCode: string) => ThunkResult<void>;
    locate: (includeStores: boolean) => ThunkResult<void>;
    goToCartPage: () => ThunkResult<void>;
    saveItemForLater: (lineItemId: string, sku: string) => ThunkResult<void>;
    updateCheckoutFlow: (checkoutFlow: CheckoutFlow) => Action;
    updateServicesForSku: (sku: string, serviceIds: string[]) => ThunkResult<void>;
}

export const basketActionCreators: BasketActionCreators = (() => {
    const fetchCartSuccess = (
        payload: Partial<{
            lineItems: CartLineItem[];
            summary: Summary;
            availability: CartAvailability;
            basketId: string;
            promotiions: Promotion[];
            errorType: string;
            isLoading: boolean;
        }>,
    ) => ({
        type: cartActionTypes.FETCH_CART_SUCCESS,
        payload,
    });

    const updateLineItem = (payload: {lineItem: CartLineItem}) => ({
        type: cartActionTypes.UPDATE_LINE_ITEM,
        payload,
    });

    const cartError = (payload: {errorType: string}) => ({
        type: cartActionTypes.CART_ERROR,
        payload,
    });

    const onLoad = () => {
        return async (dispatch, __, {cookieCartProvider}: ThunkInjectables) => {
            dispatch(cartProcessing(true));
            const cartId = cookieCartProvider.getCartId();

            await dispatch(mergeBasket());

            try {
                if (cartId) {
                    await dispatch(getCart(true));
                }
            } catch (e) {
                // fail silently - empty basket
            }

            dispatch(cartProcessing(false));
        };
    };

    const analyticsCartLoaded = () => ({
        type: cartActionTypes.ANALYTICS_CART_LOADED,
    });

    const syncRequiredPartsStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const language = getIntlLanguage(state);
            const {sku} = routeManager.getParams(language, location.pathname) as any;

            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(language, "requiredParts", sku),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const syncBasketStateWithLocation = (location: Location) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const language = getIntlLanguage(state);

            await dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(language, "basket"),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );
        };
    };

    const analyticsPaypalClicked = () => ({
        type: cartActionTypes.ANALYTICS_CART_PAYPAL_CLICKED,
    });

    const analyticsVisaClicked = () => ({
        type: cartActionTypes.ANALYTICS_CART_VISA_CLICKED,
    });

    const analyticsMasterpassClicked = () => ({
        type: cartActionTypes.ANALYTICS_CART_MATERPASS_CLICKED,
    });

    const removeChildItem = (lineItemId: string, childLineItemId: string) => {
        return async (dispatch, getState: () => State, {cookieCartProvider}: ThunkInjectables) => {
            dispatch(cartProcessing(true));
            try {
                const state: State = getState();
                const childLineItem = getChildLineItemById(childLineItemId)(state);
                const baseUrl = getBasketServiceApiUrl(state);
                const basketProvider = new ApiBasketProvider(baseUrl, getIntlLocale(state));
                const cartId = cookieCartProvider.getCartId();
                const response = await basketProvider.removeChildItem(
                    getUserShippingLocationPostalCode(state),
                    getUserShippingLocationRegionCode(state),
                    cartId,
                    lineItemId,
                    childLineItemId,
                );

                if ((childLineItem && childLineItem.type) === LineItemType.Psp && !hasWarrantyInCart(state)) {
                    setTermsOnStorage(false);
                }

                await dispatch({
                    type: cartActionTypes.UPDATE_CART,
                    payload: response,
                });
                adobeLaunch.pushEventToDataLayer({
                    event: "analytics-child-remove",
                    payload: childLineItem && childLineItem.product && childLineItem.product.sku,
                });

                await dispatch(getCart(true));
            } catch (e) {
                dispatch(
                    cartError({
                        errorType: ERROR_REMOVE_ITEM,
                    }),
                );
            }
            dispatch(cartProcessing(false));
        };
    };

    const handleLastItemInCart = (lineItems: CartLineItem[]) => async (
        dispatch,
        getState,
        {cookieCartProvider}: ThunkInjectables,
    ) => {
        // if API data is separate from UI data in the Redux store, this code could be removed.
        const state: State = getState();
        const baseUrl = getBasketServiceApiUrl(state);
        const cartId = cookieCartProvider.getCartId();
        const postalCode = getUserShippingLocationPostalCode(state);
        const regionCode = getUserShippingLocationRegionCode(state);
        const locale = getIntlLocale(state);

        // don't need to call basket API if it's last item in cart
        if (isCartEmpty(lineItems)) {
            dispatch(updateCartCount(0));
            cookieCartProvider.deleteCartId();
        } else {
            // if there are more items in cart, get latest from API
            // but overwrite the line items with current state because or removed and savedForLater flags
            let cartContent = {};

            try {
                const cartProvider = new ApiCartProvider(baseUrl, isFutureDatePricingEnabled(state));
                const locationIds = getUserShippingLocationIds(state);
                cartContent = await cartProvider.getCart(locale, postalCode, regionCode, cartId, locationIds);
            } catch (e) {
                // fail silently
            } finally {
                const newCartQuantity = cartContent?.summary?.quantity || 0;
                dispatch(updateCartCount(newCartQuantity));
                lineItems = mergeLineItems(lineItems, cartContent.lineItems);
                dispatch(
                    fetchCartSuccess({
                        ...cartContent,
                        lineItems,
                    }),
                );
            }
        }

        if (!hasWarrantyInCart(getState())) {
            setTermsOnStorage(false);
        }
    };

    /**
     * 
     * merge original and new line items
     *  - override promotions
     *  - keep new fields from original line items
     *  - override existing fields from new line items
     * 
     */
    const mergeLineItems = (origLineItems: CartLineItem[], newLineItems: CartLineItem[]) => {
        if (!newLineItems || newLineItems.length <= 0) {
            return origLineItems;
        }
        
        const updatedLineItems = origLineItems.map( origLineItem => {
            const matchLineItem = newLineItems.find(newLineItem => origLineItem.id === newLineItem.id);
            if (matchLineItem) {
                const updatedLineItem = {...origLineItem, ...matchLineItem}; // merge to preserve fields from state
                if (!matchLineItem.promotions) {
                    delete updatedLineItem.promotions;
                }
                return updatedLineItem;    
            } else {
                return origLineItem;
            }
        })
        return updatedLineItems;
    }

    const removeItem = (lineItemId: string, sku: string) => {
        return async (dispatch, getState: () => State, {cookieCartProvider}: ThunkInjectables) => {
            dispatch(cartProcessing(true));
            const state: State = getState();
            const baseUrl = getBasketServiceApiUrl(state);
            const cartId = cookieCartProvider.getCartId();
            const postalCode = getUserShippingLocationPostalCode(state);
            const regionCode = getUserShippingLocationRegionCode(state);
            const locale = getIntlLocale(state);
            const lineItems: CartLineItem[] = getLineItems(state);

            try {
                const basketProvider = new ApiBasketProvider(baseUrl, locale);
                await basketProvider.removeLineItem(postalCode, regionCode, cartId, lineItemId);
                const lineItem = lineItems.find((item) => item.id === lineItemId);
                if (lineItem) {
                    dispatch(
                        updateLineItem({
                            lineItem: {
                                ...lineItem,
                                removed: true,
                            },
                        }),
                    );
                    dispatch({
                        type: cartActionTypes.ANALYTICS_CART_ITEM_REMOVED,
                        payload: {
                            lineItem: {
                                product: {
                                    sku,
                                },
                                childLineItems: lineItem.childLineItems,
                            },
                        },
                    });
                }
            } catch (e) {
                dispatch(
                    cartError({
                        errorType: ERROR_REMOVE_ITEM,
                    }),
                );
            }
            await dispatch(handleLastItemInCart(getLineItems(getState())));
            dispatch(cartProcessing(false));
        };
    };

    const trackSaveItemForLater = (event: string, lineItem: CartLineItem): void => {
        adobeLaunch.pushEventToDataLayer({
            event,
            payload: {
                saveForLaterProducts: [
                    {
                        id: lineItem.product.sku,
                        name: lineItem.product.name,
                        nameAndSku: `${lineItem.product.name} : ${lineItem.product.sku}`,
                    },
                ],
            },
        });
    };

    const saveItemForLater = (lineItemId: string, sku: string) => {
        return async (
            dispatch: any,
            getState: () => State,
            {cookieCartProvider, productListProvider}: ThunkInjectables,
        ) => {
            dispatch(cartProcessing(true));
            const state: State = getState();
            const productListId = getProductListId();
            const cartId = cookieCartProvider.getCartId();
            const postalCode = getUserShippingLocationPostalCode(state);
            const regionCode = getUserShippingLocationRegionCode(state);
            const lineItems: CartLineItem[] = [...getLineItems(state)];
            const lineItem = lineItems.find((item) => item.id === lineItemId);

            try {
                if (!lineItem) {
                    throw new Error("Error saving item for later.");
                }

                const savedForLater = await productListProvider.saveItemForLater({
                    postalCode,
                    regionCode,
                    lineItemId,
                    basketId: cartId,
                    sku,
                    productListId,
                });

                if (savedForLater) {
                    if (!productListId) {
                        const productListIdCookieProvider = new ProductListIdCookieProvider();
                        productListIdCookieProvider.setProductListId(savedForLater.id);
                    }
                    dispatch(
                        updateLineItem({
                            lineItem: {
                                ...lineItem,
                                savedForLater: true,
                            },
                        }),
                    );
                    trackSaveItemForLater("save-for-later-success", lineItem);
                } else {
                    dispatch({
                        type: cartActionTypes.SAVE_FOR_LATER_ERROR,
                        payload: {
                            lineItem,
                        },
                    });
                    trackSaveItemForLater("save-for-later-error", lineItem);
                }
            } catch (e) {
                if (lineItem) {
                    dispatch({
                        type: cartActionTypes.SAVE_FOR_LATER_ERROR,
                        payload: {
                            lineItem,
                        },
                    });
                    trackSaveItemForLater("save-for-later-error", lineItem);
                }
                dispatch(cartProcessing(false));
                // else fail silently if lineitem not found (very unlikely scenario)
                return;
            }

            await dispatch(handleLastItemInCart(getLineItems(getState())));

            dispatch(productListActionCreators.fetchProductList());
        };
    };

    const getCart = (updateCartIndicator?: boolean) => {
        return async (dispatch: Dispatch, getState: () => State, {cookieCartProvider}: ThunkInjectables) => {
            const state: State = getState();
            const cartId = cookieCartProvider.getCartId();

            const baseUrl = getBasketServiceApiUrl(state);
            const cartProvider = new ApiCartProvider(baseUrl, isFutureDatePricingEnabled(state));
            const cartContent = await cartProvider.getCart(
                getIntlLocale(state),
                getUserShippingLocationPostalCode(state),
                getUserShippingLocationRegionCode(state),
                cartId,
                getUserShippingLocationIds(state),
            );
            dispatch(fetchCartSuccess(cartContent));

            const newCartQuantity = (cartContent && cartContent.summary && cartContent.summary.quantity) || 0;

            if (!!updateCartIndicator && newCartQuantity !== undefined) {
                dispatch(updateCartCount(newCartQuantity));
            }
        };
    };

    const mergeBasket = () => {
        return async (dispatch, getState: () => State, {cookieCartProvider}: ThunkInjectables) => {
            try {
                const customerId = await dispatch(userActionCreators.getCustomerId());
                const destinationCartId = customerId
                    .replace("{", "")
                    .replace("}", "")
                    .toLowerCase();
                let sourceCartId = cookieCartProvider.getCartId();

                if (!sourceCartId) {
                    cookieCartProvider.setCartId(destinationCartId);
                    sourceCartId = destinationCartId;
                    return;
                }
                if (sourceCartId.toLowerCase() !== destinationCartId) {
                    const state: State = getState();
                    const baseUrl = getBasketServiceApiUrl(state);
                    const basketProvider = new ApiBasketProvider(baseUrl, getIntlLocale(state));
                    await basketProvider.mergeBasket(
                        getUserShippingLocationPostalCode(state),
                        getUserShippingLocationRegionCode(state),
                        sourceCartId,
                        destinationCartId,
                    );
                    await cookieCartProvider.setCartId(destinationCartId);
                    return dispatch({
                        type: cartActionTypes.MERGE_BASKET_SUCCESS,
                    });
                }
            } catch (mergeBasketError) {
                // fail silently
                return dispatch({
                    type: cartActionTypes.MERGE_BASKET_ERROR,
                });
            }
        };
    };

    const cleanUp = () => ({
        type: cartActionTypes.CLEAN_UP,
    });

    const updateLineItemQuantity = (lineItemId: string, quantity: number) => {
        return async (dispatch, getState: () => State, {cookieCartProvider}: ThunkInjectables) => {
            dispatch(cartProcessing(true));
            const state: State = getState();
            const cartId = cookieCartProvider.getCartId();
            const baseUrl = getBasketServiceApiUrl(state);
            const postalCode = getUserShippingLocationPostalCode(state);
            const regionCode = getUserShippingLocationRegionCode(state);
            const locale = getIntlLocale(state);
            const lineItem = getLineItemById(lineItemId)(state);

            try {
                const basketProvider = new ApiBasketProvider(baseUrl, locale);
                await basketProvider.updateItemQuantity(lineItemId, quantity, cartId, regionCode, postalCode);
                dispatch({
                    payload: {lineItem, newQuantity: quantity},
                    type: cartActionTypes.ANALYTICS_CART_QUANTITY_UPDATED,
                });
                await dispatch(getCart(true));
            } catch (e) {
                dispatch(
                    cartError({
                        errorType: ERROR_UPDATE_QUANTITY,
                    }),
                );
            }
            dispatch(cartProcessing(false));
        };
    };

    const updateWarrantyForSku = (sku: string, selectedWarranty: Warranty | null) => {
        return async (dispatch, getState, {cookieCartProvider}: ThunkInjectables) => {
            dispatch(cartProcessing(true));
            const state = getState();
            const {id: lineItemId} = getLineItemBySku(sku)(state);
            const baseUrl = getBasketServiceApiUrl(state);
            const basketProvider = new ApiBasketProvider(baseUrl, getIntlLocale(state));
            const cartId = cookieCartProvider.getCartId();
            const postalCode = getUserShippingLocationPostalCode(state);
            const regionCode = getUserShippingLocationRegionCode(state);

            try {
                let response;

                if (selectedWarranty) {
                    const childItem: IChildItemAddition = {
                        sku: selectedWarranty.sku,
                        lineItemType: LineItemType.Psp,
                        quantity: 1,
                    };
                    response = await basketProvider.addChildItem(postalCode, regionCode, lineItemId, cartId, childItem);
                    trackAddFromCart({lineItem: childItem});
                } else {
                    const {id: warrantyItemId} = getGspChildForLineItem(sku)(state);
                    response = await basketProvider.removeChildItem(
                        postalCode,
                        regionCode,
                        cartId,
                        lineItemId,
                        warrantyItemId,
                    );
                }

                // updates legacy cart state in case user navigates back to Add-ons page through a Required Parts link
                await dispatch({
                    type: cartActionTypes.UPDATE_CART,
                    payload: response,
                });
                await dispatch(getCart(false));
            } catch (e) {
                dispatch(
                    cartError({
                        errorType: selectedWarranty ? ERROR_ADD_WARRANTY : ERROR_REMOVE_WARRANTY,
                    }),
                );
            }
            dispatch(cartProcessing(false));
        };
    };

    const updateServicesForSku = (sku: string, serviceIds: string[]): ThunkResult<void> => async (
        dispatch,
        getState,
        {cookieCartProvider},
    ) => {
        dispatch(cartProcessing(true));
        const state = getState();
        const addServiceInCart = getFeatureToggle(FEATURE_TOGGLES.addServiceInCart)(state);
        const parentLineItem = state.cartPage && getLineItemBySku(sku)(state);
        const baseUrl = getBasketServiceApiUrl(state);
        const basketProvider = new ApiBasketProvider(baseUrl, getIntlLocale(state));
        const cartId = cookieCartProvider.getCartId();
        const postalCode = getUserShippingLocationPostalCode(state);
        const regionCode = getUserShippingLocationRegionCode(state);
        if (parentLineItem) {
            const childServicesMap: Record<string, ChildLineItem> = {};
            const existingServices = parentLineItem.childLineItems?.reduce?.((data, lineItem) => {
                const {
                    type,
                    product: {sku: serviceSku},
                } = lineItem;
                childServicesMap[serviceSku] = lineItem;
                if (type === LineItemType.Service) {
                    data.push(serviceSku);
                }
                return data;
            }, [] as string[]);
            const [changed] = xor(existingServices, serviceIds);

            let response;
            if (changed && serviceIds.indexOf(changed) !== -1) {
                if (addServiceInCart) {
                    const childItem: IChildItemAddition = {
                        sku: changed,
                        lineItemType: LineItemType.Service,
                        quantity: 1,
                    };
                    response = await basketProvider.addChildItem(
                        postalCode,
                        regionCode,
                        parentLineItem.id,
                        cartId,
                        childItem,
                    );
                    dispatch(trackAddFromCart({lineItem: {...childItem, parent: parentLineItem}}));
                } else {
                    const language = getIntlLanguage(state);
                    dispatch(
                        routerActions.push({
                            pathname: routeManager.getPathByKey(language, "requiredParts", sku),
                        }),
                    );
                }
            } else if (changed) {
                response = await basketProvider.removeChildItem(
                    postalCode,
                    regionCode,
                    cartId,
                    parentLineItem.id,
                    childServicesMap[changed].id,
                );
                dispatch(trackRemoveFromCart({lineItem: {...childServicesMap[changed], parent: parentLineItem}}));
            }
            if (response) {
                // updates legacy cart state in case user navigates back to Add-ons page through a Required Parts link
                await dispatch({
                    type: cartActionTypes.UPDATE_CART,
                    payload: response,
                });
                await dispatch(getCart(false));
            }
        }
    };

    const cartProcessing = (isProcessing: boolean) => ({
        type: isProcessing ? cartActionTypes.CART_PROCESSING : cartActionTypes.CART_PROCESSING_DONE,
    });

    const changePostalCode = (postalCode: string) => async (dispatch) => {
        await dispatch(userActionCreators.getLocation(true, postalCode));

        return dispatch(getCart());
    };

    const updateCartCount = (quantity: number) => {
        return {
            type: cartActionTypes.UPDATE_CART,
            payload: {
                totalQuantity: quantity,
            },
        };
    };

    const locate = (includeStores: boolean) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            if (typeof window === "undefined") {
                return;
            }

            let postalCode = null;
            const storedUser: UserState = sessionStorage.getItem("user");
            if (window.location) {
                postalCode = useQueryPostalCode(window.location);
            }

            if (storedUser && !postalCode) {
                return dispatch({type: userActionTypes.locateFromSession, ...storedUser});
            } else {
                const state: State = getState();
                const locationProvider = new ApiLocationProvider(
                    state.config.dataSources.locationApiUrl,
                    getIntlLocale(state),
                );

                try {
                    dispatch({type: userActionTypes.fetchLocation});
                    const location = await locationProvider.locate(includeStores, null, postalCode);

                    const nearbyStores = includeStores
                        ? await getNearbyStores(
                              state.config.dataSources.storeLocationApiUrl,
                              getIntlLocale(state),
                              location.postalCode,
                          )
                        : [];

                    const regionName = state.intl.messages[`regionNames.${location.regionCode}`];

                    const user: UserState = {
                        shippingLocation: {
                            city: location.city,
                            country: location.country,
                            nearbyStores,
                            postalCode: location.postalCode,
                            regionCode: location.regionCode,
                            regionName,
                        },
                    };

                    if (state.user.geoLocation) {
                        user.geoLocation = state.user.geoLocation;
                    }

                    sessionStorage.setItem("user", user);

                    dispatch({type: userActionTypes.getLocationSuccess, ...user});
                } catch (error) {
                    if (error instanceof HttpRequestError) {
                        dispatch({type: userActionTypes.getLocationFailure});
                    }

                    await dispatch(errorActionCreators.error(error, () => getLocation(includeStores)));
                }
            }
        };
    };

    const goToCartPage = () => (dispatch: Dispatch, getState: getStateFunc) => {
        const state = getState();
        const language = getIntlLanguage(state);
        const pathname = routeManager.getPathByKey(language, "basket");
        return dispatch(routerActions.push({pathname}));
    };

    const updateCheckoutFlow = (selectedCheckoutFlow: CheckoutFlow): Action => ({
        type: cartActionTypes.UPDATE_CHECKOUT_FLOW,
        payload: {
            selectedCheckoutFlow,
        },
    });

    return {
        analyticsCartLoaded,
        analyticsPaypalClicked,
        analyticsMasterpassClicked,
        analyticsVisaClicked,
        changePostalCode,
        cleanUp,
        getCart,
        mergeBasket,
        onLoad,
        removeChildItem,
        removeItem,
        syncBasketStateWithLocation,
        syncRequiredPartsStateWithLocation,
        updateLineItemQuantity,
        updateWarrantyForSku,
        locate,
        goToCartPage,
        saveItemForLater,
        updateCheckoutFlow,
        updateServicesForSku,
    };
})();
