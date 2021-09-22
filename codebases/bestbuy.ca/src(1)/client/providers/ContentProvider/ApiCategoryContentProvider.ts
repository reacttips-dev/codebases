import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiCategoryContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, categoryId: string) {
        super(baseUrl, locale, regionCode, "categories", categoryId);
    }

    public getContent(): Promise<DynamicContentModel> {
        return super.getContent({} as DynamicContentModel, HttpRequestType.CategoryContentApi);
    }
}

export default ApiCategoryContentProvider;
