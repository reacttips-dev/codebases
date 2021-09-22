import {BenefitsMessage} from "models";

import {productActionTypes} from "../../actions/productActions/product";
import {addOnsPageActionTypes} from "../../actions/addOnsActions";

import {transformWarrantyBenefitsMessageIntoHtml, flattenCmsWarrantyMessages} from "./warrantyBenefitsMessageAdapter";

export interface AddOnsPageSku {
    cmsBenefitsMessage: BenefitsMessage;
    productApiBenefitsMessage: BenefitsMessage;
    newlyAddedParentItem: boolean;
}

export interface AddOnsState {
    warrantyBenefitsMessage: {
        [key: string]: AddOnsPageSku;
    };
    parentItemJustAdded: boolean;
}

export const addOnsPageInitialState: AddOnsState = {
    warrantyBenefitsMessage: {},
    parentItemJustAdded: false,
};

export const addOnsPage = (state: AddOnsState = addOnsPageInitialState, action): AddOnsState => {
    switch (action.type) {
        case addOnsPageActionTypes.loadProductContent: {
            const {content, warrantyType, sku} = action.payload;
            return {
                ...state,
                warrantyBenefitsMessage: {
                    ...state.warrantyBenefitsMessage,
                    [sku]: {
                        ...state.warrantyBenefitsMessage[sku],
                        cmsBenefitsMessage: flattenCmsWarrantyMessages(content && content.contexts, warrantyType),
                    },
                },
            };
        }
        case productActionTypes.getProductSuccess: {
            const {product} = action;
            const {sku} = product;
            return {
                ...state,
                warrantyBenefitsMessage: {
                    ...state.warrantyBenefitsMessage,
                    [sku]: {
                        ...state.warrantyBenefitsMessage[sku],
                        productApiBenefitsMessage: transformWarrantyBenefitsMessageIntoHtml(
                            product.warrantyBenefitsMessages,
                        ),
                    },
                },
            };
        }
        case addOnsPageActionTypes.updateParentItemJustAdded:
            return {
                ...state,
                parentItemJustAdded: action.parentItemJustAdded,
            };
        default:
            return state;
    }
};
