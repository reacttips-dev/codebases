import { ServicePlanType, } from "../../business-rules/entities";
/* --------Constants--------*/
export const UPDATE_AVAILABLE_SERVICE_PLANS = "servicePlan/UPDATE_AVAILABLE_SERVICE_PLANS";
export const UPDATE_ACCEPT_SERVICE_PLAN = "servicePlan/UPDATE_ACCEPT_SERVICE_PLAN";
export const HIGHLIGHT_ACCEPT_SERVICE_PLAN = "servicePlan/HIGHLIGHT_ACCEPT_SERVICE_PLAN";
export const updateAvailableServicePlans = (lineItemId, servicePlans, servicePlanType) => ({
    payload: { lineItemId, servicePlans, servicePlanType },
    type: UPDATE_AVAILABLE_SERVICE_PLANS,
});
export const updateAcceptServicePlan = (lineItemId, isAccepted) => ({
    payload: { lineItemId, isAccepted },
    type: UPDATE_ACCEPT_SERVICE_PLAN,
});
export const highlightAcceptServicePlan = (lineItemIDs) => ({
    payload: { lineItemIDs },
    type: HIGHLIGHT_ACCEPT_SERVICE_PLAN,
});
/* --------Async Action Creators--------*/
export const extractAvailableServicePlans = (cart) => (dispatch) => {
    if (cart && cart.shipments) {
        cart.shipments.forEach((shipment) => {
            shipment.lineItems.forEach((lineItem) => {
                let availableWarranties = [];
                if (lineItem.availableServicePlans) {
                    if (isAllPlanTypesMatching(lineItem.availableServicePlans)) {
                        const servicePlanType = lineItem.availableServicePlans[0].servicePlanType;
                        availableWarranties = constructAvailableServicePlans(lineItem.availableServicePlans);
                        dispatch(updateAvailableServicePlans(lineItem.id, availableWarranties, servicePlanType));
                    }
                }
            });
        });
    }
};
const isAllPlanTypesMatching = (servicePlans) => {
    const firstPlanType = servicePlans[0].servicePlanType;
    return servicePlans.every((plan) => plan.servicePlanType === firstPlanType);
};
const constructAvailableServicePlans = (servicePlans) => {
    return servicePlans
        .filter((plan) => {
        return plan.servicePlanType === ServicePlanType.PSP || plan.servicePlanType === ServicePlanType.PRP;
    })
        .map((plan) => ({
        name: plan.sku.product.name,
        purchasePrice: plan.sku.offer.regularPrice,
        sku: plan.sku.id,
        termMonths: plan.termMonths,
    }))
        .sort((a, b) => a.termMonths - b.termMonths);
};
const defaultState = {
    availableServicePlans: {},
    lineItemIDsWithNoWarrantyAccepted: [],
};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_AVAILABLE_SERVICE_PLANS:
            const updateLineItemId = action.payload.lineItemId;
            const payload = action.payload;
            return Object.assign(Object.assign({}, state), { availableServicePlans: Object.assign(Object.assign({}, state.availableServicePlans), { [updateLineItemId]: {
                        isServicePlanAccepted: false,
                        plans: payload.servicePlans,
                        servicePlanType: payload.servicePlanType,
                    } }) });
        case UPDATE_ACCEPT_SERVICE_PLAN:
            const acceptLineItemId = action.payload.lineItemId;
            return Object.assign(Object.assign({}, state), { availableServicePlans: Object.assign(Object.assign({}, state.availableServicePlans), { [acceptLineItemId]: Object.assign(Object.assign({}, state.availableServicePlans[acceptLineItemId]), { isServicePlanAccepted: action.payload.isAccepted }) }) });
        case HIGHLIGHT_ACCEPT_SERVICE_PLAN:
            return Object.assign(Object.assign({}, state), { lineItemIDsWithNoWarrantyAccepted: action.payload.lineItemIDs });
        default:
            return state;
    }
}
/* --------Selectors--------*/
export const getServicePlans = (state, lineItemId) => {
    const servicePlans = state && state.availableServicePlans[lineItemId]
        ? state.availableServicePlans[lineItemId].plans
        : null;
    return servicePlans ? servicePlans : [];
};
export const getLineItemServicePlanType = (state, lineItemId) => {
    return state && state.availableServicePlans[lineItemId]
        ? state.availableServicePlans[lineItemId].servicePlanType
        : null;
};
//# sourceMappingURL=index.js.map