import {useEffect, useState} from "react";
import {routeManager} from "@bbyca/apex-components";
import {Intl, Key} from "@bbyca/apex-components/dist/models";
import {Region, SimpleProduct, SponsoredProductAdDetails} from "models";
import {addPageSourceTrackingToCriteoUrl} from "utils/criteo";
import {callSearchForProductDetails} from "actions/searchActions/sponsoredProducts";

export interface HookProps {
    intl: Intl;
    searchApiUrl: string;
    pageKey: Key;
    regionCode: Region;
    criteoProductAds: SponsoredProductAdDetails[];
}

export const useCriteoSponsoredProductList = (props: HookProps): SimpleProduct[] => {
    const {criteoProductAds, intl, searchApiUrl, pageKey, regionCode} = props;
    const [criteoSponsoredProductList, setCriteoSponsoredProductList] = useState<SimpleProduct[]>([]);

    useEffect(() => {
        if (criteoProductAds) {
            getCriteoSponsoredProductList();
        }
    }, [JSON.stringify(criteoProductAds)]);

    const getCriteoSponsoredProductList = async () => {
        if (criteoProductAds) {
            const productsFromCriteoData = await getSearchProductsFromCriteoData(criteoProductAds);
            if (productsFromCriteoData) {
                setCriteoSponsoredProductList(productsFromCriteoData);
            }
        }
    };

    const getSearchProductsFromCriteoData = async (
        criteoData: SponsoredProductAdDetails[],
    ): Promise<SimpleProduct[] | null> => {
        const skuUrlMap: {[sku: string]: string} = {};
        criteoData.forEach(({ProductSKU, ProductPage}) => {
            skuUrlMap[ProductSKU] = ProductPage;
        });

        const searchResults = await callSearchForProductDetails(
            {
                apiUrl: searchApiUrl,
                locale: intl.locale,
                regionCode,
                path: "",
            },
            criteoData,
        );
        if (!searchResults) {
            return null;
        }

        const searchResultsWithUrls: SimpleProduct[] = [];
        Object.keys(skuUrlMap).forEach((sku) => {
            const product = searchResults.products.find((result) => result.sku === sku);
            if (!product) {
                return;
            }
            const clientPDPUrl = routeManager.getPathByKey(
                intl.language,
                "product",
                product?.seoName || "",
                product?.sku || "",
            );
            searchResultsWithUrls.push({
                ...product,
                productUrl: addPageSourceTrackingToCriteoUrl(clientPDPUrl, skuUrlMap[sku], pageKey),
            } as SimpleProduct);
        });

        return searchResultsWithUrls;
    };

    return criteoSponsoredProductList;
};
