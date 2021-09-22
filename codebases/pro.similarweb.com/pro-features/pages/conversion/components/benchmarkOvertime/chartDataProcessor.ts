import { GraphPointData } from "pages/conversion/components/benchmarkOvertime/chartDataTypes";
import { buildPointConfidence } from "components/Chart/src/data/confidenceProcessor";
import { IPointConfidence } from "components/Chart/src/data/confidenceTypes";
import { number } from "prop-types";

export const dateToUTC = (dateString: string) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};

export const parsePointValue = (pointValueString: string | number) => {
    if (
        typeof pointValueString === "undefined" ||
        pointValueString === null ||
        pointValueString === 0
    ) {
        return null;
    }

    const parsedValue = parseFloat(pointValueString as string);
    return !isNaN(parsedValue) ? parsedValue : null;
};

/**
 * Builds a single graph point data.
 * A Graph point data is an array of the following
 * structure: [dateTimeStamp:number, pointValue: number, pointConfidence: IPointConfidence]
 */
export const buildGraphPointData = (
    dateString: string,
    pointValueString: string,
    pointConfidenceString: string,
    prevPointData?: GraphPointData,
): GraphPointData => {
    const date = dateToUTC(dateString);
    const value = parsePointValue(pointValueString);
    // In case no confidence is provided - we want to "trick" the confidence
    // dashedLine config to think that the confidence is high, so that it would
    // draw a solid line. (thus ignoring the confidence data)
    const confidenceValue = parsePointValue(pointConfidenceString) ?? 0.01;

    const prevPointConfidence: IPointConfidence = prevPointData
        ? (prevPointData[2] as IPointConfidence)
        : null;

    const pointConfidence = buildPointConfidence(confidenceValue, prevPointConfidence);

    return [date, value, pointConfidence];
};

export const buildPOPGraphPointData = (point: {
    Values: { Key: string; Value: string | number }[];
    Change: any[];
}) => {
    return {
        Values: [
            { ...point.Values[0], Value: parsePointValue(point?.Values?.[0]?.Value) },
            { ...point.Values[1], Value: parsePointValue(point?.Values?.[1]?.Value) },
        ],
        Change: point.Change,
    };
};
