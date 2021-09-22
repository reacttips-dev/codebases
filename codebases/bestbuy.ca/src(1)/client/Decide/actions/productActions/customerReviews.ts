import {productActionCreators} from "./product";
import {Location} from "history";
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {errorActionCreators, routingActionCreators} from "actions";
import {CustomerReviews, ReviewSortOptions, RatingSummary, getStateFunc, Dispatch, ThunkInjectables} from "models";
import {RedirectError} from "errors";
import {ApiCustomerReviewsProvider, WriteReviewRequest} from "providers";
import State from "store";
import routeManager from "utils/routeManager";
import {initialProductState} from "reducers";
import LocalStorageProvider from "providers/LocalStorageProvider";

export const productReviewActionTypes = {
    getReviewsSuccess: "REVIEWS_SUCCESS",
    getMoreReviewsSuccess: "MORE_REVIEWS_SUCCESS",
    getDetailedReviewSummarySuccess: "DETAILED_REVIEW_SUMMARY_SUCCESS",
    loadingReviews: "REVIEWS_LOADING",
    setInitialProductReviewPageLoad: "INITIAL_PRODUCT_REVIEW_PAGE_LOAD",
    sortCustomerReviews: "SORT_CUSTOMER_REVIEWS",
    trackCustomerReviewsPageView: "CUSTOMER_REVIEWS_PAGE_LOAD",
    trackCustomerReviewsPageLoadMoreReviewsClick: "CUSTOMER_REVIEWS_PAGE_BUTTON_LOAD_MORE_CLICK",
    trackWriteProductReviewPageView: "CREATE_PRODUCT_REVIEW_PAGE_LOAD",
    trackProductReviewConfirmationPageView: "SUBMIT_PRODUCT_REVIEW_PAGE_LOAD",
    filterReviewsByVerifiedPurchaser: "FILTER_REVIEWS_BY_VERIFIED_PURCHASER",
};

type CustomerReviewsThunk = ThunkAction<
    Promise<void>,
    State,
    {apiCustomerReviewsProvider: ApiCustomerReviewsProvider},
    AnyAction
>;

interface LocalStorageObject {
    [key: string]: boolean;
}

export interface ProductReviewActionCreators {
    getReviews: (sortOption?: ReviewSortOptions) => void;
    getDetailedReviewSummary: () => void;
    getReviewsFeedback: () => LocalStorageObject;
    loadingMoreReviews: () => void;
    getMoreReviews: (pageQuery?: number, sortOption?: ReviewSortOptions) => void;
    sortReviews: (sortOption: ReviewSortOptions) => void;
    submitReviewsFeedback: (reviewId: string, feedback: boolean) => void;
    submitReportReview: (reviewId: string) => void;
    syncProductReviewStateWithLocation: (location) => void;
    syncCreateProductReviewStateWithLocation: (location) => void;
    trackCustomerReviewPageView: () => void;
    trackWriteProductReviewPageView: () => void;
    trackProductReviewConfirmationPageView: () => void;
    trackCustomerReviewPageLoadMoreReviewsButtonClick: () => void;
    writeReview: (review: WriteReviewRequest) => void;
    hydrateProductReviewsForLocation: (location: Location) => void;
    filterReviewsByVerifiedPurchaser: (isToggleSelected: boolean) => void;
}

