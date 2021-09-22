import {stringify} from "querystring";
import removeDuplicateSlashInURL from "@bbyca/ecomm-checkout-components/dist/utilities/removeDuplicateSlashInURL";
import {AvailabilityProvider} from "@bbyca/ecomm-checkout-components/dist/services/AvailabilityProvider";
import {OfferProvider} from "@bbyca/ecomm-checkout-components/dist/services/OfferProvider";

import {HttpRequestType} from "errors";
import {BasicProductRelatedProductsResponse, BasicProductRelatedProducts} from "models";
import fetch from "utils/fetch";

import {RelatedProductsProvider} from ".";
export class ApiRelatedProductsProvider implements RelatedProductsProvider {
    constructor(
        public baseURL: string,
        public productUrl: string,
        public availabilityProvider: AvailabilityProvider,
        public offerProvider: OfferProvider,
    ) {
        this.baseURL = baseURL;
        this.productUrl = productUrl;
        this.availabilityProvider = availabilityProvider;
        this.offerProvider = offerProvider;
    }

    public async getRelatedProducts(
        relationshipType: string,
        sku: string,
        language: Language = "en",
        regionCode: string,
        include: string = "all",
    ): Promise<any> {
        let error = null;
        let result: BasicProductRelatedProductsResponse = {items: []};
        const productsPromises: Array<Promise<BasicProductRelatedProducts>> = [];
        try {
            const response = await fetch(
                removeDuplicateSlashInURL(`${this.baseURL}/${sku}/${relationshipType}`),
                HttpRequestType.RelatedProductsApi,
            );
            result = await response.json();
            result?.items?.forEach?.(async ({id}) => {
                const productPromise = fetch(
                    removeDuplicateSlashInURL(
                        `${this.productUrl}/${id}?${stringify({lang: language, currentRegion: regionCode, include})}`,
                    ),
                    HttpRequestType.ProductApi,
                );
                productsPromises.push(productPromise);
            });
        } catch (e) {
            error = e;
        }
        return {error, result, productsPromises};
    }
}
