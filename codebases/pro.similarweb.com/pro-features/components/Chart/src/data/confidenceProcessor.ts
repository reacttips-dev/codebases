import { IPointConfidence } from "components/Chart/src/data/confidenceTypes";

export const isLowConfidence = (confidenceValue: number) => {
    return confidenceValue >= 0.3 && confidenceValue < 1;
};

export const isVeryLowConfidence = (confidenceValue: number) => {
    return confidenceValue <= 0 || confidenceValue >= 1;
};

/**
 * Formats the given point value to a readable format for the sharedTooltip.
 * @param pointValue - The point y value
 * @param pointConfidence - The point confidence value
 * @param pointFilters - The given external filters for formatting the point value
 */
export const formatTooltipPointWithConfidence = (pointValue, pointConfidence, pointFilters) => {
    const hasConfidenceValue = typeof pointConfidence !== "undefined" && pointConfidence !== null;

    // Do not show the point data in case its confidence is very low
    const isPointVeryLowConfidence = hasConfidenceValue && isVeryLowConfidence(pointConfidence);
    if (isPointVeryLowConfidence || !pointValue) {
        return "N/A";
    }

    const filteredValue = pointFilters[0]()(pointValue, pointFilters[1]);

    // Add a ~ sign to the point in case it has a valid value but its confidence is low
    const isPointLowConfidence = hasConfidenceValue && isLowConfidence(pointConfidence);
    const isValidValue = Number.isFinite(Number.parseFloat(filteredValue));
    const formattedValue =
        isValidValue && isPointLowConfidence ? "~ " + filteredValue : filteredValue;

    return formattedValue;
};

export const buildPointConfidence = (
    confidenceValue?: number,
    prevConfidencePoint?: IPointConfidence,
): IPointConfidence => {
    // In case no confidence is provided - we want to "trick" the confidence
    // dashedLine config to think that the confidence is high, so that it would
    // draw a solid line. (thus ignoring the confidence data)
    const confidence = confidenceValue ?? 0.01;
    const isCurrPointLowConfidence = isLowConfidence(confidence);
    const isPrevPointLowConfidence = prevConfidencePoint?.hallowMarker ?? false;

    return {
        confidenceLevel: confidence,
        hallowMarker: isCurrPointLowConfidence,
        partial: isCurrPointLowConfidence || isPrevPointLowConfidence,
    };
};
