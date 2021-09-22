import * as Constants from "./constants";

const serializeToSalesForceObjectEntries = (data: {}): string => {
    return Object.entries(data)
        .filter(([key, value]) => !!value || key.indexOf(Constants.PRODUCT_CATEGORIES) !== 0)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(
                    key.indexOf(Constants.PRODUCT_CATEGORIES) === 0 ? Constants.PRODUCT_CATEGORIES : key,
                )}=${encodeURIComponent(value)}`,
        )
        .join("&");
};

export default serializeToSalesForceObjectEntries;
