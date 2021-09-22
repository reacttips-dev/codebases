import {
    TRENDING_UP_COLOR,
    TRENDING_DOWN_COLOR,
} from "services/competitiveTrackerInsightTexts/types/serviceConsts";

export type ChangeTextType = "trending" | "increaseBy" | "increaseIn";

export const getChangePercent = (change: number) => {
    return `${(change * 100).toFixed(0)}%`;
};

export const getChangeTextForType = (changeValue: number, textType: ChangeTextType) => {
    const isIncrease = changeValue > 0;

    switch (textType) {
        case "increaseBy":
            return isIncrease ? "has increased by" : "has decreased by";
        case "increaseIn":
            return isIncrease ? "There is an increase in" : "There is a decrease in";
        case "trending":
        default:
            return isIncrease ? "trending up" : "trending down";
    }
};

export const getChangeTextColor = (changeValue: number, shouldInvertColor = false) => {
    changeValue = shouldInvertColor ? (changeValue *= -1) : changeValue;
    const isIncrease = changeValue > 0;
    return isIncrease ? TRENDING_UP_COLOR : TRENDING_DOWN_COLOR;
};