export const productReviewActionCreators: ProductReviewActionCreators = (() => {
    const trackWriteProductReviewPageView = () => {
        return {
            type: productReviewActionTypes.trackWriteProductReviewPageView,
        };
    };

    const trackProductReviewConfirmationPageView = () => {
        return {
            type: productReviewActionTypes.trackProductReviewConfirmationPageView,
        };
    };

    const trackCustomerReviewPageView = () => {
        return {
            type: productReviewActionTypes.trackCustomerReviewsPageView,
        };
    };

    const trackCustomerReviewPageLoadMoreReviewsButtonClick = () => {
        return {
            type: productReviewActionTypes.trackCustomerReviewsPageLoadMoreReviewsClick,
        };
    };

    const sortReviews = (sortOption: ReviewSortOptions) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            if (sortOption === state.product.customerReviews.sortOption) {
                return;
            }

            dispatch({
                sortOption,
                type: productReviewActionTypes.sortCustomerReviews,
            });

            if (state.product.customerReviews.customerReviews.length > 1) {
                dispatch(getReviews());
            }

            adobeLaunch.pushEventToDataLayer({
                event: "sort-customer-reviews",
                payload: {
                    sortOption,
                },
            });
        };
    };

    const filterReviewsByVerifiedPurchaser = (isToggleSelected: boolean) => {
        return async (dispatch, getState) => {
            const state: State = getState();
            if (isToggleSelected === state.product.customerReviews.filter.verifiedPurchaserToggleSelected) {
                return;
            }
            dispatch({
                isToggleSelected,
                type: productReviewActionTypes.filterReviewsByVerifiedPurchaser,
            });
            dispatch(getReviews());
        };
    };

    const getReviewsFeedback = (): LocalStorageObject => {
        return LocalStorageProvider.getItem("feedback_submission");
    };

    const getReportedReviews = (): LocalStorageObject => {
        return LocalStorageProvider.getItem("reported_reviews");
    };

    const submitReviewsFeedback = (reviewId: string, feedback: boolean): CustomerReviewsThunk => {
        if (!reviewId) {
            return;
        }
        return async (dispatch, _, {apiCustomerReviewsProvider}) => {
            try {
                await apiCustomerReviewsProvider.submitFeedback(reviewId, feedback);
                LocalStorageProvider.setItem("feedback_submission", {
                    ...getReviewsFeedback(),
                    [reviewId]: true,
                });
            } catch (error) {
                dispatch(errorActionCreators.error(error));
            }
        };
    };

    const submitReportReview = (reviewId: string): CustomerReviewsThunk => {
        if (!reviewId) {
            return;
        }

        return async (dispatch, _, {apiCustomerReviewsProvider}) => {
            try {
                await apiCustomerReviewsProvider.submitReportReview(reviewId);
                LocalStorageProvider.setItem("reported_reviews", {
                    ...getReportedReviews(),
                    [reviewId]: true,
                });
            } catch (error) {
                dispatch(errorActionCreators.error(error));
            }
        };
    };

    const getReviews = (sortOption?: ReviewSortOptions): CustomerReviewsThunk => {
        return async (dispatch, getState, {apiCustomerReviewsProvider}) => {
            const state: State = getState();
            const {product, customerReviews: reviews} = state.product;
            const sortValue = sortOption || reviews.sortOption;
            const customerReviewsProvider =
                apiCustomerReviewsProvider ||
                new ApiCustomerReviewsProvider(state.config.dataSources.reviewApiUrl, state.intl.locale);

            if (product && product.sku) {
                const reviewsProps = {
                    source: "all",
                    pageSize: 10,
                    sku: product.sku,
                    sortOption: sortValue,
                    filterOption: reviews.filter,
                };

                try {
                    dispatch({type: productReviewActionTypes.loadingReviews});
                    const customerReviews = await customerReviewsProvider.getReviews(reviewsProps);
                    dispatch({type: productReviewActionTypes.getReviewsSuccess, customerReviews});
                } catch (error) {
                    dispatch(errorActionCreators.error(error));
                }
            }
        };
    };

    const getDetailedReviewSummary = (): CustomerReviewsThunk => {
        return async (dispatch, getState, {apiCustomerReviewsProvider}) => {
            const state: State = getState();
            const {product} = state.product;
            const customerReviewsProvider =
                apiCustomerReviewsProvider ||
                new ApiCustomerReviewsProvider(state.config.dataSources.reviewApiUrl, state.intl.locale);

            if (product && product.sku) {
                try {
                    const ratingSummary: RatingSummary = await customerReviewsProvider.getDetailedReviewSummary(
                        product.sku,
                    );
                    dispatch({type: productReviewActionTypes.getDetailedReviewSummarySuccess, ratingSummary});
                } catch (error) {
                    dispatch(errorActionCreators.error(error));
                }
            }
        };
    };

    const loadingMoreReviews = () => {
        return async (dispatch) => {
            dispatch({type: productReviewActionTypes.loadingReviews});
            await dispatch(getMoreReviews(null));
        };
    };

    const getMoreReviews = (pageNumber?: number): CustomerReviewsThunk => {
        return async (dispatch, getState, {apiCustomerReviewsProvider}) => {
            const state: State = getState();
            const {product, customerReviews: reviews} = state.product;

            if (product && product.sku) {
                const page = pageNumber || Number(state.product.customerReviews.currentPage) + 1;
                const reviewsProps = {
                    source: "all",
                    pageSize: 10,
                    sku: product.sku,
                    ...(reviews.sortOption && {sortOption: reviews.sortOption}),
                    filterOption: reviews.filter,
                };

                try {
                    dispatch({type: productReviewActionTypes.loadingReviews});
                    const customerReviews: CustomerReviews = await apiCustomerReviewsProvider.getMoreReviews(
                        reviewsProps,
                        page,
                    );
                    if (customerReviews) {
                        customerReviews.customerReviews = [].concat(
                            state.product.customerReviews.customerReviews,
                            customerReviews.customerReviews,
                        );
                    }
                    dispatch({type: productReviewActionTypes.getMoreReviewsSuccess, customerReviews});
                } catch (error) {
                    dispatch(errorActionCreators.error(error));
                }
            }
        };
    };

    const hydrateProductReviewsForLocation = (location) => {
        return async (dispatch, getState) => {
            let state: State = getState();
            let review = state.product.customerReviews;
            let product = state.product.product;
            const params: {sku: string} = routeManager.getParams(state.intl.language, location.pathname);
            const query = location.query && location.query.page;

            try {
                if (
                    product === initialProductState.product ||
                    product.sku !== params.sku ||
                    review === initialProductState.customerReviews
                ) {
                    await dispatch(productActionCreators.getProduct(params.sku));
                    await dispatch(getDetailedReviewSummary());
                    if (query) {
                        await dispatch(getMoreReviews(query));
                    } else {
                        await dispatch(getReviews(ReviewSortOptions.relevancy));
                    }
                }
            } catch (error) {
                dispatch(errorActionCreators.error(error));
            }

            state = getState();
            product = state.product.product;
            review = state.product.customerReviews;
            if (product && product.primaryParentCategoryId) {
                await dispatch(productActionCreators.getCategory(product.primaryParentCategoryId));
            }
        };
    };

    const syncCreateProductReviewStateWithLocation = (location) => {
        return async (dispatch, getState) => {
            await dispatch(hydrateProductReviewsForLocation(location));

            const state = getState();
            const product = state.product.product;
            const review = state.product.customerReviews;

            if (review !== initialProductState.customerReviews && product !== initialProductState.product) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            state.intl.language,
                            "createProductReview",
                            product.sku,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    };

    const syncProductReviewStateWithLocation = (location) => {
        return async (dispatch, getState) => {
            await dispatch(hydrateProductReviewsForLocation(location));

            const state = getState();
            const review = state.product.customerReviews;
            const product = state.product.product;

            if (review !== initialProductState.customerReviews && product !== initialProductState.product) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            state.intl.language,
                            "productReviews",
                            product.altLangSeoText,
                            product.sku,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );

                const params: {seoName: string; seoText: string} = routeManager.getParams(
                    state.intl.language,
                    location.pathname,
                );
                if (!params.seoName || params.seoName !== product.seoText) {
                    throw new RedirectError(
                        routeManager.getPathByKey(state.intl.language, "productReviews", product.seoText, product.sku),
                    );
                }
            }
        };
    };

    const writeReview = (review: WriteReviewRequest) => {
        return async (dispatch: Dispatch, getState: getStateFunc, {apiCustomerReviewsProvider}: ThunkInjectables) => {
            return apiCustomerReviewsProvider.writeReview(review);
        };
    };

    return {
        getReviews,
        getReviewsFeedback,
        getReportedReviews,
        submitReportReview,
        loadingMoreReviews,
        getMoreReviews,
        sortReviews,
        submitReviewsFeedback,
        syncProductReviewStateWithLocation,
        syncCreateProductReviewStateWithLocation,
        trackCustomerReviewPageView,
        trackWriteProductReviewPageView,
        trackCustomerReviewPageLoadMoreReviewsButtonClick,
        trackProductReviewConfirmationPageView,
        hydrateProductReviewsForLocation,
        writeReview,
        filterReviewsByVerifiedPurchaser,
        getDetailedReviewSummary,
    };
})();

export default productReviewActionCreators;
