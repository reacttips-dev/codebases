import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiBrandStoreContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, brandName: string, brandId: string) {
        // TODO: replace the 0 with brandName when the relation of the brands and brandstore pages starts to exist
        super(baseUrl, locale, regionCode, `brands/0/store-pages`, brandId);
    }

    public getContent() {
        return super.getContent({} as DynamicContentModel, HttpRequestType.CollectionContentApi);
    }
}

export default ApiBrandStoreContentProvider;
