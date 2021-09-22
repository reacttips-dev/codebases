import {SimpleProduct, SponsoredProduct} from "models";
import {maxSearchResultSponsoredProducts} from "../../../constants";

export const buildAggregateSponsoredProductsSearchResult = (
    sponsoredProducts: SponsoredProduct[],
    searchResultProducts: SimpleProduct[],
): Array<SimpleProduct | SponsoredProduct> => {
    if (!sponsoredProducts) {
        if (!searchResultProducts || !searchResultProducts.length) {
            return [];
        }
        return searchResultProducts;
    }
    const sponsoredProductsClone = [...sponsoredProducts.slice(0, maxSearchResultSponsoredProducts)];
    const firstSponsoredProducts = sponsoredProductsClone.slice(0, 2);
    const lastSponsoredProducts = sponsoredProductsClone.slice(2, sponsoredProductsClone.length);
    return [...firstSponsoredProducts, ...searchResultProducts, ...lastSponsoredProducts];
};
