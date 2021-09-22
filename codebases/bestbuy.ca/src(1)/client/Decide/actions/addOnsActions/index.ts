import {ActionCreatorsMapObject, AnyAction} from "redux";
import {routerActions} from "react-router-redux";
import {xor} from "lodash-es";
import {ProductContent, WarrantyType, Warranty, ThunkResult} from "models";
import {
    fetchDetailedRequiredProducts,
    trackRequiredPartsPageLoad,
} from "@bbyca/ecomm-checkout-components/dist/redux/requiredProducts";
import {getLineItemBySku, addChildItem, removeChildItem} from "@bbyca/ecomm-checkout-components";
import {
    IChildItemAddition,
    LineItemType,
    IChildItem,
} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";
import {ThunkAction} from "redux-thunk";

import {errorActionCreators} from "actions/errorActions";
import {userActionCreators} from "actions/userActions";
import State from "store";
import routeManager from "utils/routeManager";
import {getOfferProvider} from "providers";

import {getSelectedGspFromSku} from "../../store/selectors/cartSelectors";
import {getBenefitsMessageForSku} from "../../store/selectors/gspSelectors";
import {gspActionCreators} from "../../actions/gspActions";
import {
    getFutureDatePricingValue,
    getUserShippingLocationRegionCode,
    isFutureDatePricingEnabled,
} from "store/selectors";
import {offersActionCreatores} from "actions/offersActions";

export const addOnsPageActionTypes = {
    loadProductContent: "addOnsPage/loadProductContent",
    updateParentItemJustAdded: "UPDATE_PARENT_ITEM_JUST_ADDED",
};
interface ContentPayloadProps {
    content?: ProductContent;
    sku: string;
    warrantyType: WarrantyType;
}
export interface AddOnsPageActionCreators extends ActionCreatorsMapObject {
    goToRequiredProducts: (sku: string, language: Language) => void;
    loadProductContent: (payload: ContentPayloadProps) => {type: string; payload: ContentPayloadProps};
    onLoad(sku: string): void;
    updateParentItemJustAdded(val: boolean): void;
    updateWarrantyForSku(sku: string, warranty: Warranty | null): ThunkAction<void, State, {}, AnyAction>;
    updateServicesForSku(sku: string, serviceIds: string[]): ThunkResult<void>;
}

export const addOnsPageActionCreators: AddOnsPageActionCreators = (() => {
    const loadProductContent = (payload: ContentPayloadProps) => {
        return {
            type: addOnsPageActionTypes.loadProductContent,
            payload,
        };
    };

    const onLoad = (sku: string) => async (dispatch, getState) => {
        const state = getState();
        const futureDatePricingEnabled = isFutureDatePricingEnabled(state);

        await dispatch(fetchDetailedRequiredProducts(sku, futureDatePricingEnabled ? {credentials: "include"} : null));

        const offers = await getOfferProvider(state.config.dataSources.offerApiUrl, futureDatePricingEnabled).getOffers(
            sku,
            getUserShippingLocationRegionCode(state),
            getFutureDatePricingValue(state),
        );

        dispatch(offersActionCreatores.setOffers(offers, sku));

        dispatch(trackRequiredPartsPageLoad());

        const benefitsMessage = getBenefitsMessageForSku(sku)(getState());

        if (!benefitsMessage) {
            dispatch(gspActionCreators.fetchWarrantyBenefits(sku));
        }
    };

    const updateParentItemJustAdded = (val: boolean) => async (dispatch) => {
        dispatch({
            type: addOnsPageActionTypes.updateParentItemJustAdded,
            parentItemJustAdded: val,
        });
    };

    const updateWarrantyForSku = (sku: string, warranty: Warranty | null) => async (dispatch, getState) => {
        await dispatch(userActionCreators.locate(true));
        const state = getState();
        const parentLineItem = getLineItemBySku(state.cart, sku);
        try {
            if (warranty) {
                const childItem: IChildItemAddition = {
                    sku: warranty.sku,
                    lineItemType: LineItemType.Psp,
                    quantity: 1,
                };
                await dispatch(addChildItem(parentLineItem.id, childItem));
                dispatch(userActionCreators.updateCartCount());
            } else {
                const currentWarranty = getSelectedGspFromSku(sku)(state);
                if (currentWarranty && currentWarranty.id) {
                    await dispatch(removeChildItem(parentLineItem.id, currentWarranty.id));
                }
            }
        } catch (error) {
            await dispatch(errorActionCreators.error(error));
            throw error;
        }
    };

    const updateServicesForSku = (sku: string, serviceIds: string[]): ThunkResult<void> => async (
        dispatch,
        getState,
    ) => {
        await dispatch(userActionCreators.locate(true));
        const state = getState();
        const parentLineItem = state.cart && getLineItemBySku(state.cart, sku);
        if (parentLineItem) {
            const childServicesMap: Record<string, IChildItem> = {};
            const existingServices = parentLineItem.children?.reduce?.((data, lineItem) => {
                const {
                    sku: {id: serviceSku},
                    lineItemType,
                } = lineItem;
                childServicesMap[serviceSku] = lineItem;
                if (lineItemType === LineItemType.Service) {
                    data.push(serviceSku);
                }
                return data;
            }, [] as string[]);
            const [changed] = xor(existingServices, serviceIds);
            if (changed && serviceIds.indexOf(changed) !== -1) {
                const childItem: IChildItemAddition = {
                    sku: changed,
                    lineItemType: LineItemType.Service,
                    quantity: 1,
                };
                await dispatch(addChildItem(parentLineItem.id, childItem));
            } else if (changed) {
                await dispatch(removeChildItem(parentLineItem.id, childServicesMap[changed].id));
            }
        }
    };

    const goToRequiredProducts = (sku: string, language: Language) => (dispatch: Dispatch) => {
        dispatch(updateParentItemJustAdded(true));
        dispatch(
            routerActions.push({
                pathname: routeManager.getPathByKey(language, "requiredParts", sku),
            }),
        );
    };

    return {
        loadProductContent,
        onLoad,
        updateParentItemJustAdded,
        updateWarrantyForSku,
        goToRequiredProducts,
        updateServicesForSku,
    };
})();
