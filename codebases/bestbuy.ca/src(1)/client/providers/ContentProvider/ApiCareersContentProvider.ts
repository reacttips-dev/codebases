import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiCareersContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, id: string) {
        super(baseUrl, locale, regionCode, "careers", id);
    }

    public getContent() {
        return super.getContent({} as DynamicContentModel, HttpRequestType.CategoryContentApi);
    }
}

export default ApiCareersContentProvider;
