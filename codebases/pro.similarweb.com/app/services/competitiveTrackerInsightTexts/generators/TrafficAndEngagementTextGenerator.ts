import {
    getChangePercent,
    getChangeTextColor,
    getChangeTextForType,
} from "./../helpers/changePercentTextGenerator";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { IInsightCardText } from "services/competitiveTrackerInsightTexts/types/serviceTypes";
import { generateInsightTypeText } from "../helpers/parameterTextGenerator";

const buildSegmentText = (insight: IInsightRecord): IInsightCardText[] => {
    const changeText = getChangeTextForType(insight.change, "increaseBy");
    const percentText = getChangePercent(insight.change);

    return [
        {
            text: "Segment Share",
            isBold: true,
        },
        {
            text: `${changeText} ${percentText}`,
            color: getChangeTextColor(insight.change, false),
        },
    ];
};

const buildIndustryText = (insight: IInsightRecord): IInsightCardText[] => {
    const shouldInvertTrendingColor = insight.insightType === "BounceRate";
    const changeColor = getChangeTextColor(insight.change, shouldInvertTrendingColor);

    const trendingText = getChangeTextForType(insight.change, "trending");
    const percentText = getChangePercent(insight.change);

    return [
        {
            text: "New Competitor Alert!",
        },
        {
            text: insight.entityId,
            isBold: true,
        },
        {
            text: "is",
        },
        {
            text: trendingText,
            color: changeColor,
        },
        {
            text: "in",
        },
        {
            text: generateInsightTypeText(insight.insightType),
            isBold: true,
        },
        {
            text: `by ${percentText}`,
            color: changeColor,
        },
    ];
};

const buildDomainText = (insight: IInsightRecord): IInsightCardText[] => {
    const parameterName = generateInsightTypeText(insight.insightType);
    const parameterText = insight.isRelative ? `${parameterName} ratio` : parameterName;

    const trendingText = getChangeTextForType(insight.change, "trending");
    const percentText = getChangePercent(insight.change);

    const shouldInvertTrendingColor =
        insight.insightType === "BounceRate" || insight.insightType === "CrossVisits";
    const changeColor = getChangeTextColor(insight.change, shouldInvertTrendingColor);

    const relativeTexts = insight.isRelative
        ? [
              {
                  text: "between me and",
              },
              {
                  text: insight.entityId,
                  isBold: true,
              },
          ]
        : [];

    return [
        {
            text: parameterText,
            isBold: true,
        },
        {
            text: "is",
        },
        {
            text: `${trendingText} by ${percentText}`,
            color: changeColor,
        },
        ...relativeTexts,
    ];
};

const buildInsightText = (insight: IInsightRecord): IInsightCardText[] => {
    switch (insight.entityType) {
        case "Industry":
            return buildIndustryText(insight);
        case "Segment":
            return buildSegmentText(insight);
        case "Domain":
        default:
            return buildDomainText(insight);
    }
};

export const TrafficAndEngagementTextGenerator = {
    buildInsightText,
};
