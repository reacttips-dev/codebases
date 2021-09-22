import { DefaultFetchService } from "services/fetchService";
import * as queryString from "query-string";

const AudienceMock = {
    OverlapData: {
        Data: {
            "ynet.co.il": 1260000,
            "haaretz.co.il": 486104,
            "mako.co.il": 120713,
            "mako.co.il,haaretz.co.il": 4000,
            "ynet.co.il,mako.co.il": 8000,
            "ynet.co.il,haaretz.co.il": 170000,
            "haaretz.co.il,mako.co.il,ynet.co.il": 6000,
        },
        Total: {
            MonthlyUniqueVisitors: 1500000,
        },
    },
    LoyaltyData: {
        "ynet.co.il": {
            0: {
                AvgPercentageUsers: 0.7,
                AvgAmountUsers: 3500,
            },
            1: {
                AvgPercentageUsers: 0.6,
                AvgAmountUsers: 3060,
            },
            2: {
                AvgPercentageUsers: 0.8,
                AvgAmountUsers: 3200,
            },
        },
        "haaretz.co.il": {
            0: {
                AvgPercentageUsers: 0.23,
                AvgAmountUsers: 3040,
            },
            1: {
                AvgPercentageUsers: 0.4,
                AvgAmountUsers: 3440,
            },
            2: {
                AvgPercentageUsers: 0.7,
                AvgAmountUsers: 3400,
            },
        },
        "mako.co.il": {
            0: {
                AvgPercentageUsers: 0.34,
                AvgAmountUsers: 3005,
            },
            1: {
                AvgPercentageUsers: 0.54,
                AvgAmountUsers: 3060,
            },
            2: {
                AvgPercentageUsers: 0.7,
                AvgAmountUsers: 3600,
            },
        },
    },
};

const AudienceMock2 = {
    OverlapData: {
        Data: {},
        Total: {},
    },
    LoyaltyData: {},
};

export interface IAudienceOverlapApiService {
    getDomainsAudienceOverlap: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string;
    }) => Promise<any>;
}
export default class AudienceOverlapApiService implements IAudienceOverlapApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDomainsAudienceOverlap(params: any): Promise<any> {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.keys,
            from: params.from,
            to: params.to,
            country: params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            timeGranularity: "Monthly",
        };
        return this.fetchService.get(
            `widgetApi/WebAudienceOverlap/AudienceOverlap/Data`,
            apiParams,
        );
        // return new Promise((resolve) => {
        //     setTimeout( () => {
        //         resolve(AudienceMock2);
        //     } , 100);
        // });
    }

    public getDomainsAudienceOverlapExcelUrl(params: any): string {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.keys,
            from: params.from,
            to: params.to,
            country: params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            imeGranularity: "Monthly",
        };
        const queryStringParams = queryString.stringify(apiParams);
        return `widgetApi/WebAudienceOverlap/AudienceOverlap/Excel?${queryStringParams}`;
    }
}
