import * as _ from "lodash";
import {
    IPopularSegments,
    IWordPredictions,
} from "../../../.pro-features/components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { IDomainWhitelisted } from "../../pages/segments/wizard/SegmentFirstStep/SegmentCreationFirstStep";
import { DefaultFetchService } from "../fetchService";
import { ISite } from "components/Workspace/Wizard/src/types";
import { ENABLE_FIREBOLT } from "services/segments/SegmentsUtils";
import {
    ISegmentsMMXBarChartData,
    ISegmentsMMXGraphData,
} from "pages/segments/mmx/SegmentsSingleMarketingChannelsContainer";
import * as queryString from "query-string";
import { ISegmentsGeographyData } from "pages/segments/geography/SegmentsGeographyContainer";
import { PreferencesService } from "services/preferences/preferencesService";
const DEFAULT_WEB_SOURCE = "Desktop";
const DEFAULT_PAGE_SIZE_WORD_PREDICTIONS = 100000;
const DEFAULT_PAGE_SIZE = 30000;

export const SEGMENT_KEY_SEPARATOR = "#";
export enum SEGMENT_TYPES {
    SEGMENT = "SEGMENT",
    WEBSITE = "WEBSITE",
}

export interface IWordPredictionsParams {
    from: Date | string;
    to: Date | string;
    includeSubDomains: boolean;
    isWindow: boolean;
    keys: string;
    orderBy: string;
    timeGranularity: string;
}

export interface ICustomSegmentsGroupAnalysisParams {
    segmentGroupId: string;
    country: number;
    from: Date | string;
    to: Date | string;
    webSource?: "Desktop";
    timeGranularity?: "Monthly";
    includeSubDomains?: boolean;
    isWindow?: boolean;
    keys?: string;
    useAdvanced?: boolean;
}

export interface IWordPredictionRuleItem {
    words: string[];
    type: number;
}

export interface ICustomSegment {
    id?: string;
    domain: string;
    segmentType: number;
    segmentName: string;
    rules: IWordPredictionRuleItem[];
    creationDate?: string;
    creationType?: string;
    favicon?: string;
    userId?: string;
    lastUpdated?: string;
    isWhiteListed?: boolean;
}

export interface ICustomSegmentAccount extends ICustomSegment {
    userId: string;
    userName?: string;
    isLocked?: boolean;
}

export interface ICustomSegmentGroupWebsite {
    id?: string;
    type?: string;
    domain: string;
    favicon: string;
}

export interface ICustomSegmentsGroup {
    id?: string;
    name: string;
    segments: string[];
    websites?: ICustomSegmentGroupWebsite[];
    isReadOnly?: boolean;
    creationTime?: string;
    lastUpdatedTime?: string;
    members?: string[];
}

export interface ICustomSegmentsGroupPayload {
    id?: string;
    name?: string;
    segments?: string[];
    websites?: string[];
}

export const EMPTY_CUSTOM_SEGMENTS = { Segments: [], AccountSegments: [], SegmentGroups: [] };

export interface ICustomSegmentsMetaData {
    Segments: ICustomSegment[];
    SegmentGroups: ICustomSegmentsGroup[];
    AccountSegments: ICustomSegmentAccount[];
}

export interface IApiParams {
    segmentGroupId: string;
    country: number;
    from: string;
    to: string;
    webSource: string;
    timeGranularity: string;
    fileName: string;
    isWindow: boolean;
    includeSubDomains: boolean;
}

export interface IBaseSingleRequestParams {
    country: string;
    from: string;
    includeSubDomains: boolean;
    isWindow: boolean;
    segmentsIds: string[];
    timeGranularity: string;
    to: string;
    webSource: string;
    keys: string;
    compareFrom?: string;
    compareTo?: string;
    lastUpdated: string;
}
export interface ISegmentGeoRequestParams {
    from: string;
    to: string;
    timeGranularity: string;
    includeSubDomains: boolean;
    isWindow: boolean;
    sid: string;
    webSource: string;
    lastUpdated: string;
}

export interface ISegmentGeoExcelRequestParams extends ISegmentGeoRequestParams {
    fileName: string;
}

