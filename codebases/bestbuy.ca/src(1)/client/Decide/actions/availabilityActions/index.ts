import {ActionCreatorsMapObject} from "redux";
import {Dispatch, ThunkResult, getStateFunc, Store, PickupStore} from "models";
import State from "store";
import {ApiAvailabilityProvider} from "providers";
import {errorActionCreators, offerActionCreators, productActionCreators} from "actions";
import {getUserShippingLocationIds} from "store/selectors";

export const availabilityActionsTypes = {
    getAvailabilityFailure: "PRODUCT_AVAILABILITY_FAILURE",
    getAvailabilitySuccess: "PRODUCT_AVAILABILITY_SUCCESS",
    getAvailabilitiesSuccess: "PRODUCT_AVAILABILITIES_SUCCESS",
    clearAvailability: "PRODUCT_CLEAR_AVAILABILITY",
    fetchAvailability: "FETCH_PRODUCT_AVAILABILITY",
};

export interface AvailabilityActionCreators extends ActionCreatorsMapObject {
    getAvailability: (sku?: string, returnSimpleProduct?: boolean) => ThunkResult<void>;
    clearAvailability: () => ThunkResult<void>;
    getProductAvailabilitySellerCount: () => ThunkResult<void>;
}

export const availabilityActionCreators: AvailabilityActionCreators = (() => {
    const clearAvailability = (): ThunkResult<void> => (dispatch: Dispatch) => {
        dispatch({type: availabilityActionsTypes.clearAvailability});
    };

    const getAvailability = (sku?: string, returnSimpleProduct?: boolean): ThunkResult<void> => async (
        dispatch,
        getState: getStateFunc,
    ) => {
        const state: State = getState();

        const product = state.product.product;
        const productSku = product && product.sku ? product.sku : sku ? sku : null;
        const sellerId = product && product.seller && product.seller.id;

        if (productSku === null) {
            return;
        }

        // white goods delivery promise requires full postal code.
        let postalCode = state.user.shippingLocation.postalCode;
        if (product.isSpecialDelivery && postalCode && postalCode.length >= 3 && postalCode.length < 6) {
            postalCode = postalCode.substr(0, 3) + "0A1";
        }

        const availabilityProvider = new ApiAvailabilityProvider(
            state.config.dataSources.availabilityApiUrl,
            state.intl.locale,
        );

        try {
            dispatch({type: availabilityActionsTypes.fetchAvailability});
            const availability = await availabilityProvider.getAvailability(
                {
                    postalCode,
                    sellerId,
                    sku: productSku,
                    storeLocations: getUserShippingLocationIds(state),
                },
                returnSimpleProduct,
            );

            let pickupStores: PickupStore[] = [];

            if (availability.pickup && availability.pickup.stores && availability.pickup.stores.length) {
                pickupStores = availability.pickup.stores.map(
                    (store: Store): PickupStore => {
                        const storeInfo = state.user.shippingLocation.nearbyStores.find(
                            ({locationId}) => locationId === store.locationId,
                        );

                        return {
                            ...(storeInfo || []),
                            ...store,
                        } as PickupStore; // TODO: remove forced type cast
                    },
                );
            }

            dispatch({
                type: availabilityActionsTypes.getAvailabilitySuccess,
                availability: {
                    ...availability,
                    pickup: {
                        ...availability.pickup,
                        stores: pickupStores,
                    },
                },
            });
        } catch (error) {
            dispatch({type: availabilityActionsTypes.getAvailabilityFailure});
            // TODO: Is await required here?
            await dispatch(
                errorActionCreators.error(
                    error,
                    () => productActionCreators.setProductDetailState(productSku),
                    () => getAvailability(),
                ),
            );
        }
    };

    const getProductAvailabilitySellerCount = (): ThunkResult<void> => {
        return async (dispatch) => {
            // TODO: Is await required here?
            await dispatch(offerActionCreators.getOffers());
            await dispatch(getAvailability());
        };
    };

    return {
        clearAvailability,
        getAvailability,
        getProductAvailabilitySellerCount,
    };
})();

export default availabilityActionCreators;
