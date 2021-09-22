export enum AddressInputNames {
    addressLine1 = "addressLine1",
    city = "city",
    countryCode = "countryCode",
    postalCode = "postalCode",
    regionCode = "regionCode",
}

export const hydrateSalesforceFieldMap = (leadDetailsId: string, promoCodeId: string) => {
    return {
        addressLine1: "street",
        city: "city",
        regionCode: "state",
        countryCode: "country",
        postalCode: "zip",
        email: "email",
        phone: "phone",
        company: "company",
        promo_code: promoCodeId,
        employees: "employees",
        industry: "industry",
        recordType: "recordType",
        oid: "oid",
        name: "first_name",
        last_name: "last_name",
        source: "lead_source",
        time: leadDetailsId
    };
};

export const canadaPostFieldsMap = [
    { element: "addressLine1", field: "Line1" },
    { element: "city", field: "City" },
    { element: "postalCode", field: "PostalCode" },
    { element: "regionCode", field: "ProvinceCode" },
    { element: "countryCode", field: "CountryIso2", mode: 8 },
];

const nameField = "name";

export const mapToSalesforceFields = (data: {}, acc: {}, fieldName: string, salesforceFieldMapping: {}) => {
    if (fieldName === "name") {
        acc[salesforceFieldMapping[fieldName]] = data[fieldName].value.split(" ").shift();
    } else if (fieldName === "last_name") {
        acc[salesforceFieldMapping[fieldName]] = data[nameField].value.split(" ").splice(1).join(" ");
    } else {
        acc[salesforceFieldMapping[fieldName]] = data[fieldName].value;
    }
    return acc;
};

export const industries = [
    { id: "Default", value: ""},
    { id: "Agriculture", value: "Agriculture"},
    { id: "AgricultureAndMining", value: "Agriculture and Mining"},
    { id: "Apparel", value: "Apparel"},
    { id: "Banking", value: "Banking"},
    { id: "Biotechnology", value: "Biotechnology"},
    { id: "BusinessServices", value: "Business Services"},
    { id: "Chemicals", value: "Chemicals"},
    { id: "Communications", value: "Communications"},
    { id: "Construction", value: "Construction"},
    { id: "Consulting", value: "Consulting"},
    { id: "ConsumerServices", value: "Consumer Services"},
    { id: "Distributors", value: "Distributors"},
    { id: "Education", value: "Education"},
    { id: "Electronics", value: "Electronics"},
    { id: "Energy", value: "Energy"},
    { id: "EnergyAndUtilities", value: "Energy and Utilities"},
    { id: "Engineering", value: "Engineering"},
    { id: "Entertainment", value: "Entertainment"},
    { id: "Environmental", value: "Environmental"},
    { id: "Finance", value: "Finance"},
    { id: "FoodBeverage", value: "Food &amp; Beverage"},
    { id: "Government", value: "Government"},
    { id: "Healthcare", value: "Healthcare"},
    { id: "Hospitality", value: "Hospitality"},
    { id: "HospitalityAndRecreation", value: "Hospitality and Recreation"},
    { id: "Insurance", value: "Insurance"},
    { id: "Machinery", value: "Machinery"},
    { id: "Manufacturing", value: "Manufacturing"},
    { id: "Media", value: "Media"},
    { id: "MediaAndEntertainment", value: "Media and Entertainment"},
    { id: "NonProfit", value: "Non-profit"},
    { id: "NotForProfit", value: "Not For Profit"},
    { id: "Other", value: "Other"},
    { id: "RealEstate", value: "Real Estate"},
    { id: "Recreation", value: "Recreation"},
    { id: "Reseller", value: "Reseller"},
    { id: "Retail", value: "Retail"},
    { id: "Shipping", value: "Shipping"},
    { id: "Technology", value: "Technology"},
    { id: "Telecommunications", value: "Telecommunications"},
    { id: "Transportation", value: "Transportation"},
    { id: "Utilities", value: "Utilities"}
];
