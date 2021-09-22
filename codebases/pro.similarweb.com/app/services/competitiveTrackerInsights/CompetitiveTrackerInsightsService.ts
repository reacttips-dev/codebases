import { DefaultFetchService } from "services/fetchService";
import { SwLog } from "@similarweb/sw-log";
import _ from "lodash";
import { IInsightRecord, InsightEntityType, InsightGroupType } from "./types/serviceTypes";
import { ITrackerInsightApiResult } from "./types/apiTypes";
import { adaptInsightsData } from "./helpers/InsightDataAdapter";
import { pickInsightRecords } from "./helpers/InsightRecordPicker";
import { ETrackerAssetType, ISegmentsModule, ITracker } from "services/competitiveTracker/types";
import { filterInsights } from "./helpers/InsightRecordFilter";

const TRACKER_INSIGHTS_AMOUNT = 8;
const TRACKER_INSIGHTS_ENDPOINT = "api/Tracker/Insights";
const fetchService = DefaultFetchService.getInstance();

const buildRequestUrl = (entityType: InsightEntityType, insightType: InsightGroupType) => {
    return `${TRACKER_INSIGHTS_ENDPOINT}/${entityType}/${insightType}`;
};

const fetchFromApi = async (
    tracker: ITracker,
    entityType: InsightEntityType,
    insightsGroupType: InsightGroupType,
) => {
    try {
        const requestUrl = buildRequestUrl(entityType, insightsGroupType);
        const result = await fetchService.get<ITrackerInsightApiResult>(requestUrl, {
            trackerId: tracker.id,
            lastUpdated: tracker.lastUpdated,
        });
        return result;
    } catch (e) {
        SwLog.error(e);
        return null;
    }
};

const isRedundantFetch = (tracker: ITracker, entityType: InsightEntityType) => {
    const { industryId, mainPropertyType, competitors } = tracker;
    const { Website, Segment } = ETrackerAssetType;
    switch (entityType) {
        case "Domain":
            return mainPropertyType !== Website && competitors[Website].length === 0;
        case "Segment":
            return mainPropertyType !== Segment && competitors[Segment].length === 0;
        case "Industry":
            return !Boolean(industryId);
        default:
            return false;
    }
};

const getTrackerInsights = async (
    tracker: ITracker,
    segments: ISegmentsModule,
    entityType: InsightEntityType,
    groupType: InsightGroupType,
): Promise<IInsightRecord[]> => {
    /**
     * in case segments data didn't load yet, then we shouldn't fetch
     * any insights data from the server
     */
    if (segments.segmentsLoading || isRedundantFetch(tracker, entityType)) return [];

    const apiResult = await fetchFromApi(tracker, entityType, groupType);
    if (!apiResult) return [];

    const adaptedResult = adaptInsightsData(apiResult, groupType, entityType, tracker, segments);
    return adaptedResult;
};

const getAllTrackerInsights = async (
    tracker: ITracker,
    segments: ISegmentsModule,
): Promise<IInsightRecord[]> => {
    const insights = await Promise.all([
        getTrackerInsights(tracker, segments, "Domain", "ExclusiveVisitors"),
        getTrackerInsights(tracker, segments, "Domain", "CrossVisits"),
        getTrackerInsights(tracker, segments, "Domain", "NewVsReturning"),
        getTrackerInsights(tracker, segments, "Domain", "TrafficAndEngagement"),
        getTrackerInsights(tracker, segments, "Industry", "TrafficAndEngagement"),
        getTrackerInsights(tracker, segments, "Segment", "TrafficAndEngagement"),
    ]);

    // Flatten the results array into a single array of insights
    const flattenedInsights = _.flatten(insights);
    const filteredInsights = filterInsights(flattenedInsights);
    return pickInsightRecords(filteredInsights, TRACKER_INSIGHTS_AMOUNT);
};

export const CompetitiveTrackerInsightsService = {
    getTrackerInsights,
    getAllTrackerInsights,
};

export type ICompetitiveTrackerInsightsService = typeof CompetitiveTrackerInsightsService;
