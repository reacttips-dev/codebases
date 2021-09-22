import * as _ from "lodash";
import {
    IPopularSegments,
    IWordPredictions,
} from "../../../.pro-features/components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { IDomainWhitelisted } from "../../pages/segments/wizard/SegmentFirstStep/SegmentCreationFirstStep";
import { DefaultFetchService } from "../fetchService";
import WorkerProcessor, { IWorkerProxyMethod } from "./workerProcessor";
import {
    IUrlShareSegments,
    ISegmentRuleItem,
    ISegmentsUrlParams,
    ICustomSegment,
} from "./segmentsWizardServiceTypes";
import { IWordsFilterConfig } from "services/segments/segmentsWizardServiceTypes";
import SegmentsApiServiceBase from "services/segments/segmentsApiService";
import { ENABLE_FIREBOLT } from "services/segments/SegmentsUtils";
import { ISite } from "components/Workspace/Wizard/src/types";

const segmentsWizardWorkerUrl = "/segmentsWizard.worker.js";

const DEFAULT_WEB_SOURCE = "Desktop";
const DEFAULT_PAGE_SIZE_SEGMENTS = 100000;
const DEFAULT_PAGE_SIZE = 100;

export const DEFAULT_WORDS_FILTER_CONFIGS = {
    wordsOnly: {
        wordMinLength: 2,
        wordMaxShare: 0.7,
        allowDigits: false,
        allowBlacklisted: false,
    },
    noRobotsTxt: {
        // wordMinCount: 2,
        wordMinShareByCount: 2,
    },
};

export default class SegmentsApiService {
    protected fetchService;

    // hold data for the segments
    protected loadedParamsQueryIdentifier: string;
    protected segmentsHeader: {
        MainSite: string;
    };

