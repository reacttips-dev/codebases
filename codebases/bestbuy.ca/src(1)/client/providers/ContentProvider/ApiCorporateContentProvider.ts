import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiCorporateContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, ...ids: string[]) {
        super(baseUrl, locale, regionCode, `corporate-pages`, ids[0]);
    }

    public getContent() {
        return super.getContent({} as DynamicContentModel, HttpRequestType.CollectionContentApi);
    }
}

export default ApiCorporateContentProvider;
