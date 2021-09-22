import {
    Availabilities,
    AvailabilityReduxStore,
    CustomerReviews,
    DetailedProduct as Product,
    ProductSellerSummary,
    ProductContent,
    Recommendations,
    ReviewSortOptions,
    Offer,
    toProductSellerSummary,
    ProductVariant,
    ReviewStarRating,
    SpecialOffer
} from "models";
import {Category} from "models/Category";

import {
    productActionTypes,
    productLoadActionTypes,
    availabilityActionsTypes,
    recommendationActionTypes,
    storesActionTypes,
    productVariantActionTypes,
    offerActionTypes,
} from "../../actions";

export interface ProductState {
    isAvailabilityError: boolean;
    availabilities: Availabilities;
    availability: AvailabilityReduxStore;
    isAvailabilityLoading: boolean;
    category: Category;
    customerReviews: CustomerReviews;
    loadingProduct: boolean;
    loadingStores: boolean;
    loadingVariants: boolean;
    offer?: Offer;
    pdpFindingMethod: string;
    placeholderImage?: string;
    product: Product;
    recommendations: Recommendations;
    sellers: ProductSellerSummary & {loading: boolean};
    specialOffers: SpecialOffer[];
    targettedContent: ProductContent;
}

export const initialProductState: ProductState = {
    isAvailabilityError: false,
    availability: null,
    availabilities: {},
    isAvailabilityLoading: false,
    customerReviews: {
        sortOption: ReviewSortOptions.relevancy,
        filter: {verifiedPurchaserToggleSelected: false},
        customerReviews: [],
        ratingSummary: {
            averageRating: 0,
            reviewCount: 0,
            ratingDistribution: {
                [ReviewStarRating.One]: 0,
                [ReviewStarRating.Two]: 0,
                [ReviewStarRating.Three]: 0,
                [ReviewStarRating.Four]: 0,
                [ReviewStarRating.Five]: 0,
            },
            localeReviewCount: {
                english: 0,
                french: 0,
            },
            recommendationCount: {
                positive: 0,
                negative: 0,
            },
            keyConsiderations: {
                value: null,
                quality: null,
                easeOfUse: null,
            },
        },
        currentPage: 0,
        pageSize: 10,
        totalPages: 0,
        totalRows: 0,
        loadingReviews: false,
    },
    category: null,
    loadingProduct: false,
    loadingStores: false,
    loadingVariants: false,
    product: null,
    sellers: {
        count: 0,
        loading: false,
    },
    recommendations: {
        customerAlsoViewed: [],
        openBox: [],
        recentlyViewed: [],
        supportContent: {},
        boughtAlsoBought: [],
        showcaseContent: {},
        variants: [],
    },
    specialOffers: [],
    targettedContent: {
        id: null,
        sections: [],
        contexts: [],
    },
    pdpFindingMethod: "",
};

