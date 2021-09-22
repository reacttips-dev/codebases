import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiBrandPageContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, brandId: string) {
        super(baseUrl, locale, regionCode, `brands`, brandId);
    }

    public getContent() {
        return super.getContent({} as DynamicContentModel, HttpRequestType.CollectionContentApi);
    }
}

export default ApiBrandPageContentProvider;
