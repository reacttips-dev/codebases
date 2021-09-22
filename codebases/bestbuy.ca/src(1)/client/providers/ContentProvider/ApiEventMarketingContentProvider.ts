import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiEventMarketingProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, marketingId: string) {
        super(baseUrl, locale, regionCode, "marketing-pages", marketingId);
    }

    public getContent() {
        return super.getContent({id: ""} as DynamicContentModel, HttpRequestType.CollectionContentApi);
    }
}

export default ApiEventMarketingProvider;
