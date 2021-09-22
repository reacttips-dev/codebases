import * as querystring from "querystring";
import {AnyAction, ActionCreatorsMapObject} from "redux";
import {ThunkAction} from "redux-thunk";

import {
    errorActionCreators,
    routingActionCreators,
    userActionCreators,
    availabilityActionCreators,
    sellerActionCreators,
    offerActionCreators,
} from "actions";
import getLogger from "common/logging/getLogger";
import {handleRedirectError} from "errors";
import {ReviewSortOptions, Dispatch, getStateFunc, WarrantyType, BenefitsMessage} from "models";
import {
    createCategoryProvider,
    ApiShowcaseContentProvider,
    createProductContentProvider,
    ApiSearchProvider,
} from "providers";
import State from "store";
import routeManager from "utils/routeManager";
import {StatusCode} from "errors";
import {getPdpFindingVariable} from "utils/analytics/pdpFindingMethodMapper";

import {ApiProductProvider, ApiProductRelationshipProvider} from "../../providers";
import {initialProductState} from "../../reducers";
import {productReviewActionCreators} from "./customerReviews";
import {getWarrantyTypeForProduct, getSortedPickupStores} from "../../store/selectors";
import {gspActionCreators} from "../../actions/gspActions";
import {flattenCmsWarrantyMessages} from "../../reducers/addOnsPageReducer/warrantyBenefitsMessageAdapter";

export const productActionTypes = {
    rpuRequest: "RPU_REQUEST",
    cancelFetchStores: "FETCH_STORES_CANCEL",
    resetProductState: "RESET_PRODUCT_STATE",
    fetchProduct: "PRODUCT_FETCH",
    getProductSuccess: "PRODUCT_SUCCESS",
    setState: "PRODUCT_SET_STATE",
    trackProductPageView: "PRODUCT_PAGE_LOAD",
    setCategory: "PRODUCT_SET_CATEGORY",
    getShowcaseContentSuccess: "SHOWCASE_CONTENT_SUCCESS",
    getProductContentSuccess: "PRODUCT_CONTENT_SUCCESS",
    trackDeliveryPromise: "PRODUCT_DELIVERY_PROMISE",
};

export interface RpuQuery {
    isItemInCart?: boolean;
    items: Array<{sku: string; quantity: number; selectedWarrantySku?: string}>;
    storeId?: string;
}

export type GetProductVariantsThunk = ThunkAction<
    void,
    State,
    {productRelationshipProvider: ApiProductRelationshipProvider; searchProvider: ApiSearchProvider},
    AnyAction
>;

export interface ProductActionCreators extends ActionCreatorsMapObject {
    resetProductState: () => any;
    trackRpu: (sku: string, offer?: string, warrantySku?: string, rpuFrom?: string) => any;
    trackDeliveryPromise: (days: number) => any;
    getProduct: (sku: string) => any;
    getCategory: (categoryId: string) => any;
    getShowcaseBannerContent: () => any;
    getContent: (sku: string) => any;
    reserveInStore: (rpuQuery: RpuQuery, trackingData: {rpuFrom: string}) => any; // TODO: Create a sub-task to move this to RPU.ts
    setProductDetailState: (sku: string) => any;
    trackPageView: () => any;
}