export interface ISegmentsApiService {
    isDomainWhiteListedForSegmentation: (params: {
        keys: string[];
    }) => Promise<IDomainWhitelisted[]>;
    getUserCustomSegmentsAndSegmentGroups: () => Promise<ICustomSegmentsMetaData>;
    getCustomSegmentEngagementData: (params: IBaseSingleRequestParams) => Promise<any[]>;
    getCustomSegmentMarketingMixData: (
        params: IBaseSingleRequestParams,
    ) => Promise<ISegmentsMMXBarChartData>;
    createCustomSegment: (customSegment: ICustomSegment) => Promise<any>;
    updateCustomSegment: (customSegment: ICustomSegment) => Promise<any>;
    deleteCustomSegment: (segmentId: string) => Promise<any>;
    createCustomSegmentsGroup: (customSegmentGroup: ICustomSegmentsGroupPayload) => Promise<any>;
    updateCustomSegmentsGroup: (customSegmentGroup: ICustomSegmentsGroupPayload) => Promise<any>;
    deleteCustomSegmentsGroup: (customSegmentGroup: ICustomSegmentsGroupPayload) => Promise<any>;
    updatePrefUseAdvanced: (useAdvanced: boolean) => Promise<any>;
    getPrefUseAdvanced: () => boolean;
}

const transformSegmentGroup = (group: ICustomSegmentsGroup) => {
    const websites = (group.websites ?? []).map((website) => ({
        ...website,
        id: SEGMENT_TYPES.WEBSITE + SEGMENT_KEY_SEPARATOR + website.domain,
        type: SEGMENT_TYPES.WEBSITE,
    }));
    return {
        ...group,
        websites,
        members: [...group.segments, ...websites.map((segWebsite) => segWebsite.id)],
    };
};

const SEGMENTS_USE_ADVANCED_PREF_KEY = "segmentsUseAdvanced";

export default class SegmentsApiService implements ISegmentsApiService {
    private static _instance;
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public static getInstance(): SegmentsApiService {
        if (!SegmentsApiService._instance) {
            SegmentsApiService._instance = new SegmentsApiService();
        }
        return SegmentsApiService._instance;
    }

    public isDomainWhiteListedForSegmentation(params: {
        keys: string[];
    }): Promise<IDomainWhitelisted[]> {
        return this.fetchService.get("api/websiteoverview/IsDomainWhitelisted", params);
    }
    public getUserCustomSegmentsAndSegmentGroups(): Promise<ICustomSegmentsMetaData> {
        return this.fetchService
            .get("/api/userdata/segments/customsegments/metadata")
            .then((response) => ({
                ...response,
                SegmentGroups: response.SegmentGroups.map(transformSegmentGroup),
            }));
    }
    public getCustomSegmentMetaData(params: { sid: string }): Promise<ICustomSegment> {
        return this.fetchService.get(`/api/userdata/segments/customsegments/${params.sid}`);
    }
    public getCustomSegmentMarketingMixGraphExcelUrl(params: IBaseSingleRequestParams): string {
        const queryStringParams = queryString.stringify(
            this.enhanceParamsWithUseAdvanced({ ...params, mode: undefined }),
        );
        return `/widgetApi/SegmentsMarketingMix/SegmentTrafficSources/Excel?${queryStringParams}`;
    }

    public getCustomSegmentEngagementData(params: {
        country: string;
        from: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        segmentsIds: string[];
        timeGranularity: string;
        to: string;
        webSource: string;
        keys: string;
        compareFrom?: string;
        compareTo?: string;
        lastUpdated: string;
        latest?: string;
    }) {
        return this.fetchService.get(
            "widgetApi/TrafficAndEngagement/SegmentEngagement/Data",
            this.enhanceParamsWithUseAdvanced(params),
        );
    }

    public getUniqueUsersData(params: {
        country: string;
        from: string;
        includeSubDomains: boolean;
        isWindow: boolean;
        segmentsIds: string[];
        timeGranularity: string;
        to: string;
        webSource: string;
        keys: string;
        compareFrom?: string;
        compareTo?: string;
        lastUpdated: string;
    }) {
        return this.fetchService.get(
            "widgetApi/SegmentUniqueUsers/SegmentsUniqueUsers/Data",
            this.enhanceParamsWithUseAdvanced(params),
        );
    }

