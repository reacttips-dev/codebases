import * as _ from "lodash";
import { ISegmentGroupData } from "pages/conversion/ConversionSegmentsUtils";
import { DefaultFetchService, NoCacheHeaders } from "../fetchService";

export const CONVERSION_OSS_API = "api/conversion/segments/segment/oss/Table";
export interface IOSSData {
    Kw: string;
    SwScore: number;
    Upv: number;
    UpvGrowth: number;
    UpvPotential: number;
    Cvr: number;
    CvrCompare?: number;
    CvrGrowth: number;
    CvrDelta?: number;
    Cv: number;
    CvCompare?: number;
    CvGrowth: number;
    CvDelta?: number;
    ConfidenceLevel: number;
    UpvCompare?: number;
    SwScoreCompare?: number;
    CompareConfidenceLevel?: number;
}

// eslint:disable-next-line:interface-name
export interface SegementOSSTableData {
    Data: IOSSData[];
    Filters: {
        WordCount: [
            {
                Value: number;
                ResultCount: number;
            },
        ];
    };
    Header: {
        TotalCount: number;
    };
    TotalCount: number;
}

export default class ConversionApiService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getWebConversionMeta(): Promise<any> {
        return this.fetchService.get(`api/webconversion/metadata`);
    }

    public getOssExcelUrl(params: {
        sid: string;
        country: number;
        to: string;
        from: string;
        isWindow: boolean;
        compareFrom: any;
        compareTo: any;
        includeTerms?: string;
        excludeTerms?: string;
        wordCount?: number;
    }) {
        const qs = Object.keys(params)
            .filter(
                (key) => params[key] !== undefined && params[key] !== null && params[key] !== "",
            )
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join("&");

        return `/api/conversion/segments/segment/oss/Excel?${qs}`;
    }

    public getCategoryConversionExcel(params: {
        gid: string;
        country: number;
        from: string;
        to: string;
        webSource: string;
    }) {
        const urlParams = _.toPairs(params)
            .map(([key, value]) => {
                if (key && value) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
                }
            })
            .join("&");
        return `api/conversion/segments/group/Excel?${urlParams}`;
    }

    public getCategoryConversionTable(params: {
        gid: string;
        country: number;
        from: string;
        to: string;
        webSource: string;
    }): Promise<any> {
        return this.fetchService.get(`api/conversion/segments/group/Table`, params, {
            headers: NoCacheHeaders,
        });
    }

    public getCategoryConversionGraph(params: {
        gid: string;
        country: number;
        from: string;
        to: string;
        webSource: string;
    }): Promise<any> {
        return this.fetchService.get(`/api/conversion/segments/group/Graph`, params, {
            headers: NoCacheHeaders,
        });
    }

    public getCategoryConversionScatterChart(params: {
        gid: string;
        country: number;
        from: string;
        to: string;
        webSource: string;
    }): Promise<any> {
        return this.fetchService.get(`api/conversion/segments/group/ScatterChart`, params, {
            headers: NoCacheHeaders,
        });
    }

    public getWebsiteConversionGraph(params: {
        sid: string;
        country: number;
        webSource: string;
        from: string;
        to: string;
        compareFrom: string;
        compareTo: string;
    }): Promise<any> {
        return this.fetchService.get(`api/conversion/segments/segment/Graph`, params, {
            headers: NoCacheHeaders,
        });
    }

    public getWebsiteConversionScatterChart(params: {
        sid: string;
        country: number;
        webSource: string;
        from: string;
        to: string;
        compareFrom: string;
        compareTo: string;
    }): Promise<any> {
        return this.fetchService.get(`/api/conversion/segments/segment/ScatterChart`, params, {
            headers: NoCacheHeaders,
        });
    }

    public getTopConversionTable(params: {
        country: number;
        webSource: string;
        from: string;
        to: string;
        excludedIndustry: string;
    }): Promise<any> {
        return this.fetchService.get(
            `api/conversion/segments/leaderboards/topConversion/Table`,
            params,
            {
                headers: NoCacheHeaders,
            },
        );
    }

    public getTopGrowthYOYConversionTable(params: {
        country: number;
        webSource: string;
        from: string;
        to: string;
        excludedIndustry: string;
    }): Promise<any> {
        return this.fetchService.get(
            `api/conversion/segments/leaderboards/growthYoY/Table`,
            params,
        );
    }

    public getTopSticknessConversionTable(params: {
        country: number;
        webSource: string;
        from: string;
        to: string;
        excludedIndustry: string;
    }): Promise<any> {
        return this.fetchService.get(
            `api/conversion/segments/leaderboards/topStickiness/Table`,
            params,
        );
    }

    public getCustomGroupsData(params: { from: string; to: string; isWindow }): Promise<any> {
        return this.fetchService.get("api/conversion/segments/UserGroups", params, {
            headers: NoCacheHeaders,
        });
    }

    public createSegmentGroup(name: string, segmentIds: string[]): Promise<ISegmentGroupData> {
        return this.fetchService.post("/api/userdata/segments/group", {
            Name: name,
            Segments: segmentIds,
        });
    }

    public updateSegmentGroup(
        groupId: string,
        name: string,
        segmentIds: string[],
    ): Promise<ISegmentGroupData> {
        return this.fetchService.put("/api/userdata/segments/group", {
            Id: groupId,
            Name: name,
            Segments: segmentIds,
        });
    }

    public renameSegmentCustomGroup(params: {
        gid: string;
        name: string;
    }): Promise<ISegmentGroupData> {
        return this.fetchService.put(`/api/userdata/segments/group`, {
            Id: params.gid,
            Name: params.name,
        });
    }

    public deleteSegmentCustomGroup(params: { gid: string }): Promise<any> {
        return this.fetchService.delete(`api/userdata/segments/group/${params.gid}`);
    }
}
