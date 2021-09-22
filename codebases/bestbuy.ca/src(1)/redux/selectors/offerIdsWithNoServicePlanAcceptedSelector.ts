import { ServicePlanType } from "../../business-rules/entities";
// could possibly use the https://github.com/reduxjs/reselect one day
export const getLineItemIDsForUnacceptedServicePlans = (state) => {
    // TODO: This is temporary code and could be better designed once the
    // gspInCart and grpInCart feature toggles are removed this can be deleted
    // <26-03-19, joshualim> //
    const features = state.config && state.config.features;
    const correctServicePlanType = (servicePlan) => {
        if (features && features.grpInCart && servicePlan.servicePlanType === ServicePlanType.PRP) {
            return true;
        }
        if (features && features.gspInCart && servicePlan.servicePlanType === ServicePlanType.PSP) {
            return true;
        }
        return false;
    };
    const shipments = (state.cart && state.cart.shipments)
        ? state.cart.shipments
        : undefined;
    const servicePlans = (state.servicePlan && state.servicePlan.availableServicePlans)
        ? state.servicePlan.availableServicePlans
        : undefined;
    const lineItems = (shipments && [].concat(...shipments.map((s) => s.lineItems))) || [];
    const isServicePlan = (lineItemId, childLineItemSkuID) => {
        const isServicePlanTheChildItem = (servicePlan) => servicePlan.sku === childLineItemSkuID;
        return !!servicePlans[lineItemId].plans.filter(isServicePlanTheChildItem).length;
    };
    const lineItemIdsWithUnacceptedServicePlans = [];
    lineItems.forEach((lineItem) => {
        if (!lineItem.removed && lineItem.children) {
            lineItem.children.forEach((childLineItem) => {
                // TODO: Remove "correctServicePlanType" after feature toggles
                // are removed <26-03-19, joshualim> //
                if (servicePlans && servicePlans[lineItem.id] && correctServicePlanType(servicePlans[lineItem.id])) {
                    const isAccepted = servicePlans[lineItem.id].isServicePlanAccepted;
                    if (!isAccepted && isServicePlan(lineItem.id, childLineItem.sku.id)) {
                        lineItemIdsWithUnacceptedServicePlans.push(lineItem.id);
                    }
                }
            });
        }
    });
    return lineItemIdsWithUnacceptedServicePlans;
};
//# sourceMappingURL=offerIdsWithNoServicePlanAcceptedSelector.js.map