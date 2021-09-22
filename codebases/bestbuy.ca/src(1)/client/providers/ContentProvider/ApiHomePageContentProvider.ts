import {HttpRequestType} from "errors";
import {ApiMarketingContentProvider} from "./MarketingContentProvider";
import {HomePageContent} from "models";

export class ApiHomePageContentProvider extends ApiMarketingContentProvider<HomePageContent> {
    constructor(baseUrl: string, locale: Locale, regionCode: string, queryParams?: {[key: string]: string}) {
        super(baseUrl, locale, regionCode, undefined, undefined, queryParams);
    }

    public async getContent(): Promise<HomePageContent> {
        return super.getContent({} as HomePageContent, HttpRequestType.HomePageContentApi, 10000);
    }
}

export default ApiHomePageContentProvider;
