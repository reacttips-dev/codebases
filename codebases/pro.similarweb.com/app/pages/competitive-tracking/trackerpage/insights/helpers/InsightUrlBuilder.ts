import { ETrackerAssetType } from "services/competitiveTracker/types";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";

export interface IInsightUrl {
    stateName: string;
    stateParams: any;
}

const getKeyParam = (insight: IInsightRecord) => {
    // In some cases we want to navigate the user to a comparison page.
    // this should happen only when the insight is based on a comparison between two entities
    // (Me and the current insight entity), and under the assumption that me (a.k.a - the current tracker's
    // main asset) is a website.
    const trackerMainAssetType = insight.metaData.tracker.mainPropertyType;
    const isMainAssetWebsite = trackerMainAssetType === ETrackerAssetType.Website;
    const isCompareMode = insight.isRelative && isMainAssetWebsite;

    // In case we need to navigate to a comparison page,
    // we simply provide multiple entity keys to the navigator.
    return isCompareMode
        ? `${insight.metaData.tracker.mainPropertyId},${insight.entityId}`
        : insight.entityId;
};

const getCountryParam = (insight: IInsightRecord) => {
    return `${insight.metaData.tracker?.country || 999}`;
};

const getNewVsReturningNavDetails = (insight: IInsightRecord): IInsightUrl => {
    return {
        stateName: "companyresearch_website_new_vs_returning",
        stateParams: {
            country: getCountryParam(insight),
            key: getKeyParam(insight),
            isWWW: "*",
            duration: "12m",
        },
    };
};

const getCrossVisitationNavDetails = (insight: IInsightRecord): IInsightUrl => {
    return {
        stateName: "companyresearch_website_audienceOverlap",
        stateParams: {
            country: getCountryParam(insight),
            key: getKeyParam(insight),
            isWWW: "*",
            duration: "12m",
        },
    };
};

const getExclusiveVisitorsNavDetails = (insight: IInsightRecord): IInsightUrl => {
    return {
        stateName: "companyresearch_website_audienceInterests",
        stateParams: {
            country: getCountryParam(insight),
            key: getKeyParam(insight),
            isWWW: "*",
            duration: "12m",
        },
    };
};

const getTrafficAndEngagementNavDetails = (insight: IInsightRecord): IInsightUrl => {
    switch (insight.entityType) {
        case "Domain":
        case "Industry":
            return {
                stateName: "companyresearch_website_trafficandengagement",
                stateParams: {
                    key: getKeyParam(insight),
                    country: getCountryParam(insight),
                    isWWW: "*",
                    duration: "12m",
                },
            };
        case "Segment":
            return {
                stateName: "companyresearch_segments.analysis.traffic",
                stateParams: {
                    mode: "single",
                    id: insight.metaData.segment.id,
                    country: getCountryParam(insight),
                    duration: "12m",
                },
            };

        default:
            return null;
    }
};

export const getNavDetailsForInsight = (insight: IInsightRecord) => {
    switch (insight.insightGroupType) {
        case "TrafficAndEngagement":
            return getTrafficAndEngagementNavDetails(insight);
        case "CrossVisits":
            return getCrossVisitationNavDetails(insight);
        case "NewVsReturning":
            return getNewVsReturningNavDetails(insight);
        case "ExclusiveVisitors":
            return getExclusiveVisitorsNavDetails(insight);
        default:
            return null;
    }
};
