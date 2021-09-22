import {Reducer} from "redux";

import {MobileActivationEligibilityCheckStore} from "models";

import {upgradeEligibilityCheckActionTypes} from "../../actions/upgradeEligibilityCheckActions";

export interface EligibilityCheckState {
    carrierFormFields: MobileActivationEligibilityCheckStore | null;
}

export const eligibilityCheckInitialState: EligibilityCheckState = {
    carrierFormFields: null,
};

export const eligibilityCheck: Reducer<EligibilityCheckState> = (state = eligibilityCheckInitialState, action) => {
    switch (action.type) {
        case upgradeEligibilityCheckActionTypes.loadingEligibilityCheckFormFields:
            return {
                ...state,
                carrierFormFields: {
                    ...state.carrierFormFields,
                    loading: true,
                },
            };
        case upgradeEligibilityCheckActionTypes.getEligibilityCheckFormFieldsSuccess:
        case upgradeEligibilityCheckActionTypes.getEligibilityCheckFormFieldsFailure:
            return {
                ...state,
                carrierFormFields: {
                    loading: false,
                    ...action.metadata,
                },
            };
        default:
            return state;
    }
};

export default eligibilityCheck;