    public getWordPredictions(
        params: IWordPredictionsParams,
        rules: IWordPredictionRuleItem[],
    ): Promise<IWordPredictions> {
        const queryString = this.prepareParams(params, DEFAULT_PAGE_SIZE_WORD_PREDICTIONS);
        return this.fetchService.post(
            `widgetApi/PopularSegments/PopularSegmentWords/PopularWords?${queryString}`,
            { rules },
        );
    }

    public hasExistingUrlsCompundStringNoRobots(
        params: IWordPredictionsParams,
        rules: IWordPredictionRuleItem[],
    ): Promise<any> {
        const queryString = this.prepareParams(params);
        return this.fetchService.post(`widgetApi/PopularSegments/CustomMatch?${queryString}`, {
            rules,
        });
    }

    public getPopularPages(
        params: IWordPredictionsParams,
        rules: IWordPredictionRuleItem[],
    ): Promise<IPopularSegments> {
        const queryString = this.prepareParams(params);
        return this.fetchService.post(
            `widgetApi/PopularSegments/PopularSegmentPages/PopularPages?${queryString}`,
            { rules },
        );
    }

    public getPopularPagesDiff(
        oldRules: IWordPredictionRuleItem[],
        newRules: IWordPredictionRuleItem[],
        remove: boolean,
        params: IWordPredictionsParams,
    ): Promise<IPopularSegments> {
        const queryString = this.prepareParams(params);
        return this.fetchService.post(
            `/widgetApi/PopularSegments/PopularSegmentPages/PopularPagesDiff?${queryString}`,
            {
                remove,
                oldRules,
                newRules,
            },
        );
    }

    public createCustomSegment(customSegment: ICustomSegment): Promise<any> {
        return this.fetchService.post("/api/userdata/segments/customsegments", {
            ...customSegment,
        });
    }

    public updateCustomSegment(customSegment: ICustomSegment): Promise<any> {
        return this.fetchService.put("/api/userdata/segments/customsegments", { ...customSegment });
    }
    public deleteCustomSegment(segmentId: string): Promise<any> {
        return this.fetchService.delete(`/api/userdata/segments/customsegments/${segmentId}`);
    }

    // Segments Group CRUD
    public createCustomSegmentsGroup(
        customSegmentGroup: ICustomSegmentsGroupPayload,
    ): Promise<any> {
        return this.fetchService
            .post(`/api/userdata/segments/customsegments/group`, {
                ...customSegmentGroup,
            })
            .then(transformSegmentGroup);
    }
    public updateCustomSegmentsGroup(
        customSegmentGroup: ICustomSegmentsGroupPayload,
    ): Promise<any> {
        return this.fetchService
            .put("/api/userdata/segments/customsegments/group", { ...customSegmentGroup })
            .then(transformSegmentGroup);
    }
    public deleteCustomSegmentsGroup(
        customSegmentGroup: ICustomSegmentsGroupPayload,
    ): Promise<any> {
        const { id } = customSegmentGroup;
        return this.fetchService.delete(`/api/userdata/segments/customsegments/group/${id}`);
    }
    // End Segments Group CRUD

    // Segments Group Analysis
    public getCustomSegmentsGroupAnalysis(
        params: ICustomSegmentsGroupAnalysisParams,
    ): Promise<any> {
        // Do not remove "null" value for keys - server must get this param inOrder to handle request
        return this.fetchService.get(
            "/widgetApi/TrafficAndEngagement/SegmentEngagement/Data",
            this.enhanceParamsWithUseAdvanced({
                ...params,
                keys: "null",
            }),
            {
                headers: {
                    "Cache-Control": "no-cache", // force no cache
                },
            },
        );
    }

