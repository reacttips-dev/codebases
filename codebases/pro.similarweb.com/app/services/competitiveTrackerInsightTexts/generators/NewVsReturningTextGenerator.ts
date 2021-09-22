import {
    getChangePercent,
    getChangeTextColor,
    getChangeTextForType,
} from "./../helpers/changePercentTextGenerator";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { IInsightCardText } from "services/competitiveTrackerInsightTexts/types/serviceTypes";

const buildInsightText = (insight: IInsightRecord): IInsightCardText[] => {
    const newVsReturningText = insight.isRelative ? "New vs Returning Ratio" : "New vs Returning";
    const trendingText = getChangeTextForType(insight.change, "trending");
    const percentText = getChangePercent(insight.change);

    const relativeText = insight.isRelative
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
            text: newVsReturningText,
            isBold: true,
        },
        {
            text: "is",
        },
        {
            text: `${trendingText} by ${percentText}`,
            color: getChangeTextColor(insight.change),
        },
        ...relativeText,
    ];
};

export const NewVsReturningTextGenerator = {
    buildInsightText,
};
