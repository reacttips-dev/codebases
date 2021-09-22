import { DefaultFetchService } from "services/fetchService";
import * as queryString from "query-string";

export interface ISubdomainsApiService {
    getDomainsSubdomainsTableData: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string;
        orderBy: string;
    }) => Promise<any>;
}

export interface IWebAnalysisSubdomainsRequestParams {
    includeSubDomains: boolean;
    keys: string;
    from: string;
    to: string;
    country: string;
    webSource: string;
    isWindow: boolean;
    timeGranularity: string;
    orderBy: any;
}

export interface IWebAnalysisSubdomainsExcelRequestParams
    extends IWebAnalysisSubdomainsRequestParams {
    fileName: string;
}
export default class SubdomainsApiService implements ISubdomainsApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDomainsSubdomainsTableData(params: any): Promise<any> {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.key,
            from: params.from,
            to: params.to,
            country: params.country, //params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            timeGranularity: "Monthly",
            orderBy: params.orderBy,
            page: 1,
            pageSize: 400,
        };
        return this.fetchService.get(`widgetApi/SubDomains/SubDomains/Table`, apiParams).then();
    }

    public getDomainsSubdomainsTableExcelUrl(params: any): string {
        const queryStringParams = queryString.stringify(params);
        return `widgetApi/SubDomains/SubDomains/Excel?${queryStringParams}`;
    }

    public GetWebsiteImage(site: any): Promise<any> {
        const apiParams: any = {
            type: "icon",
            website: site,
        };
        return this.fetchService.get(`/api/WebsiteOverview/GetImageUrl`, apiParams).then();
    }
}
