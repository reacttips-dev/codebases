var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GetManufacturerWarrantyStatus, } from "../../business-rules/entities";
/* --------Constants--------*/
export const UPDATE_MANUFACTURER_WARRANTY = "manufacturerWarranty/UPDATE_MANUFACTURER";
export const UPDATE_GET_MANUFACTURER_STATUS = "manufacturerWarranty/UPDATE_GET_MANUFACTURER_STATUS";
export const updateManufacturerWarranty = (manufacturerWarranty) => ({
    payload: { manufacturerWarranty },
    type: UPDATE_MANUFACTURER_WARRANTY,
});
export const updateGetManufacturerStatus = (status) => ({
    payload: { status },
    type: UPDATE_GET_MANUFACTURER_STATUS,
});
export const retrieveManufacturerWarranty = (sku) => (dispatch, getState, { apiManufacturerWarrantyProvider }) => __awaiter(void 0, void 0, void 0, function* () {
    const state = getState();
    const locale = state.intl && state.intl.locale;
    try {
        dispatch(updateGetManufacturerStatus(GetManufacturerWarrantyStatus.PROCESSING));
        const response = yield apiManufacturerWarrantyProvider.getManufacturerWarranty(sku, locale);
        dispatch(updateManufacturerWarranty(response));
        dispatch(updateGetManufacturerStatus(GetManufacturerWarrantyStatus.SUCCESS));
    }
    catch (e) {
        dispatch(updateManufacturerWarranty(defaultState.manufacturerWarranty));
        dispatch(updateGetManufacturerStatus(GetManufacturerWarrantyStatus.FAILURE));
    }
});
const defaultState = {
    getManufacturerStatus: GetManufacturerWarrantyStatus.PROCESSING,
    manufacturerWarranty: {
        labourInDays: 0,
        partsInDays: 0,
    },
};
export default function reducer(state = defaultState, action = {}) {
    switch (action.type) {
        case UPDATE_MANUFACTURER_WARRANTY:
            return Object.assign(Object.assign({}, state), { manufacturerWarranty: action.payload.manufacturerWarranty });
        case UPDATE_GET_MANUFACTURER_STATUS:
            return Object.assign(Object.assign({}, state), { getManufacturerStatus: action.payload.status });
        default:
            return state;
    }
}
/* --------Selectors--------*/
export const getManufacturerWarranty = (state) => {
    if (state) {
        return state.manufacturerWarranty;
    }
};
export const isGetManufacturerWarrantyStatus = (state, status) => {
    if (state) {
        return state.getManufacturerStatus === status;
    }
};
//# sourceMappingURL=index.js.map