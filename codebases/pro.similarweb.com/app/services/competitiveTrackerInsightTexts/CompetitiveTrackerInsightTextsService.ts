import { TrafficAndEngagementTextGenerator } from "services/competitiveTrackerInsightTexts/generators/TrafficAndEngagementTextGenerator";
import { ExclusiveVisitorsTextGenerator } from "services/competitiveTrackerInsightTexts/generators/ExclusiveVisitorsTextGenerator";
import { NewVsReturningTextGenerator } from "services/competitiveTrackerInsightTexts/generators/NewVsReturningTextGenerator";
import { CrossVisitsTextGenerator } from "services/competitiveTrackerInsightTexts/generators/CrossVisitsTextGenerator";
import { ITextGenerator } from "services/competitiveTrackerInsightTexts/types/serviceTypes";
import {
    IInsightRecord,
    InsightGroupType,
} from "services/competitiveTrackerInsights/types/serviceTypes";

const getGeneratorForGroupType = (groupType: InsightGroupType): ITextGenerator => {
    switch (groupType) {
        case "TrafficAndEngagement":
            return TrafficAndEngagementTextGenerator;
        case "ExclusiveVisitors":
            return ExclusiveVisitorsTextGenerator;
        case "NewVsReturning":
            return NewVsReturningTextGenerator;
        case "CrossVisits":
            return CrossVisitsTextGenerator;
        default:
            return null;
    }
};

const createBodyTextForInsight = (insight: IInsightRecord) => {
    const generator = getGeneratorForGroupType(insight.insightGroupType);
    return generator.buildInsightText(insight);
};

export const CompetitiveTrackerInsightTextService = {
    createBodyTextForInsight,
};

export type ICompetitiveTrackerInsightTextService = typeof CompetitiveTrackerInsightTextService;
