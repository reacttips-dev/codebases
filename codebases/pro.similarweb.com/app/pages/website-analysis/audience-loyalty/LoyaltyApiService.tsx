import { DefaultFetchService } from "services/fetchService";
import * as queryString from "query-string";
import categoryService from "common/services/categoryService";

export interface ILoyaltyApiService {
    getDomainsLoyalty: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string;
        mode?: string;
    }) => Promise<IDomainLoyaltyData>;
    getCategoryLoyalty: (params: {
        country: string;
        from: string;
        to: string;
        isWindow: boolean;
        webSource: string;
        isWWW: string;
        keys: string;
    }) => Promise<ICategoryLoyaltyData>;
}
export interface ILoyaltyDataPoint {
    Percentage: number;
    AmountUsers?: number;
    Confidence?: number;
}
export interface IDomainLoyaltyData {
    [domain: string]: {
        [mode: string]: {
            [bucket: string]: {
                Graph: Array<{ Key: string; Value: ILoyaltyDataPoint }>;
                AvgPercentageUsers: number;
                AvgAmountUsers: number;
            };
        };
        // @ts-ignore
        SiteCategory: string;
    };
}

export interface ICategoryLoyaltyData {
    [key: string]: {
        [bucket: string]: {
            Graph: Array<{ Key: string; Value: ILoyaltyDataPoint }>;
            AvgPercentageUsers: number;
            AvgAmountUsers: number;
        };
    };
}

export interface ICategoryLoyaltyTableDataItem {
    Domain: string;
    BounceRate: number;
    Share: number;
    PagesPerVisit: number;
    AvgVisitDuration: number;
    Visits: number;
    Loyalty: {
        0?: number;
        1?: number;
        2?: number;
        3?: number;
        4?: number;
        "5+"?: number;
    };
}

export interface ICategoryLoyaltyTableData {
    NumberOfSites: number;
    Data: ICategoryLoyaltyTableDataItem[];
    Total?: IDomainLoyaltyData;
}

export default class LoyaltyApiService implements ILoyaltyApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDomainsLoyalty({ apiParams, keys }: any): Promise<IDomainLoyaltyData> {
        const paramsReq: any = {
            includeSubDomains: !apiParams.isWWW,
            keys: keys || apiParams.key,
            from: apiParams.from,
            to: apiParams.to,
            country: apiParams.country,
            webSource: apiParams.webSource,
            isWindow: apiParams.isWindow,
            mode: "category,subcategory",
        };
        return this.fetchService.get(`api/audienceLoyalty/Graph`, paramsReq);
        // return new Promise(resolve => setTimeout(resolve.bind(null, compareLoylatyDataMockRes), 1500));
    }
    public getCategoryLoyalty({
        isWWW,
        from,
        to,
        country,
        webSource,
        isWindow,
        keys: keysArg,
    }): Promise<ICategoryLoyaltyData> {
        const keys =
            typeof keysArg === "string"
                ? keysArg
                : `${categoryService.categoryQueryParamToCategoryObject(keysArg[0])?.forApi};;${
                      categoryService.categoryQueryParamToCategoryObject(keysArg[1])?.forApi
                  }`;
        const apiParams: any = {
            includeSubDomains: !isWWW,
            from,
            to,
            country,
            webSource,
            isWindow,
            keys,
        };
        return this.fetchService.get("api/category/audienceLoyalty/Graph", apiParams);
    }
    public getCategoryLoyaltyTable(
        params: any,
        endpoint = "api/category/audienceLoyalty/Table",
    ): Promise<ICategoryLoyaltyTableData> {
        const category = categoryService.categoryQueryParamToCategoryObject(params.keys[0]);
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            from: params.from,
            to: params.to,
            country: params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            keys: category?.forApi,
            categoryHash: category?.categoryHash,
        };
        return this.fetchService.get(endpoint, apiParams);
    }

    public getDomainsAudienceLoyaltyGraphExcelUrl(params): string {
        const queryStringParams = queryString.stringify(params);
        return `api/audienceLoyalty/Excel?${queryStringParams}`;
    }
}
