import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiSearchContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, searchTerm: string) {
        super(baseUrl, locale, regionCode, "search", searchTerm);
    }

    public getContent(): Promise<DynamicContentModel> {
        return super.getContent({} as DynamicContentModel, HttpRequestType.SearchContentApi);
    }
}

export default ApiSearchContentProvider;
