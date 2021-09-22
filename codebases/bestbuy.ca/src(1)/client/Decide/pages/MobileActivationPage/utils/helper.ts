import {SelectableCardOptions} from "@bbyca/bbyca-components";

import {CellPhoneCarrierID, CellPhoneCarrierName} from "models";

export const hydrateSalesforceFieldMap = (storeId: string, inquiryTypeId: string) => {
    return {
        firstName: "first_name",
        lastName: "last_name",
        details: "description",
        storeLocation: storeId,
        inquiryType: inquiryTypeId,
        email: "email",
        source: "lead_source",
        phone: "phone",
        recordType: "recordType",
        oid: "oid",
        website: "url",
        language: "00Nf400000KIAcg",
    };
};

export const mapToSalesforceFields = (data: {}, acc: {}, fieldName: string, salesforceFieldMapping: {}) => {
    acc[salesforceFieldMapping[fieldName]] = data[fieldName].value;
    return acc;
};

export const provinces = ["BC", "AB", "ON", "SK", "NV", "NT", "QC", "NS", "PE", "MB", "NB", "NL", "YT"];

export const formatPhoneNumber = (phone: string) => {
    const match = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(" + match[1] + ") " + match[2] + " " + match[3];
    }
    return null;
};

export const prepareSelectableCardsContent = (
    card: JSX.Element,
    id: string,
    isSelectable: boolean = true,
): SelectableCardOptions => ({
    content: card,
    id,
    isSelectable,
});

export const getCarrierID = (carrierID: CellPhoneCarrierID | "") => {
    if (!carrierID || !Object.values(CellPhoneCarrierID).includes(carrierID)) {
        return "";
    }
    return carrierID;
};

export const getCarrierDisplayName = (carrierID: CellPhoneCarrierID | "") => {
    if (!getCarrierID(carrierID)) {
        return "";
    }
    const carrierName = Object.keys(CellPhoneCarrierID).find(
        (key) => CellPhoneCarrierID[key as keyof typeof CellPhoneCarrierID] === carrierID,
    );
    return CellPhoneCarrierName[carrierName as keyof typeof CellPhoneCarrierName];
};
