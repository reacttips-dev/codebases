/**
 * These are selectors for the cart state
 */
import {createSelector, Selector} from "reselect";
import {
    Cart,
    ShipmentLineItem,
    LineItemType,
    ServicePlanType,
} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import {State} from "store";
import {Warranty, WarrantySubType, WarrantyType} from "models";

export const getCart: Selector<State, Cart> = (state: State) => state.cart;

export const getRootState: Selector<State, State> = (state: State) => state;

export const getLineItemBySku = (sku: string) =>
    createSelector<State, Cart, ShipmentLineItem | undefined>([getCart], (cart: Cart) => {
        let lineItemFound;
        const shipments = (cart && cart.shipments) || [];
        for (const shipment of shipments) {
            if (lineItemFound) {
                break;
            }
            for (const lineItem of shipment.lineItems) {
                if (lineItem.sku.id === sku) {
                    lineItemFound = lineItem;
                    break;
                }
            }
        }
        return lineItemFound;
    });

export const getCartErrorType = createSelector<State, Cart, string>([getCart], (cart) => cart && cart.errorType);

export const getCartStatus = createSelector<State, Cart, string | undefined>([getCart], (cart) => cart && cart.status);

// This gsp selector is here because its tied to the cart state.
export const getSelectedGspFromSku = (sku: string) =>
    createSelector<State, State, Warranty | null>([getRootState], (rootState) => {
        let gspPlanFound: Warranty | null = null;
        const lineItem = getLineItemBySku(sku)(rootState);
        if (lineItem && lineItem.children) {
            for (const childLineItem of lineItem.children) {
                if (childLineItem.lineItemType === LineItemType.Psp) {
                    const availableServicePlan =
                        lineItem.availableServicePlans &&
                        lineItem.availableServicePlans.find((servicePlan) => {
                            return servicePlan.sku.id === childLineItem.sku.id;
                        });

                    if (availableServicePlan) {
                        const isPsp = availableServicePlan.servicePlanType === ServicePlanType.PSP;

                        gspPlanFound = {
                            parentSku: lineItem.sku.id,
                            regularPrice: childLineItem.sku.offer.regularPrice,
                            sku: childLineItem.sku.id,
                            subType: isPsp ? WarrantySubType.InHome : WarrantySubType.InStore,
                            termMonths: availableServicePlan.termMonths,
                            title: childLineItem.sku.product.name,
                            type: isPsp ? WarrantyType.PSP : WarrantyType.PRP,
                            id: childLineItem.id,
                        };
                    }
                    break;
                }
            }
        }
        return gspPlanFound;
    });
