import {
    InsightEntityId,
    InsightEntityTypeEnum,
    ITrackerInsightApiRecord,
    ITrackerInsightApiResult,
    InsightType,
} from "../types/apiTypes";
import { IInsightRecord, InsightEntityType, InsightGroupType } from "../types/serviceTypes";
import {
    getSegmentForId,
    getIndustryForId,
} from "services/competitiveTrackerInsights/helpers/MetaDataFetcher";
import { ISegmentsModule, ITracker } from "services/competitiveTracker/types";

// TODO: use this method once the backend fixes the issue where industry entity types
// are marked with a wrong
const consolidateEntityType = (type: InsightEntityTypeEnum): InsightEntityType => {
    switch (type) {
        case InsightEntityTypeEnum.Domain:
            return "Domain";
        case InsightEntityTypeEnum.Industry:
            return "Industry";
        case InsightEntityTypeEnum.Segment:
            return "Segment";
        default:
            return null;
    }
};

const adaptInsightRecord = (
    insight: ITrackerInsightApiRecord,
    tracker: ITracker,
    typeDetails: {
        groupType: InsightGroupType;
        entityType: InsightEntityType;
        insightType: InsightType;
    },
    metaData: {
        favicons: Record<InsightEntityId, string>;
        segmentsData: ISegmentsModule;
    },
): IInsightRecord => {
    const { entityType, groupType, insightType } = typeDetails;

    const isSegment = entityType === "Segment";
    const segment = isSegment && getSegmentForId(insight.Id, metaData.segmentsData);

    const isIndustry = entityType === "Industry";
    const industry = isIndustry && getIndustryForId(tracker.industryId);

    return {
        entityId: insight.Id,
        entityImage: metaData.favicons[insight.Id],
        entityType: entityType,
        insightGroupType: groupType,
        insightType: insightType,
        change: insight.Change,
        isRelative: insight.IsRelative,
        metaData: {
            segment,
            industry,
            tracker: tracker,
        },
    };
};

export const adaptInsightsData = (
    apiData: ITrackerInsightApiResult,
    groupType: InsightGroupType,
    entityType: InsightEntityType,
    tracker: ITracker,
    segmentsData: ISegmentsModule,
): IInsightRecord[] => {
    const favicons = apiData?.["Favicons"] ?? {};
    const insightTypes = Object.keys(apiData).filter((key) => key !== "Favicons") as InsightType[];

    const adaptedData = insightTypes.reduce<IInsightRecord[]>((result, insightType) => {
        const insightsForType = apiData[insightType] as ITrackerInsightApiRecord[];
        const adaptedInsights = insightsForType.map((insight) => {
            const metaData = { favicons, segmentsData };
            const insightTypes = { groupType, entityType, insightType };
            return adaptInsightRecord(insight, tracker, insightTypes, metaData);
        });
        return [...result, ...adaptedInsights];
    }, []);

    return adaptedData;
};
