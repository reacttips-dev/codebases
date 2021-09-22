import _ from "lodash";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";

const sortInsightsByChangeValue = (insights: IInsightRecord[]) => {
    return [...insights].sort((thisInsight, otherInsight) => {
        return Math.abs(thisInsight.change) - Math.abs(otherInsight.change);
    });
};

export const pickInsightRecords = (insights: IInsightRecord[], insightsToPick = 8) => {
    const sortedInsights = sortInsightsByChangeValue(insights);

    // Pick a single industry insight, and a single segment insight
    // and make sure they exist (by filtering nulls).
    // (a segment/industry insight might not always be present)
    const nonDomainInsights = [
        pickTopIndustryInsight(sortedInsights),
        pickTopSegmentInsight(sortedInsights),
    ].filter((insight) => Boolean(insight));

    // Check how many insights do we want to pick (according to the amount
    // of required insights, subtracted by the amount of already-picked insights)
    // and take domain insights according to that amount
    const insightsLeftToPick = insightsToPick - nonDomainInsights.length;
    const domainInsights = pickRandomTopDomainInsights(sortedInsights, insightsLeftToPick);

    // then shuffle the entire stack of selected insights.
    return _.shuffle([...nonDomainInsights, ...domainInsights]);
};

/**
 * Picks the first industry insight, under the assumption that the provided
 * insights are sorted by their change value
 * @param sortedInsights a list of insights sorted by their change value
 * @returns a single industry insight with the highest % change.
 */
export const pickTopIndustryInsight = (sortedInsights: IInsightRecord[]) => {
    return sortedInsights.find((insight) => insight.entityType === "Industry");
};

/**
 * Picks the first segment insight, under the assumption that the provided
 * insights are sorted by their change value
 * @param sortedInsights a list of insights sorted by their change value
 * @returns a single segment insight with the highest % change.
 */
export const pickTopSegmentInsight = (sortedInsights: IInsightRecord[]) => {
    return sortedInsights.find((insight) => insight.entityType === "Segment");
};

/**
 * Picks an amount of X domain insights,
 * @param sortedInsights a list of insights sorted by their change value
 * @param insightsToPick the amount of insights we want to pick
 * @returns a list of randomly selected top domain insights
 */
export const pickRandomTopDomainInsights = (
    sortedInsights: IInsightRecord[],
    insightsToPick: number,
) => {
    const insightsPool = sortedInsights
        .filter((insight) => insight.entityType === "Domain")
        .slice(0, insightsToPick * 2);

    return _.shuffle(insightsPool).slice(0, insightsToPick);
};
