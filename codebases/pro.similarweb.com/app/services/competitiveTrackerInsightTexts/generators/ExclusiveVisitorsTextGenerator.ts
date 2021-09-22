import {
    getChangePercent,
    getChangeTextColor,
    getChangeTextForType,
} from "./../helpers/changePercentTextGenerator";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { IInsightCardText } from "services/competitiveTrackerInsightTexts/types/serviceTypes";

//Exclusive visitors are trending down by X%
const buildNonRelativeExclusiveVisitorsText = (insight: IInsightRecord): IInsightCardText[] => {
    return [
        {
            text: "Exclusive Visitors",
            isBold: true,
        },
        {
            text: "are",
        },
        {
            text: `${getChangeTextForType(insight.change, "trending")} by ${getChangePercent(
                insight.change,
            )}`,
            color: getChangeTextColor(insight.change),
        },
    ];
};

//There is an increase in exclusive visitors by X%
const buildRelativeExclusiveVisitorsText = (insight: IInsightRecord): IInsightCardText[] => {
    return [
        {
            text: getChangeTextForType(insight.change, "increaseIn"),
        },
        {
            text: "Exclusive Visitors",
            isBold: true,
        },
        {
            text: `by ${getChangePercent(insight.change)}`,
            color: getChangeTextColor(insight.change),
        },
        {
            text: "between me and",
        },
        {
            text: insight.entityId,
            isBold: true,
        },
    ];
};

const buildInsightText = (insight: IInsightRecord): IInsightCardText[] => {
    return insight.isRelative
        ? buildRelativeExclusiveVisitorsText(insight)
        : buildNonRelativeExclusiveVisitorsText(insight);
};

export const ExclusiveVisitorsTextGenerator = {
    buildInsightText,
};
