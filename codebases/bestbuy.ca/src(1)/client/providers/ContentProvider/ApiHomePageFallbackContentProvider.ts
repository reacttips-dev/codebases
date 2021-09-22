import { HttpRequestType } from "errors";
import fetch from "utils/fetch/";
import { ApiMarketingContentProvider } from "./MarketingContentProvider";
import { DynamicContentModel } from "models";

export class ApiHomePageFallbackContentProvider extends ApiMarketingContentProvider<DynamicContentModel> {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    public async getContent() {
        const res = await fetch(this.url, HttpRequestType.HomePageFallbackContentApi);
        const json = await res.json();
        return json;
    }

}

export default ApiHomePageFallbackContentProvider;
