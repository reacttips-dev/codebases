import { DefaultFetchService } from "services/fetchService";
import * as queryString from "query-string";

export interface IGeographyApiService {
    getDomainsGeographyTableData: (params: {
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

export interface IWebAnalysisGeoRequestParams {
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

export interface IWebAnalysisGeoExcelRequestParams extends IWebAnalysisGeoRequestParams {
    fileName: string;
}
export default class GeographyApiService implements IGeographyApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDomainsGeographyTableData(params: any): Promise<any> {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.key,
            from: params.from,
            to: params.to,
            country: "999", //params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            timeGranularity: "Monthly",
            orderBy: params.orderBy,
            page: 1,
            pageSize: 200,
        };
        return this.fetchService.get(
            `widgetApi/WebsiteGeographyExtended/GeographyExtended/Table`,
            apiParams,
        );
    }

    public getDomainsGeographyTableExcelUrl(params: any): string {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.keys,
            from: params.from,
            to: params.to,
            country: "999", //params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            timeGranularity: "Monthly",
            orderBy: params.orderBy,
        };
        const queryStringParams = queryString.stringify(params);
        return `widgetApi/WebsiteGeographyExtended/GeographyExtended/Excel?${queryStringParams}`;
    }
}