export const productActionCreators: ProductActionCreators = (() => {
    const trackPageView = () => {
        return (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();

            const {referrer} = state.routing.locationBeforeTransitions.query;
            const methodType = referrer
                ? referrer.replace("_", " ")
                : getPdpFindingVariable(state.intl.language, state.routing);
            dispatch({
                type: productActionTypes.trackProductPageView,
                pdpFindingMethod: methodType,
                payload: {
                    stores: getSortedPickupStores(state),
                },
            });
        };
    };

    const trackDeliveryPromise = (days: number) => {
        return {
            type: productActionTypes.trackDeliveryPromise,
            payload: {days},
        };
    };

    const trackRpu = (sku: string, offer?: string, warrantySku?: string, rpuFrom?: string) => {
        return {
            payload: {sku, offer, warrantySku, rpuFrom},
            type: productActionTypes.rpuRequest,
        };
    };

    const reserveInStore = (query: RpuQuery, trackingData: {rpuFrom?: string}) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();

            const skus = query.items.reduce(_toSkuList, []);
            const warranty = query.items.map((item) => item.selectedWarrantySku).join("");

            if (trackingData.rpuFrom) {
                dispatch(trackRpu(skus[0], undefined, warranty, trackingData.rpuFrom));
            }

            const rpuQueryString = {
                ...query,
                sku: skus,
                ...(warranty ? {warranty} : {}),
                returnUrl: (window && window.location && window.location.pathname) || "/",
            };

            delete rpuQueryString.items;

            const queueit = state.config.remoteConfig?.isQueueItEnabled ? "?qit=1" : "";

            const formattedUrl =
                `${state.config.appPaths.checkout}` +
                `${queueit}#/${state.intl.locale}/reserve-pickup?${querystring.stringify(rpuQueryString)}`;

            getLogger().info(`Navigating to reserve in store URI: ${formattedUrl}`);

            // timeout allows tracking pixel to fire
            setTimeout(() => window.location.assign(formattedUrl), 300);
        };
    };

    const setProductDetailState = (sku: string) => {
        const defaultReviewSortOption = ReviewSortOptions.relevancy;

        return async (dispatch: Dispatch) => {
            try {
                await dispatch(getProduct(sku));

                if (typeof window === "undefined") {
                    await Promise.all([
                        dispatch(getContent(sku)),
                        dispatch(getProductSeller()),
                        dispatch(productReviewActionCreators.getReviews(defaultReviewSortOption)),
                        dispatch(productReviewActionCreators.getDetailedReviewSummary()),
                    ]);
                } else {
                    dispatch(getContent(sku));
                    dispatch(getProductSeller());
                    dispatch(productReviewActionCreators.getReviews(defaultReviewSortOption));
                    dispatch(productReviewActionCreators.getDetailedReviewSummary());
                }
            } catch (error) {
                await dispatch(
                    errorActionCreators.error(
                        error,
                        () => setProductDetailState(sku),
                        () => userActionCreators.setGeoLocation(),
                        () => availabilityActionCreators.getAvailability(),
                    ),
                );
            }
        };
    };

    const getProductSeller = () => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const {product} = state.product;

            if (product && product.isMarketplace) {
                dispatch(sellerActionCreators.getSeller(product.seller.id));
            }
        };
    };

    const getProduct = (sku: string) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            await dispatch(userActionCreators.locate(true));

            const state: State = getState();

            await dispatch({type: productActionTypes.fetchProduct});

            const productProvider = new ApiProductProvider(
                state.config.dataSources.productApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
            );

            const product = await productProvider.getProduct({sku});

            product.placeholderImage = state.product.product ? state.product.product.placeholderImage : null;

            await dispatch({type: productActionTypes.getProductSuccess, product});
        };
    };

    const getShowcaseBannerContent = () => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const product = state.product.product;
            const productSku = product && product.sku ? product.sku : null;

            if (productSku === null) {
                return;
            }

            const showcaseContentProvider = new ApiShowcaseContentProvider(
                state.config.dataSources.searchApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
                productSku,
            );

            try {
                const showcaseContent = await showcaseContentProvider.getContent();
                await dispatch({
                    type: productActionTypes.getShowcaseContentSuccess,
                    showcaseContent,
                });
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => getShowcaseBannerContent()));
            }
        };
    };

    const resetProductState = () => {
        return (dispatch: Dispatch) => {
            dispatch({type: productActionTypes.resetProductState});
        };
    };

    const syncProductStateWithLocation = (location, returnSimpleProduct = true) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            let state: State = getState();
            let product = state.product.product;
            const params: {sku?: string; seoName?: string; seoText?: string} = routeManager.getParams(
                state.intl.language,
                location.pathname,
            );
            const isSameSku = () => product.sku === params.sku;

            if (product === initialProductState.product || !isSameSku() || state.product.loadingProduct) {
                await dispatch(setProductDetailState(params.sku));
                state = getState();
                const errorStatusCode = state.errors.statusCode;

                if (errorStatusCode === StatusCode.NotFound) {
                    return;
                }

                product = state.product.product;

                if (product) {
                    if (product.primaryParentCategoryId) {
                        await dispatch(getCategory(product.primaryParentCategoryId));
                    }
                }
            }

            dispatch(offerActionCreators.getOffersBySku(params.sku));
            dispatch(offerActionCreators.getSpecialOffers());

            if (product && product.sku) {
                await dispatch(availabilityActionCreators.getAvailability(product.sku, returnSimpleProduct));
            }

            if (product !== initialProductState.product) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            state.intl.language,
                            "product",
                            product.altLangSeoText,
                            product.sku,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );

                if (!params.seoName || params.seoName !== product.seoText) {
                    handleRedirectError(
                        routeManager.getPathByKeyWithQueryParams(
                            state.intl.language,
                            "product",
                            location.search,
                            product.seoText,
                            product.sku,
                        ),
                    );
                }
            }
        };
    };

    const getCategory = (categoryId: string) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const categoryProvider = createCategoryProvider(state.config.dataSources.categoryApiUrl, state.intl.locale);
            try {
                const category = await categoryProvider.getCategory(categoryId);
                await dispatch({type: productActionTypes.setCategory, category});
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => getCategory(categoryId)));
            }
        };
    };

    const getContent = (sku: string) => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const provider = createProductContentProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
                sku,
            );

            try {
                const content = await provider.getContent();
                const warrantyType = getWarrantyTypeForProduct(state);

                dispatch({
                    type: productActionTypes.getProductContentSuccess,
                    content,
                });
                const benefitsData: BenefitsMessage | null = flattenCmsWarrantyMessages(
                    content && content.contexts,
                    warrantyType as WarrantyType,
                );
                if (benefitsData) {
                    dispatch(
                        gspActionCreators.fetchWarrantyBenefitsSuccess({
                            sku,
                            data: benefitsData,
                        }),
                    );
                }
            } catch (error) {
                return;
            }
        };
    };

    const _toSkuList = (acc: string[], item: {sku: string; quantity: number}): string[] => {
        for (let i = 0; i < item.quantity; i++) {
            acc.push(item.sku);
        }
        return acc;
    };

    return {
        resetProductState,
        trackRpu,
        trackDeliveryPromise,
        getProduct,
        syncProductStateWithLocation,
        reserveInStore,
        setProductDetailState,
        trackPageView,
        getCategory,
        getShowcaseBannerContent,
        getContent,
    };
})();

export default productActionCreators;
