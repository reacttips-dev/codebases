import {HttpRequestType} from "errors";
import {DynamicContentModel} from "models";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";

export class ApiServiceContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, serviceId: string) {
        super(baseUrl, locale, regionCode, `services/geek-squad-pages`, serviceId);
    }

    public getContent() {
        return super.getContent({id: ""} as DynamicContentModel, HttpRequestType.CollectionContentApi);
    }
}

export default ApiServiceContentProvider;
