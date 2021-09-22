import {ActionCreatorsMapObject} from "redux";

import {SellerReviews, ThunkResult, Seller} from "models";
import State from "store";
import routeManager from "utils/routeManager";
import {routingActionCreators, errorActionCreators} from "actions";

import {ApiSellerProvider, ApiSellerReviewsProvider, SellerRatingSummaryResponse} from "providers";
import {initialSellerState} from "../../reducers";

export const sellerActionTypes = {
    getSeller: "SELLER_SUCCESS",
    sellerReviewPageLoad: "SELLER_REVIEW_PAGE_LOAD",
    sellerProfilePageLoad: "SELLER_PROFILE_PAGE_LOAD",
    setInitialPageLoad: "SELLER_INITAL_PAGE_LOAD",
    loadingMoreSellerReviews: "SELLER_FEEDBACK_LOADING",
    loadMoreSellerReviews: "SELLER_FEEDBACK_LOAD_MORE",
};

export interface SellerActionCreators extends ActionCreatorsMapObject {
    getSeller: (sellerId: string) => ThunkResult<Promise<void>>;
    syncSellerProfileStateWithLocation: (location: Location) => ThunkResult<Promise<void>>;
    syncSellerReviewsStateWithLocation: (location: Location) => ThunkResult<Promise<void>>;
    setInitialReviewPage: (sellerId: string, pageNumber: number) => ThunkResult<Promise<void>>;
    sellerProfilePageLoad: () => ThunkResult<void>;
    sellerReviewPageLoad: () => ThunkResult<Promise<void>>;
    loadingMoreReviews: (sellerId: string) => ThunkResult<Promise<void>>;
    getMoreReviews: (sellerId: string, pageQuery?: number) => ThunkResult<Promise<void>>;
}

export const sellerActionCreators: SellerActionCreators = (() => {
    const getSeller = (sellerId: string): ThunkResult<Promise<void>> => {
        return async (dispatch, getState) => {
            const state: State = getState();

            const legacySellerProvider = new ApiSellerProvider(
                state.config.dataSources.sellerApiUrl,
                state.intl.locale,
            );
            const reviewStatsProvider = new ApiSellerReviewsProvider(
                state.config.dataSources.reviewApiUrl,
                state.intl.locale,
            );

            try {
                const [seller, sellerReviewStats, reviews]: [
                    Seller,
                    SellerRatingSummaryResponse,
                    SellerReviews,
                ] = await Promise.all([
                    legacySellerProvider.getSeller(sellerId),
                    reviewStatsProvider.getSellerReviewStats(sellerId),
                    legacySellerProvider.getReviews(sellerId), // TODO: Remove the code after switch to BV
                ]);

                dispatch({
                    seller: {
                        ...seller,
                        rating: sellerReviewStats
                            ? {
                                  score: sellerReviewStats.averageRating,
                                  reviewsCount: sellerReviewStats.reviewCount,
                                  sellerId: sellerReviewStats.sellerId,
                              }
                            : null,
                        reviews: {
                            ...reviews,
                            loadingMore: false,
                        },
                    },
                    type: sellerActionTypes.getSeller,
                });
            } catch (error) {
                dispatch(errorActionCreators.error(error));
            }
        };
    };

    const sellerReviewPageLoad = (): ThunkResult<Promise<void>> => {
        return async (dispatch, getState) => {
            const state: State = getState();
            dispatch({
                payload: {
                    sellerId: state.seller.seller.id,
                    sellerName: state.seller.seller.name,
                },
                type: sellerActionTypes.sellerReviewPageLoad,
            });
        };
    };

    const sellerProfilePageLoad = (): ThunkResult<void> => {
        return (dispatch) => {
            dispatch({
                type: sellerActionTypes.sellerProfilePageLoad,
            });
        };
    };

    const syncSellerProfileStateWithLocation = (location: Location): ThunkResult<Promise<void>> => {
        return async (dispatch, getState) => {
            let state: State = getState();
            const params: {id: string} = routeManager.getParams(state.intl.language, location.pathname);

            if (state.seller.seller === initialSellerState.seller || state.seller.seller.id !== params.id) {
                await dispatch(getSeller(params.id));
                state = getState();
            }

            if (!state.routing || state.routing.curLangUrl !== location.pathname) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(state.intl.language, "sellerProfile", params.id),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    };

    const syncSellerReviewsStateWithLocation = (location: Location): ThunkResult<Promise<void>> => {
        return async (dispatch, getState) => {
            let state: State = getState();
            const params: {id: string} = routeManager.getParams(state.intl.language, location.pathname);
            const query = location.query && location.query.page;

            if (state.seller.seller === initialSellerState.seller || state.seller.seller.id !== params.id) {
                await dispatch(getSeller(params.id));
                state = getState();
            }

            if (!state.routing || state.routing.curLangUrl !== location.pathname) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(state.intl.language, "sellerReviews", params.id),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }

            if (query) {
                await dispatch(setInitialReviewPage(params.id, query));
            }
        };
    };

    const setInitialReviewPage = (sellerId: string, pageNumber: number): ThunkResult<Promise<void>> => {
        return async (dispatch, getState) => {
            const state: State = getState();
            const sellerProvider = new ApiSellerProvider(state.config.dataSources.sellerApiUrl, state.intl.locale);

            try {
                const newReviews: SellerReviews = await sellerProvider.getMoreReviews(sellerId, pageNumber);

                dispatch({
                    seller: {
                        ...state.seller.seller,
                        reviews: {
                            ...newReviews,
                            currentPage: Number(pageNumber),
                            loadingMore: false,
                        },
                    },
                    type: sellerActionTypes.setInitialPageLoad,
                });
            } catch (error) {
                dispatch(errorActionCreators.error(error));
            }
        };
    };

    // TODO: Remove this action after switch to BV
    const loadingMoreReviews = (sellerId: string) => {
        return async (dispatch) => {
            dispatch({
                loadingMore: true,
                type: sellerActionTypes.loadingMoreSellerReviews,
            });
            await dispatch(getMoreReviews(sellerId, undefined));
        };
    };

    // TODO: Remove this after switch to BV
    const getMoreReviews = (sellerId: string, pageQuery?: number) => {
        return async (dispatch, getState) => {
            const state: State = getState();

            const sellerProvider = new ApiSellerProvider(state.config.dataSources.sellerApiUrl, state.intl.locale);

            const page = pageQuery || Number(state.seller.seller.reviews.currentPage) + 1;

            try {
                const newReviews: SellerReviews = await sellerProvider.getMoreReviews(sellerId, page);

                newReviews.reviews = [].concat(state.seller.seller.reviews.reviews, newReviews.reviews);

                dispatch({
                    reviews: {
                        ...newReviews,
                        loadingMore: false,
                    },
                    type: sellerActionTypes.loadMoreSellerReviews,
                });
            } catch (error) {
                await dispatch(errorActionCreators.error(error));
            }
        };
    };

    return {
        getSeller,
        loadingMoreReviews,
        getMoreReviews,
        syncSellerProfileStateWithLocation,
        syncSellerReviewsStateWithLocation,
        setInitialReviewPage,
        sellerReviewPageLoad,
        sellerProfilePageLoad,
    };
})();
