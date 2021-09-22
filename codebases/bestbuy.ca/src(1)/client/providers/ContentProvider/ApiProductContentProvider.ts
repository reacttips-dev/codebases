import {HttpRequestType} from "errors";
import {ProductContent} from "models";
import * as url from "url";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiProductContentProvider extends ApiMarketingContentProvider<ProductContent> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, sku: string) {
        super(baseUrl, locale, regionCode, "products", sku);
        // Need to manually lowerCase certain params because CMS API now takes uppercase skus
        const tempUrl = url.parse(`${baseUrl.toLowerCase()}products/${sku}`, true);
        tempUrl.query = {
            lang: locale.toLowerCase(),
            regioncode: regionCode.toLowerCase(),
        };

        this.url = url.format(tempUrl);
    }

    public getContent() {
        return super.getContent({} as ProductContent, HttpRequestType.ProductContentApi);
    }
}

export default ApiProductContentProvider;
