import {useState, useEffect} from "react";
import {DetailedProduct, SponsoredProductAdDetails, SponsoredProductPageId, SponsoredProductResponseKey} from "models";
import {fetchSponsoredProductAds} from "actions/searchActions/sponsoredProducts";
import {Key} from "@bbyca/apex-components";

interface CriteoApiPageMap {
    [page: string]: {
        apiResponseKey: SponsoredProductResponseKey;
        pageId: SponsoredProductPageId;
        additionalProps: {
            item?: string;
        };
    };
}

export interface UseCriteoProductAdsProps {
    pageKey: Key;
    criteoAccountId: string;
    criteoUrl: string;
    environment: string;
    product?: DetailedProduct;
}

export const useCriteoProductAds = (props: UseCriteoProductAdsProps): SponsoredProductAdDetails[] => {
    const [criteoProductAds, setCriteoProductAds] = useState<SponsoredProductAdDetails[]>([]);

    const pageToCriteoApiInfoMap: CriteoApiPageMap = {
        homepage: {
            apiResponseKey: SponsoredProductResponseKey.homepage,
            pageId: SponsoredProductPageId.homepage,
            additionalProps: {},
        },
        product: {
            apiResponseKey: SponsoredProductResponseKey.pdp,
            pageId: SponsoredProductPageId.pdp,
            additionalProps: {
                item: props.product?.sku || "",
            },
        },
    };

    useEffect(() => {
        // the homepage carousel doesn't require product info to be supplied
        if (props.pageKey === "product" && !props?.product?.sku) {
            return;
        }

        const fetchCriteoAds = async (): Promise<void> => {
            const pageInfo = pageToCriteoApiInfoMap[props.pageKey];
            if (!pageInfo) {
                return;
            }

            const productAds = await fetchSponsoredProductAds(
                {
                    url: props.criteoUrl,
                    accountId: props.criteoAccountId,
                    environment: props.environment,
                    pageId: pageInfo.pageId,
                    ...pageInfo.additionalProps,
                },
                pageInfo.apiResponseKey,
            );

            setCriteoProductAds(productAds);
        };

        fetchCriteoAds();
    }, [props.pageKey, props.product && props.product.sku]);

    return criteoProductAds;
};
