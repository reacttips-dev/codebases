import routeManager from "utils/routeManager";

const getManufacturersWarrantyUrl = (locale: Language, sku: string): string => {
    return routeManager.getPathByKey(locale, "manufacturerWarranty", sku);
};

export default getManufacturersWarrantyUrl;
