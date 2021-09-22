import {AnyAction, ActionCreatorsMapObject} from "redux";
import {ThunkAction} from "redux-thunk";

import State from "store";
import {CellPhoneCarrierID, CarrierMetaDataApiResponse} from "models";

import {CellPhoneUpgradeEligibilityProvider} from "../../providers";
import normalizeUpgradeEligibilityMetadataResponse from "./normalizeUpgradeEligibilityMetadataResponse";

type FetchCarrierMetadataThunk = ThunkAction<
    Promise<void>,
    State,
    {cellPhoneUpgradeEligibilityProvider: CellPhoneUpgradeEligibilityProvider},
    AnyAction
>;

export interface UpgradeEligibilityCheckActionCreators extends ActionCreatorsMapObject {
    fetchCarrierMetadata: (carrierId: CellPhoneCarrierID) => FetchCarrierMetadataThunk;
}

export const upgradeEligibilityCheckActionTypes = {
    loadingEligibilityCheckFormFields: "eligibilityCheck/LOADING_CARRIER_FORM_FIELDS",
    getEligibilityCheckFormFieldsSuccess: "eligibilityCheck/GET_CARRIER_FORM_FIELDS_SUCCESS",
    getEligibilityCheckFormFieldsFailure: "eligibilityCheck/GET_CARRIER_FORM_FIELDS_FAILURE",
};

export const upgradeEligibilityCheckActionCreators: UpgradeEligibilityCheckActionCreators = (() => {
    const fetchCarrierMetadata = (carrierId: CellPhoneCarrierID): FetchCarrierMetadataThunk => async (
        dispatch,
        _,
        {cellPhoneUpgradeEligibilityProvider},
    ) => {
        const defaultMetadata = {
            default: null,
            [carrierId]: null,
        };

        try {
            dispatch({type: upgradeEligibilityCheckActionTypes.loadingEligibilityCheckFormFields});

            const metadata: CarrierMetaDataApiResponse = await cellPhoneUpgradeEligibilityProvider.fetchCarrierMetadata(
                carrierId,
            );

            if (!metadata.upgradeCheck || !metadata.carrierId) {
                throw new Error("invalid eligibility check metadata");
            }

            const normalizedMetadata = normalizeUpgradeEligibilityMetadataResponse(metadata);

            dispatch({
                type: upgradeEligibilityCheckActionTypes.getEligibilityCheckFormFieldsSuccess,
                metadata: normalizedMetadata,
            });
        } catch (error) {
            dispatch({
                type: upgradeEligibilityCheckActionTypes.getEligibilityCheckFormFieldsFailure,
                metadata: defaultMetadata,
            });
        }
    };

    return {
        fetchCarrierMetadata,
    };
})();
