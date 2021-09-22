import { DefaultFetchService } from "services/fetchService";

export interface IDemographicsApiService {
    getDemographicsGenderData: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string;
    }) => Promise<any>;
    getDemographicsAgeData: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string;
    }) => Promise<any>;
    // getDemographicsGraphExcelUrl: (params) => string;
}

export interface IWebAnalysisDemographicsRequestParams {
    includeDemographics: boolean;
    keys: string;
    from: string;
    to: string;
    country: string;
    webSource: string;
    isWindow: boolean;
    timeGranularity: string;
}

export default class DemographicsApiService implements IDemographicsApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDemographicsGenderData(params: any): Promise<any> {
        const apiParams: any = {
            country: params.country,
            from: params.from,
            includeSubDomains: !params.isWWW,
            isWindow: params.isWindow,
            keys: params.key,
            timeGranularity: "Monthly",
            to: params.to,
            webSource: params.webSource,
        };
        return this.fetchService
            .get(`widgetApi/WebDemographics/WebDemographicsGender/PieChart`, apiParams)
            .then();
    }

    public getDemographicsAgeData(params: any): Promise<any> {
        const apiParams: any = {
            country: params.country,
            from: params.from,
            includeSubDomains: !params.isWWW,
            isWindow: params.isWindow,
            keys: params.key,
            timeGranularity: "Monthly",
            to: params.to,
            webSource: params.webSource,
        };
        return this.fetchService
            .get(`widgetApi/WebDemographics/WebDemographicsAge/PieChart`, apiParams)
            .then();
    }
}
