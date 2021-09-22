import {createSelector, Selector} from "reselect";
import {ServicePlanType} from "@bbyca/ecomm-checkout-components";

import {State} from "store";
import {Warranty, BenefitsMessage, WarrantyType, HtmlBlock, GlobalCMSContextMap, CmsWarrantyType} from "models";
import { AppState } from "reducers";
import { getProductData } from "store/selectors";

import {getLineItemBySku as getCartPageLineItemBySku} from "../../../pages/BasketPage/selectors/index";
import {GSPState} from "../../../reducers/gspReducer";
import {AddOnsState} from "../../../reducers/addOnsPageReducer";
import {getLineItemBySku} from "../cartSelectors";

const getGlobalState: Selector<State, State> = (state: State): State => state;

const getAddonsPageState: Selector<State, AddOnsState> = (state: State) => state.addOnsPage;

const getAppState: Selector<State, AppState> = (state: State) => state.app;

export const getGspState: Selector<State, GSPState> = (state: State) => state.gsp;

export const getBenefitsMessage = (sku: string) =>
    createSelector<State, AddOnsState, BenefitsMessage | undefined>([getAddonsPageState], (state) => {
        const data = state.warrantyBenefitsMessage && state.warrantyBenefitsMessage[sku];
        if (data) {
            const {cmsBenefitsMessage, productApiBenefitsMessage} = data;
            if (cmsBenefitsMessage?.body) {
                const {title, ...cmsMessageWithoutTitle} = cmsBenefitsMessage; // Removes title from message as this is not customer-facing
                return cmsMessageWithoutTitle;
            }
            if (productApiBenefitsMessage?.title) {
                return productApiBenefitsMessage; // Once migration is done. Remove support for productApiBenefitsMessage
            }
            return {
                title: "",
                body: "",
                warrantyType:
                    cmsBenefitsMessage?.warrantyType ||
                    productApiBenefitsMessage?.warrantyType ||
                    WarrantyType.PSP,
            };
        }
        return;
    });

export const getGspPlansForSku = (sku: string) =>
    createSelector<State, State, Warranty[]>([getGlobalState], (rootState: State) => {
        let gspPlans: Warranty[] = [];
        const lineItem = getLineItemBySku(sku)(rootState);
        const requiredPartsWarranties = rootState?.requiredProducts?.[sku]?.warranties;

        if (lineItem?.availableServicePlans) {
            lineItem.availableServicePlans.map((warranty) => {
                const gspType = warranty.servicePlanType === ServicePlanType.PSP ? WarrantyType.PSP : WarrantyType.PRP;
                const data: Warranty = {
                    parentSku: lineItem.sku.id,
                    regularPrice: warranty.sku.offer.regularPrice,
                    sku: warranty.sku.id,
                    subType: "", // this is not used
                    termMonths: warranty.termMonths,
                    title: warranty.sku.product.name,
                    type: gspType,
                };
                gspPlans.push(data);
            });
        } else if (requiredPartsWarranties) {
            gspPlans = requiredPartsWarranties;
        }

        return gspPlans;
    });

export const getBenefitsFallbackMessage = (warrantyType: CmsWarrantyType) =>
    createSelector<State, AppState, BenefitsMessage | undefined>([getAppState], (app) => {
        const benefitsType = `${warrantyType}-fallback` as keyof GlobalCMSContextMap;
        const cmsContent =  app?.globalContent?.content[benefitsType]?.items?.[0] as HtmlBlock;
        if (cmsContent?.htmlBody) {
            return {
                title: "Default Warranty Benefits Text",
                body: cmsContent?.htmlBody,
                warrantyType: (warrantyType === "gsrp" ? "PRP" : "PSP") as WarrantyType
            };
        }
    });

export const getBenefitsMessageForSku = (sku: string) => {
    return createSelector([getGlobalState], (state: State) => {
        const gsp = getGspState(state);
        // we want to return undefined if no attempt has been made to fetch benefits message for this sku.
        // Without doing this, the fallback message will always be shown, as it's fetched and cached before the
        // sku-specific benefits message is fetched
        if (!gsp?.[sku]) {
            return;
        }
        const gspType = getGspTypeForLineItemSku(sku)(state);
        const benefitsFallbackMessage = getBenefitsFallbackMessage(CmsWarrantyType[gspType as keyof typeof CmsWarrantyType])(state);
        const msg = gsp[sku]?.benefitsMessage;
        return msg?.body ? msg : benefitsFallbackMessage;
    });
};

export const getGspTypeForLineItemSku = (sku: string) =>
    createSelector<State, State, ServicePlanType | CmsWarrantyType | string | undefined>([getGlobalState], (rootState) => {
        const lineItem = getLineItemBySku(sku)(rootState);
        const cartPageLineItem = getCartPageLineItemBySku(sku)(rootState);
        const productData = getProductData(rootState);
        let warrantyType;
        if (lineItem) {
            warrantyType =
                lineItem?.availableServicePlans?.[0]?.servicePlanType;
        } else if (cartPageLineItem) {
            warrantyType =
                cartPageLineItem?.product?.availableServicePlans?.[0]?.servicePlanType;
        } else if (productData) {
            warrantyType = productData.warranties?.[0]?.type;
        } else {
            const requiredPartsWarranties =
                rootState?.requiredProducts?.[sku]?.warranties;
            warrantyType = requiredPartsWarranties?.[0]?.type;
        }
        return warrantyType;
    });