    // Segments Group Analysis Download Excel
    public getCategoryConversionExcel(params: IApiParams) {
        const urlParams = _.toPairs(this.enhanceParamsWithUseAdvanced(params))
            .map(([key, value]) => {
                if (key && value) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
                }
            })
            .join("&");
        return `/widgetApi/TrafficAndEngagement/SegmentEngagement/Excel?${urlParams}&keys=null`;
    }

    // websites suggestions
    public fetchWebsitesSuggestions(
        term: string,
        options: { size?: number; webSource?: string } = {},
    ): Promise<ISite[]> {
        if (!term) {
            return Promise.resolve([]);
        }

        const { size, webSource } = options;
        const queryParamsObj = { term, size, webSource };
        const queryString = Object.keys(queryParamsObj)
            .filter((qKey) => qKey in queryParamsObj)
            .map(
                (qKey) => `${encodeURIComponent(qKey)}=${encodeURIComponent(queryParamsObj[qKey])}`,
            )
            .join("&");
        return this.fetchService.get(`/autocomplete/websites?${queryString}`);
    }

    public getSegmentGeographyData(
        params: ISegmentGeoRequestParams,
    ): Promise<ISegmentsGeographyData> {
        return this.fetchService.get("api/segmentsGeography/Data", params);
    }
    public getSegmentGeographyExcelUrl(params: ISegmentGeoExcelRequestParams): string {
        const queryStringParams = queryString.stringify(params);
        return `api/segmentsGeography/Excel?${queryStringParams}`;
    }

    /** Segments Analysis Marketing Mix **/

    public getCustomSegmentMarketingMixData(
        params: IBaseSingleRequestParams,
    ): Promise<ISegmentsMMXBarChartData> {
        return this.fetchService.get(
            "/widgetApi/SegmentsMarketingMix/SegmentTrafficSources/PieChart",
            {
                ...params,
                mode: undefined,
            },
        );
    }

    public getCustomSegmentMarketingMixGraphData(
        params: IBaseSingleRequestParams,
    ): Promise<ISegmentsMMXGraphData> {
        return this.fetchService.get(
            "/widgetApi/SegmentsMarketingMix/SegmentTrafficSources/Data",
            this.enhanceParamsWithUseAdvanced({ ...params, mode: undefined }),
        );
    }

    public getCustomSegmentMarketingMixGroupGraphData(
        params: ICustomSegmentsGroupAnalysisParams,
    ): Promise<ISegmentsMMXGraphData> {
        return this.fetchService.get(
            "/widgetApi/SegmentsMarketingMix/SegmentTrafficSources/Data",
            this.enhanceParamsWithUseAdvanced({ ...params, mode: undefined }),
        );
    }

    // End Segments Group Analysis

    public updatePrefUseAdvanced(useAdvanced: boolean): Promise<any> {
        if (!ENABLE_FIREBOLT) {
            return Promise.reject(
                new Error(
                    "FATAL: Opt-in feature is OFF! (this method is not allowed to be invoked)",
                ),
            );
        }
        return PreferencesService.add({
            [SEGMENTS_USE_ADVANCED_PREF_KEY]: useAdvanced,
        });
    }

    public getPrefUseAdvanced(): boolean {
        if (!ENABLE_FIREBOLT) {
            throw new Error(
                "FATAL: Opt-in feature is OFF! (this method is not allowed to be invoked)",
            );
        }
        //return !!PreferencesService.get(SEGMENTS_USE_ADVANCED_PREF_KEY);
        return true;
    }

    public enhanceParamsWithUseAdvanced(params: { [key: string]: any }): { [key: string]: any } {
        if (ENABLE_FIREBOLT) {
            return {
                ...params,
                useAdvanced: this.getPrefUseAdvanced(),
            };
        }
        return params;
    }

    private prepareParams(
        params: IWordPredictionsParams,
        pageSize: number = DEFAULT_PAGE_SIZE,
    ): string {
        return `from=${params.from}&to=${params.to}&includeSubDomains=${params.includeSubDomains}&keys=${params.keys}&orderBy=${params.orderBy}&isWindow=${params.isWindow}&timeGranularity=${params.timeGranularity}&PageSize=${pageSize}&webSource=${DEFAULT_WEB_SOURCE}`;
    }
}
