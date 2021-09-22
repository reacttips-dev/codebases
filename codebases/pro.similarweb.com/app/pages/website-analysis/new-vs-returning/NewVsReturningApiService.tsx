import { DefaultFetchService } from "services/fetchService";
import _ from "lodash";
import * as queryString from "query-string";

export interface INewVsReturningApiService {
    getDomainsNewVsReturning: (params: {
        country: string;
        from: string;
        to: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        timeGranularity: string;
        webSource: string;
        keys: string[];
    }) => Promise<IDomainNewAndReturningData>;
    getDomainsNewVsReturningGraphExcelUrl: (params) => string;
}
export interface INewAndReturningUsersDataPoint {
    NewUsers: number;
    ReturningUsers: number;
    Confidence?: number;
}
export interface IDomainNewAndReturningData {
    [domain: string]: {
        Graph: { [Key: string]: INewAndReturningUsersDataPoint };
        Total: INewAndReturningUsersDataPoint;
    };
}

export default class NewVsReturningApiService implements INewVsReturningApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getDomainsNewVsReturningGraphExcelUrl(params): string {
        const queryStringParams = queryString.stringify(params);
        return `/widgetApi/WebNewVsReturning/NewVsReturning/Excel?${queryStringParams}`;
    }

    public getDomainsNewVsReturning(params: any): Promise<IDomainNewAndReturningData> {
        const apiParams: any = {
            includeSubDomains: !params.isWWW,
            keys: params.key,
            from: params.from,
            to: params.to,
            country: params.country,
            webSource: params.webSource,
            isWindow: params.isWindow,
            timeGranularity: "Monthly",
        };
        return this.fetchService.get(`/widgetApi/WebNewVsReturning/NewVsReturning/Data`, apiParams);
        // return new Promise(resolve => setTimeout(resolve.bind(null, getNewVsReturnDataMockRes(params)), 1500));
    }
}

const getNewVsReturnDataMockRes = (params): IDomainNewAndReturningData => {
    const competitors = params.key.split(",");
    let response = {};
    _.forEach(competitors, (competitor) => {
        response = {
            ...response,
            [competitor]: {
                Graph: {
                    "2020-06-01": {
                        NewUsers: Math.random() * 100000,
                        Confidence: 0.083,
                        ReturningUsers: Math.random() * 100000,
                    },
                    "2020-07-01": {
                        NewUsers: Math.random() * 100000,
                        Confidence: 0.083,
                        ReturningUsers: Math.random() * 100000,
                    },
                    "2020-08-01": {
                        NewUsers: Math.random() * 100000,
                        Confidence: 0.083,
                        ReturningUsers: Math.random() * 100000,
                    },
                    "2020-09-01": {
                        NewUsers: Math.random() * 100000,
                        Confidence: 0.083,
                        ReturningUsers: Math.random() * 100000,
                    },
                    "2020-10-01": {
                        NewUsers: Math.random() * 100000,
                        Confidence: 0.083,
                        ReturningUsers: Math.random() * 100000,
                    },
                },
                Total: {
                    NewUsers: Math.random() * 1000000,
                    Confidence: 0.0403002,
                    ReturningUsers: Math.random() * 1000000,
                },
            },
        };
    });
    return response;
};
