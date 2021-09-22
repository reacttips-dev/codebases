import { IInsightRecord } from "../types/serviceTypes";

/**
 * As of the moment, product decided that we don't want to show bounce rate
 * segment insights, so we should filter them.
 */
const isValidSegmentInsight = (segmentInsight: IInsightRecord) => {
    return segmentInsight.insightType !== "BounceRate";
};

export const filterInsights = (insights: IInsightRecord[]) => {
    return insights.filter((insight) => {
        // We should show any insight that is not a segment insight
        // and filter segment insights according to specific rules
        const isSegmentInsight = insight.entityType === "Segment";
        const isIndustryInsight = insight.entityType === "Industry";
        if (isSegmentInsight) return isValidSegmentInsight(insight);
        if (isIndustryInsight) return insight.change > 0;
        return true;
    });
};