export const product = (state = initialProductState, action) => {
    switch (action.type) {
        case productActionTypes.productMediaLoading:
            return {
                ...state,
                product: {
                    ...state.product,
                    media: {loading: true},
                },
            };
        case productActionTypes.setProductMediaSuccess:
            return {
                ...state,
                product: {
                    ...state.product,
                    media: {...action.payload, loading: false},
                },
            };
        case productVariantActionTypes.getProductVariantsSuccess:
            const productVariants: ProductVariant[][] = action.productVariants;
            return {
                ...state,
                loadingVariants: false,
                product: {
                    media: state.product && state.product.media,
                    ...state.product,
                    productVariants,
                },
            };
        case productVariantActionTypes.getProductVariantsFailure:
            return {
                ...state,
                loadingVariants: false,
            };
        case productActionTypes.getProductSuccess:
            return {
                ...state,
                customerReviews: initialProductState.customerReviews,
                loadingProduct: false,
                product: {
                    ...action.product,
                    media: state.product && state.product.media,
                    customerRating: (state.product && state.product.customerRating) || null,
                    customerRatingCount: (state.product && state.product.customerRatingCount) || 0,
                },
                category: initialProductState.category,
                recommendations: {
                    ...initialProductState.recommendations,
                },
                targettedContent: initialProductState.targettedContent,
            };
        case availabilityActionsTypes.fetchAvailability:
            return {
                ...state,
                isAvailabilityError: false,
                isAvailabilityLoading: true,
            };

        case availabilityActionsTypes.getAvailabilityFailure:
            return {
                ...state,
                isAvailabilityError: true,
                isAvailabilityLoading: false,
            };

        case availabilityActionsTypes.getAvailabilitySuccess:
            if (state.product.sku === action.availability.sku) {
                return {
                    ...state,
                    availability: action.availability,
                    loadingStores: false,
                    isAvailabilityLoading: false,
                };
            } else {
                return {
                    ...state,
                    loadingStores: false,
                };
            }

        case recommendationActionTypes.resetBoughtAlsoBought:
            return {
                ...state,
                recommendations: {
                    ...state.recommendations,
                    boughtAlsoBought: initialProductState.recommendations.boughtAlsoBought,
                },
            };

        case availabilityActionsTypes.getAvailabilitiesSuccess:
            return {
                ...state,
                isAvailabilityLoading: false,
                recommendations: {
                    ...state.recommendations,
                    boughtAlsoBought: action.productsWithAvailabilities,
                },
            };
        case productActionTypes.setState:
            return {
                ...state,
                ...action.state,
            };
        case productActionTypes.getReviewsSuccess:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    ...action.customerReviews,
                    loadingReviews: false,
                },
            };
        case productActionTypes.getDetailedReviewSummarySuccess:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    ratingSummary: action.ratingSummary,
                    loadingReviews: false,
                },
                product: {
                    ...state.product,
                    media: state.product && state.product.media,
                    customerRating: (action.ratingSummary && action.ratingSummary.averageRating) || null,
                    customerRatingCount: (action.ratingSummary && action.ratingSummary.reviewCount) || 0,
                },
            };
        case productActionTypes.getMoreReviewsSuccess:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    ...action.customerReviews,
                    loadingReviews: false,
                },
            };
        case productActionTypes.loadingReviews:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    loadingReviews: true,
                },
            };
        case productActionTypes.fetchProduct:
            return {
                ...state,
                loadingProduct: true,
            };
        case availabilityActionsTypes.clearAvailability:
            return {
                ...state,
                availability: null,
            };
        case productActionTypes.resetProductState:
            return {
                ...initialProductState,
            };
        case storesActionTypes.fetchStores:
            return {
                ...state,
                loadingStores: true,
            };
        case productActionTypes.cancelFetchStores:
            return {
                ...state,
                loadingStores: false,
            };
        case productLoadActionTypes.initialLoad:
            return {
                ...state,
                availability: action.availability,
                loadingProduct: true,
                product: action.product,
                category: initialProductState.category,
                sellers: initialProductState.sellers,
            };
        case offerActionTypes.getOffers:
            return {
                ...state,
                sellers: {...state.sellers, loading: true},
            };
        case offerActionTypes.getOffersFailure:
            return {
                ...state,
                offer: initialProductState.offer,
                sellers: {...initialProductState.sellers},
            };
        case offerActionTypes.getOffersSuccess:
            const offers: Offer[] = action.offers;
            return {
                ...state,
                offer: offers.find((offer) => offer.isWinner),
                sellers: {...toProductSellerSummary(offers), loading: false},
            };
        case offerActionTypes.getSpecialOffersSuccess:
            const specialOffers: SpecialOffers[] = action.specialOffers;
            return {
                ...state,
                specialOffers: specialOffers
            };
        case productActionTypes.setCategory:
            if (action.category.id === state.product.primaryParentCategoryId) {
                return {
                    ...state,
                    category: {
                        ...action.category,
                    },
                };
            } else {
                return state;
            }
        case productActionTypes.getShowcaseContentSuccess:
            return {
                ...state,
                recommendations: {...state.recommendations, showcaseContent: action.showcaseContent},
            };
        case productActionTypes.getProductContentSuccess:
            return {
                ...state,
                targettedContent: action.content,
            };
        case productActionTypes.trackProductPageView:
            return {
                ...state,
                pdpFindingMethod: action.pdpFindingMethod,
            };
        case productActionTypes.sortCustomerReviews:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    sortOption: action.sortOption,
                },
            };
        case productActionTypes.filterReviewsByVerifiedPurchaser:
            return {
                ...state,
                customerReviews: {
                    ...state.customerReviews,
                    filter: {
                        verifiedPurchaserToggleSelected: action.isToggleSelected,
                    },
                },
            };
        case productActionTypes.loadingCellPhonePlan:
            return {
                ...state,
                product: {
                    ...state.product,
                    cellPhonePlan: {
                        loading: true,
                    },
                },
            };
        case productActionTypes.getCellPhonePlanSuccess:
            return {
                ...state,
                product: {
                    ...state.product,
                    cellPhonePlan: {
                        ...action.cellPhonePlan,
                        loading: false,
                    },
                },
            };
        default:
            return state;
    }
};

export default product;
