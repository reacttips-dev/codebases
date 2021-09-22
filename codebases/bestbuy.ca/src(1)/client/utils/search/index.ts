import {facetSystemNames} from "../../constants";
import {
    Availabilities,
    AvailabilityPickupStatus,
    AvailabilityShippingStatus,
    SimpleProduct,
    SearchResult,
    Facet,
} from "models";

export const getPricePill = (
    lang: Language,
    minPrice: string,
    maxPrice: string,
    pills: [],
    callBack: (min: string, max: string, isClearRange?: boolean, isFromPill?: boolean) => void,
) => {
    let name: string = `$${minPrice || "0"} - ${maxPrice ? "$" + maxPrice : "Any"}`;
    if (lang === "fr") {
        name = `${minPrice || "0"}${maxPrice ? " à " + maxPrice + " $" : " $ ou plus"}`;
    }
    return [
        ...pills,
        {
            name,
            onClose: () => callBack("", "", true, true),
        },
    ];
};

export const isAvailableStockSelected = (facets: Facet[]): boolean => {
    if (!facets) {
        return false;
    }
    const availability = facets.find((facet) => facet.systemName === facetSystemNames.availability);
    return availability ? availability.filters[0].isSelected : false;
};

export const getFilteredProducts = (
    searchResult: SearchResult,
    availabilities: Availabilities,
    rpuToggleFilter?: boolean,
) => {
    if (!!searchResult?.products?.length) {
        let filteredProducts = searchResult.products;
        if (rpuToggleFilter) {
            filteredProducts = getRpuFilteredProducts(filteredProducts, availabilities);
        }

        const hasAvailableStock: boolean = isAvailableStockSelected(searchResult?.facets);
        if (hasAvailableStock) {
            filteredProducts = getAvailableStockProducts(filteredProducts, availabilities);
        }

        return filteredProducts;
    }

    return [];
};

const getRpuFilteredProducts = (products: SimpleProduct[], availabilities: Availabilities) => {
    if (!!products?.length) {
        return products.filter(
            (product) =>
                availabilities[product.sku]?.pickup?.status === AvailabilityPickupStatus.InStock &&
                !product.isMarketplace,
        );
    }
    return [];
};

const getAvailableStockProducts = (products: SimpleProduct[], availabilities: Availabilities) => {
    if (!!products?.length) {
        return products.filter(
            (product) =>
                (availabilities[product.sku] &&
                    [AvailabilityPickupStatus.InStock, AvailabilityPickupStatus.Preorder].indexOf(
                        availabilities[product.sku]?.pickup?.status,
                    ) > -1) ||
                [
                    AvailabilityShippingStatus.InStock,
                    AvailabilityShippingStatus.InStockOnlineOnly,
                    AvailabilityShippingStatus.InStoreOnly,
                    AvailabilityShippingStatus.Preorder,
                    AvailabilityShippingStatus.BackOrder,
                ].indexOf(availabilities[product.sku]?.shipping?.status as AvailabilityShippingStatus) > -1,
        );
    }
    return [];
};
