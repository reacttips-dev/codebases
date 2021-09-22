import {
    getChangePercent,
    getChangeTextColor,
    getChangeTextForType,
} from "./../helpers/changePercentTextGenerator";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { IInsightCardText } from "services/competitiveTrackerInsightTexts/types/serviceTypes";

const buildInsightText = (insight: IInsightRecord): IInsightCardText[] => {
    const trendingText = getChangeTextForType(insight.change, "trending");
    const percentText = getChangePercent(insight.change);

    return [
        {
            text: "Me Vs.",
        },
        {
            text: insight.entityId,
            isBold: true,
        },
        {
            text: "Cross Visitation",
            isBold: true,
        },
        {
            text: "is",
        },
        {
            text: `${trendingText} by ${percentText}`,
            color: getChangeTextColor(insight.change, true),
        },
    ];
};

export const CrossVisitsTextGenerator = {
    buildInsightText,
};
