import {ActionCreatorsMapObject, Action} from "redux";
import {get} from "lodash-es";
import {ServicePlanType} from "@bbyca/ecomm-checkout-components";

import {createProductContentProvider} from "providers";
import State from "store";
import {CmsWarrantyType, Dispatch, getStateFunc, BenefitsMessage, ThunkResult, WarrantyType} from "models";

import {getGspTypeForLineItemSku} from "../../store/selectors";

export enum GSPActionTypes {
    FETCH_WARRANTY_BENEFITS = "gsp/FETCH_WARRANTY_BENEFITS",
    FETCH_WARRANTY_BENEFITS_SUCCESS = "gsp/FETCH_WARRANTY_BENEFITS_SUCCESS",
    FETCH_WARRANTY_BENEFITS_ERROR = "gsp/FETCH_WARRANTY_BENEFITS_ERROR",
}
// tslint:disable-next-line: no-empty-interface
export interface GSPActionCreators extends ActionCreatorsMapObject {
    fetchWarrantyBenefits: (sku: string | null) => ThunkResult<Promise<BenefitsMessage|void> | undefined>;
    fetchWarrantyBenefitsSuccess: (payload: FetchWarrantyBenefitsSuccess) => Action;
    fetchWarrantyBenefitsError: (payload: FetchWarrantyBenefitsError) => Action;
}

interface FetchWarrantyBenefitsSuccess {
    sku: string;
    data: BenefitsMessage;
}

interface FetchWarrantyBenefitsError {
    sku: string;
    error: any;
}

export const gspActionCreators: GSPActionCreators = (() => {
    const fetchWarrantyBenefitsSuccess = (payload: FetchWarrantyBenefitsSuccess) => ({
        type: GSPActionTypes.FETCH_WARRANTY_BENEFITS_SUCCESS,
        payload,
    });

    const fetchWarrantyBenefitsError = (payload: FetchWarrantyBenefitsError) => ({
        type: GSPActionTypes.FETCH_WARRANTY_BENEFITS_ERROR,
        payload,
    });

    const fetchWarrantyBenefits = (sku: string | null) => async (dispatch: Dispatch, getState: getStateFunc): Promise<BenefitsMessage|void> => {
        return new Promise(async (resolve, reject): Promise<BenefitsMessage|void> => {
            if (!sku) {
                return reject(new Error("sku is a required paramter"));
            }

            const state: State = getState();
            const gspType = getGspTypeForLineItemSku(sku)(state);
            const isPSP = gspType === ServicePlanType.PSP;

            try {
                const provider = createProductContentProvider(
                    state.config.dataSources.contentApiUrl,
                    state.intl.locale,
                    state.app.location.regionCode,
                    sku,
                );
                const content = await provider.getContent();

                if (gspType) {
                    const cmsWarrantyType = isPSP ? CmsWarrantyType.PSP : CmsWarrantyType.PRP;
                    const path = `contexts.${cmsWarrantyType.toLowerCase()}.items[0]`;
                    const benefitsContent = get(content, path);
                    const payload: BenefitsMessage = {
                        body: benefitsContent.body,
                        warrantyType: isPSP ? WarrantyType.PSP : WarrantyType.PRP,
                    };
                    dispatch(
                        fetchWarrantyBenefitsSuccess({
                            sku,
                            data: payload,
                        }),
                    );
                    return resolve(payload);
                }
            } catch (error) {
                if (gspType) {
                    const data: BenefitsMessage = {
                        body: "",
                        warrantyType: isPSP ? WarrantyType.PSP : WarrantyType.PRP,
                    };
                    dispatch(
                        fetchWarrantyBenefitsSuccess({
                            sku,
                            data,
                        }),
                    );
                    return resolve(data);
                } else {
                    dispatch(fetchWarrantyBenefitsError({sku, error}));
                    return reject(error);
                }
            }
            return reject("unable to fetch warranty benefits");
        });
    };

    return {
        fetchWarrantyBenefits,
        fetchWarrantyBenefitsSuccess,
        fetchWarrantyBenefitsError,
    };
})();
