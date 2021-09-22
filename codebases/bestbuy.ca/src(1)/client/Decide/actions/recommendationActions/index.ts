import {availabilityActionsTypes, errorActionCreators} from "actions";
import State from "store";
import {ActionCreatorsMapObject, Action} from "redux";
import {AvailabilityShippingStatus, Dispatch, getStateFunc, ThunkResult} from "models";
import {ApiAvailabilityProvider} from "providers";
import {GetAvailabilitiesError} from "errors/GetAvailabilitiesError";

export const recommendationActionTypes = {
    getRecommendations: "FETCH_TARGET",
    resetBoughtAlsoBought: "RECOMMENDATION_RESET_BOUGHT_ALSO_BOUGHT",
};

export interface RecommendationActionCreators extends ActionCreatorsMapObject {
    getRecommendationAvailabilities: (skus: string[]) => ThunkResult<void>;
    getRecommendations: () => Action;
    resetBoughtAlsoBought: () => Action;
}

export const recommendationActionCreators: RecommendationActionCreators = (() => {
    const getRecommendations = () => {
        return {
            type: recommendationActionTypes.getRecommendations,
        };
    };

    const getRecommendationAvailabilities = (skus: string[]): ThunkResult<void> => {
        return async (dispatch: Dispatch, getState: getStateFunc) => {
            const state: State = getState();
            const availabilityProvider = new ApiAvailabilityProvider(
                state.config.dataSources.availabilityApiUrl,
                state.intl.locale,
            );
            let availabilityInfo: any = {};
            const products = state.product.recommendations.boughtAlsoBought;

            try {
                availabilityInfo = await availabilityProvider.getAvailabilities({
                    postalCode: state.user.shippingLocation.postalCode,
                    skus,
                    storeLocations: [],
                });
            } catch (error) {
                dispatch(errorActionCreators.error(new GetAvailabilitiesError(error.code, error.message)));
            }

            const availabilities = availabilityInfo.availabilities || [];
            const productsWithAvailabilities = products.map((recommendation) => {
                const availability = availabilities.find((product) => product.sku === recommendation.sku);

                let isAvailableStatus = null;
                let isPreOrderStatus = null;
                if (availability && availability.shipping) {
                    isAvailableStatus =
                        availability.shipping.status === AvailabilityShippingStatus.InStock ||
                        availability.shipping.status === AvailabilityShippingStatus.InStockOnlineOnly ||
                        availability.shipping.status === AvailabilityShippingStatus.BackOrder;
                    isPreOrderStatus = availability.shipping.status === AvailabilityShippingStatus.Preorder;
                }

                return {
                    ...recommendation,
                    isAvailable: isAvailableStatus,
                    isPreOrder: isPreOrderStatus,
                    isAvailabilityLoaded: true,
                };
            });
            dispatch({
                type: availabilityActionsTypes.getAvailabilitiesSuccess,
                productsWithAvailabilities,
            });
        };
    };

    const resetBoughtAlsoBought = () => {
        return {
            type: recommendationActionTypes.resetBoughtAlsoBought,
        };
    };

    return {
        getRecommendationAvailabilities,
        getRecommendations,
        resetBoughtAlsoBought,
    };
})();

export default recommendationActionCreators;
