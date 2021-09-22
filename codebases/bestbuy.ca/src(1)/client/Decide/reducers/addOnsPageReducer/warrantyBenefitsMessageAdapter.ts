import {get} from "lodash-es";

import {CmsWarrantyType, WarrantyType, WarrantyBenefitsMessage, BenefitsMessage} from "models";
import {Contexts} from "models/ProductContent";

import {transformToUnorderedList} from "../../pages/AddonsPage/utils/transformToMarkup";

export const flattenCmsWarrantyMessages = (
    contexts: Contexts,
    activeWarrantyType: WarrantyType,
): BenefitsMessage | null => {
    const contextKey = activeWarrantyType === WarrantyType.PSP ? CmsWarrantyType.PSP : CmsWarrantyType.PRP;

    if (!activeWarrantyType) {
        return null;
    }

    if (contexts && contexts[contextKey]) {
        return {
            title: get(contexts[contextKey], "items[0].title"),
            body: get(contexts[contextKey], "items[0].body"),
            warrantyType: activeWarrantyType,
        };
    }

    return {
        body: "",
        warrantyType: activeWarrantyType,
    };
};

export const transformWarrantyBenefitsMessageIntoHtml = (benefitsMessages: WarrantyBenefitsMessage[]) => {
    if (!benefitsMessages) {
        return;
    }

    const msgs = benefitsMessages.map((benefitsMessage) => {
        return {
            title: benefitsMessage.title,
            body: transformToUnorderedList(benefitsMessage.benefits.map((benefit) => benefit.description)),
            warrantyType: benefitsMessage.warrantyType,
        };
    });

    return msgs[0];
};
