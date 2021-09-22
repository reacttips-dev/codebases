var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GetBenefitsStatus, } from "../../business-rules/entities";
/* --------Constants--------*/
export const UPDATE_BENEFITS = "servicePlanBenefits/UPDATE_BENEFITS";
export const UPDATE_GET_BENEFITS_STATUS = "servicePlanBenefits/UPDATE_GET_BENEFITS_STATUS";
export const updateBenefits = ({ benefits, servicePlanType, }) => ({
    payload: { benefits, servicePlanType },
    type: UPDATE_BENEFITS,
});
export const updateGetBenefitsStatus = (status) => ({
    payload: { status },
    type: UPDATE_GET_BENEFITS_STATUS,
});
/* --------Async Action Creators--------*/
export const retrieveBenefits = (sku) => (dispatch, getState, { apiBenefitProvider }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const locale = state.intl && state.intl.locale;
    try {
        dispatch(updateGetBenefitsStatus(GetBenefitsStatus.PROCESSING));
        const { benefitMessages, servicePlanType } = yield apiBenefitProvider.getBenefitMessages(sku, locale);
        dispatch(updateBenefits({ benefits: benefitMessages, servicePlanType }));
        dispatch(updateGetBenefitsStatus(GetBenefitsStatus.SUCCESS));
    }
    catch (e) {
        dispatch(updateBenefits({ benefits: [], servicePlanType: null }));
        dispatch(updateGetBenefitsStatus(GetBenefitsStatus.FAILURE));
    }
});
const defaultState = {
    benefits: [],
    getBenefitsStatus: GetBenefitsStatus.PROCESSING,
    servicePlanType: null,
};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_BENEFITS:
            return Object.assign(Object.assign({}, state), { benefits: action.payload.benefits, servicePlanType: action.payload.servicePlanType });
        case UPDATE_GET_BENEFITS_STATUS:
            return Object.assign(Object.assign({}, state), { getBenefitsStatus: action.payload.status });
        default:
            return state;
    }
}
/* --------Selectors--------*/
export const getBenefits = (state) => state && state.benefits;
export const getServicePlanType = (state) => state && state.servicePlanType;
export const isFetchingBenefits = (state) => {
    if (state) {
        return state.getBenefitsStatus === GetBenefitsStatus.PROCESSING;
    }
};
//# sourceMappingURL=index.js.map