    // hold data for the worker
    protected workerProcessor: WorkerProcessor;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
        this.workerProcessor = new WorkerProcessor();
    }

    // stops the worker - make sure to stop the worker when ending usage with this service
    public stopWorker() {
        if (this.workerProcessor.isStarted()) {
            this.workerProcessor.stop();
        }
    }

    public isDomainWhiteListedForSegmentation(params: {
        keys: string[];
    }): Promise<IDomainWhitelisted[]> {
        return this.fetchService.get("api/websiteoverview/IsDomainWhitelisted", params);
    }

    public getUserCustomSegments(): Promise<any[]> {
        return this.fetchService.get("/api/userdata/segments/customsegments");
        // return Promise.resolve(Object.values(segmentsMock)); //
    }

    public hasExistingUrlsCompundStringNoRobots(
        params: ISegmentsUrlParams,
        rules: ISegmentRuleItem[],
    ): Promise<any> {
        const queryString = this.prepareParams(params);
        return this.fetchService.post(`widgetApi/PopularSegments/CustomMatch?${queryString}`, {
            rules,
        });
    }

    public getCustomSegmentMetaData(params: { sid: string }): Promise<ICustomSegment> {
        return this.fetchService.get(`/api/userdata/segments/customsegments/${params.sid}`);
        // return new Promise(resolve => setTimeout(resolve.bind(null, segmentMetaData), 1500));
    }

    public getRulesHighlightWords(rules: ISegmentRuleItem[]): string[] {
        return (
            rules?.reduce((acc, rule) => [...acc, ...(rule.type === 0 ? rule.words : [])], []) ?? []
        );
    }

    public getRulesExactMatchPhrases(rules: ISegmentRuleItem[]): string[] {
        return (
            rules?.reduce(
                (acc, rule) => [...acc, ...(rule.type === 0 ? rule.exact ?? [] : [])],
                [],
            ) ?? []
        );
    }

    // loads the segments data, prepares them, and syncs with worker (caches data on worker)
    public async loadPrepareSegments(
        params: ISegmentsUrlParams,
        isRaw: boolean,
        doSync: boolean = true,
    ) {
        const paramsQueryIdentifier = this.prepareParams(params, DEFAULT_PAGE_SIZE_SEGMENTS);
        if (!doSync || paramsQueryIdentifier !== this.loadedParamsQueryIdentifier) {
            if (doSync) {
                this.loadedParamsQueryIdentifier = paramsQueryIdentifier;
            }
            // fetch the segments from server
            const data: {
                Data: Array<[string, number]>;
                Header: { MainSite: string };
            } = await this.fetchService.post(
                `widgetApi/PopularSegments/PopularSegmentPages/PopularPages?${paramsQueryIdentifier}`,
                { rules: [] },
                undefined,
                undefined,
                3,
            );

            // only cache if the params had not changed since was called
            if (!doSync || paramsQueryIdentifier === this.loadedParamsQueryIdentifier) {
                const allSegmentUrls = await this.runWorker("prepareSegments")(
                    data.Data,
                    data.Header.MainSite,
                    isRaw,
                    doSync,
                );
                if (!doSync) {
                    return { allSegmentUrls, segmentsHeader: data.Header };
                }
                this.segmentsHeader = data.Header;
                return true;
            }
            return false;
        }
        return true;
    }

    public async getWordPredictions(
        rules: ISegmentRuleItem[],
        wordsFilterConfig?: IWordsFilterConfig,
    ): Promise<IWordPredictions> {
        const usedWordsSet = rules.reduce((acc, rule) => {
            rule.words.forEach((w) => acc.add(w));
            rule.exact?.forEach((e) => acc.add(e));
            return acc;
        }, new Set());

        const wordPredictions = await this.runWorker("getKeywordPredictionsList")(
            rules,
            usedWordsSet,
            wordsFilterConfig,
        );

        return {
            Data: wordPredictions,
            TotalCount: wordPredictions.length,
            Header: this.segmentsHeader,
        } as IWordPredictions;
    }

    public async getFolderPredictions(rules: ISegmentRuleItem[]): Promise<IWordPredictions> {
        const folderPredictions = await this.runWorker("getFolderPredictionsList")(rules);

        return {
            Data: folderPredictions,
            TotalCount: folderPredictions?.length,
            Header: this.segmentsHeader,
        } as IWordPredictions;
    }

    public async getPopularPages(
        rules: ISegmentRuleItem[],
        selectedSite: ISite,
    ): Promise<IPopularSegments> {
        const filteredSegments = await this.runWorker("searchSegments")(rules);
        return {
            Data: filteredSegments.map((sg) => ({
                Page: {
                    Highlights: [{}],
                    URL: sg.URL,
                },
                Share: sg.Share,
            })),
            TotalCount: filteredSegments.length,
            Header: {
                MainSite: selectedSite.name,
            },
        } as IPopularSegments;
    }

    public getPopularPagesDiff(
        oldRules: ISegmentRuleItem[],
        newRules: ISegmentRuleItem[],
        remove: boolean,
        params: ISegmentsUrlParams,
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

    public calculateSegmentShare(
        domain: string,
        country: number,
        rules: ISegmentRuleItem[],
    ): Promise<any> {
        let queryString = `keys=${domain}&country=${country}`;
        if (ENABLE_FIREBOLT) {
            queryString += `&useAdvanced=${SegmentsApiServiceBase.getInstance().getPrefUseAdvanced()}`;
        }
        return this.fetchService.post(`api/userdata/segments/calculateshare?${queryString}`, {
            rules,
        });
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

    protected runWorker(name): IWorkerProxyMethod {
        if (!this.workerProcessor.isStarted()) {
            this.workerProcessor.start(segmentsWizardWorkerUrl);
        }
        return this.workerProcessor.run(name);
    }

    private prepareParams(
        params: ISegmentsUrlParams,
        pageSize: number = DEFAULT_PAGE_SIZE,
    ): string {
        return (
            `from=${params.from}&to=${params.to}&includeSubDomains=${params.includeSubDomains}&keys=${params.keys}` +
            `&orderBy=${params.orderBy}&isWindow=${params.isWindow}&timeGranularity=${params.timeGranularity}` +
            `&PageSize=${pageSize}&webSource=${DEFAULT_WEB_SOURCE}`
        );
    }
}
