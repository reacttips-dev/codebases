import {HttpRequestType} from "errors";
import {CollectionContent} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiCollectionContentProvider extends ApiMarketingContentProvider<CollectionContent> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, collectionId: string) {
        super(baseUrl, locale, regionCode, "collections", collectionId);
    }

    public getContent() {
        return super.getContent({id: ""} as CollectionContent, HttpRequestType.CollectionContentApi);
    }
}

export default ApiCollectionContentProvider;
