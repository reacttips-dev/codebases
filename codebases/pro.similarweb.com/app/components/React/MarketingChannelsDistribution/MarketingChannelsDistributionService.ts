import { EData } from "components/React/MarketingChannelsDistribution/types";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { isIncludeSubDomains } from "UtilitiesAndConstants/UtilityFunctions/common";

export class MarketingChannelsDistributionService {
    static classInstance: MarketingChannelsDistributionService;
    private ENDPOINT = "widgetApi/WebsiteOverviewDesktop/TrafficSourcesOverview/PieChart";
    private DEFAULT_WEB_SOURCE = devicesTypes.DESKTOP;
    private observers = [];
    private data;
    private readonly queryParams: { [key: string]: string };

    constructor(queryParams) {
        if (
            MarketingChannelsDistributionService.classInstance &&
            !this.isQueryParamsChanged(queryParams)
        ) {
            return MarketingChannelsDistributionService.classInstance;
        }
        MarketingChannelsDistributionService.classInstance = this;
        this.queryParams = queryParams;
        this.fetchDataAndNotifyAllObservers();
    }

    private fetchDataAndNotifyAllObservers = async () => {
        await this.fetchData();
        this.notifyAllObservers();
    };

    private fetchData = async () => {
        const { duration, country, key, isWWW } = this.queryParams;
        const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
        const queryParams = {
            country,
            webSource: this.DEFAULT_WEB_SOURCE,
            keys: key,
            from,
            to,
            isWindow,
            includeSubDomains: isIncludeSubDomains(isWWW),
        };
        try {
            this.data = await DefaultFetchService.getInstance().get(this.ENDPOINT, queryParams);
        } catch (e) {
            this.data = null;
        }
    };

    private notifyAllObservers = () => {
        this.observers.map(this.invokeObserverResolve);
        this.removeAllObservers();
    };

    private invokeObserverResolve = (observerResolve) => {
        observerResolve(this.data);
    };

    private removeAllObservers = () => {
        this.observers = [];
    };

    private isQueryParamsChanged = (queryParams) => {
        const { duration, country, key, isWWW } = queryParams;
        const { queryParams: thisQueryParams } = MarketingChannelsDistributionService.classInstance;
        const {
            duration: thisDuration,
            country: thisCountry,
            key: thisKey,
            isWWW: thisIsWWW,
        } = thisQueryParams;
        return (
            duration !== thisDuration ||
            thisCountry !== country ||
            key !== thisKey ||
            isWWW !== thisIsWWW
        );
    };

    public getData = async () =>
        new Promise<EData>((resolve) =>
            this.data ? resolve(this.data) : this.observers.push(resolve),
        );
}
