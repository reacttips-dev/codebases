import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { DefaultFetchService } from "../fetchService";
import {
    buildEngagementTableData,
    IEngagementTableData,
    IEngagementVisitsGraphRawData,
    IEngagementVisitsTableData,
} from "./utils";
import * as _ from "lodash";
import { string } from "prop-types";

export default class ArenaApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getChannelsOverview(params: {
        isWindow: string;
        from: string;
        to: string;
        country: number;
        includeSubDomains: string;
        keys: string[];
        timeGranularity: string;
        webSource: string;
    }): Promise<any> {
        const isMobileWeb = params.webSource === "MobileWeb";
        const method = isMobileWeb ? `TrafficSourcesOverview` : `TrafficSourcesOverviewBounce`;
        return this.fetchService.get(`/widgetApi/MarketingMix/${method}/PieChart`, params);
    }

    public getChannelsOverviewWithBenchmark(params: {
        isWindow: string;
        from: string;
        to: string;
        country: number;
        includeSubDomains: string;
        keys: string[];
        timeGranularity: string;
    }): Promise<any> {
        return this.fetchService.get(
            "api/WidgetKpis/TrafficSourcesOverviewAverage/GetPieChartData",
            {
                ...params,
                webSource: "Desktop",
            },
        );
    }

    public getEngagementVisitsGraph(params: {
        country: number;
        webSource: string;
        keys: string[];
        from: string;
        to: string;
        timeGranularity: string;
        includeSubDomains: string;
        isWindow: boolean;
        ShouldGetVerifiedData?: boolean;
    }): Promise<IEngagementVisitsGraphRawData> {
        const {
            country,
            webSource,
            keys,
            from,
            to,
            timeGranularity,
            includeSubDomains,
            isWindow,
            ShouldGetVerifiedData,
        } = params;
        return this.fetchService.get(
            "/widgetApi/TrafficAndEngagement/EngagementVisitsBounce/Graph",
            {
                country,
                webSource,
                keys,
                from,
                to,
                timeGranularity,
                includeSubDomains,
                isWindow,
                ShouldGetVerifiedData,
            },
        );
    }

    public getEngagementVisitsTable(params: {
        country: number;
        webSource: string;
        keys: string[];
        from: string;
        to: string;
        includeSubDomains: string;
        isWindow: boolean;
        ShouldGetVerifiedData?: boolean;
    }): Promise<IEngagementVisitsTableData> {
        const {
            country,
            webSource,
            keys,
            from,
            to,
            includeSubDomains,
            isWindow,
            ShouldGetVerifiedData,
        } = params;
        return this.fetchService.get(
            "/widgetApi/TrafficAndEngagement/EngagementVisitsBounce/Table",
            {
                country,
                webSource,
                keys,
                from,
                to,
                includeSubDomains,
                isWindow,
                ShouldGetVerifiedData,
            },
        );
    }

    public async getEngagementOverview(
        params: {
            country: number;
            webSource: string;
            keys: string[];
            from: string;
            to: string;
            isWindow: boolean;
            shouldGetVerifiedData?: boolean;
        },
        domains: string[],
        ShouldGetVerifiedData?: boolean,
    ): Promise<IEngagementTableData> {
        const engagementUrl = "/widgetApi/WebsiteOverview/EngagementOverview/Table";
        const deviceSplitUrl = "/widgetApi/WebsiteOverview/EngagementDesktopVsMobileVisits/Table";
        const dataSources = [
            this.fetchService.get(deviceSplitUrl, { ...params, webSource: devicesTypes.TOTAL }),
            this.fetchService.get(engagementUrl, { ...params, webSource: devicesTypes.MOBILE }),
            this.fetchService.get(engagementUrl, { ...params, webSource: devicesTypes.DESKTOP }),
        ];

        try {
            const headers = await this.getDomainsHeader({ domains });
            const [shareVisits, mobileWeb, desktop] = await Promise.all(dataSources);

            const isFullData =
                _.get(mobileWeb, "Data.length", 0) > 0 &&
                _.get(desktop, "Data.length", 0) > 0 &&
                _.get(shareVisits, "Data.length", 0) > 0;

            if (!isFullData) {
                return {};
            }

            return buildEngagementTableData(
                mobileWeb.Data,
                desktop.Data,
                shareVisits.Data,
                domains,
                headers,
                params.shouldGetVerifiedData,
            );
        } catch (error) {
            return {};
        }
    }

    public async getDomainsHeader(params: { domains: string[] } = { domains: [] }): Promise<any> {
        const endpoint = `api/WebsiteOverview/getheader?includeCrossData=true&keys=${params.domains.join(
            ",",
        )}&mainDomainOnly=false`;
        return this.fetchService.get(endpoint);
    }
}
