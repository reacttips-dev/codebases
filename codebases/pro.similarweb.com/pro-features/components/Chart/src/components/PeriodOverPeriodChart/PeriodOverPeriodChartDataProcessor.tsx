import { ILineChartData } from "components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChartTypes";
import markerWithDashedLinePerPointChartConfig from "../../configs/series/markerWithDashedLinePerPointChartConfig";
import dayjs from "dayjs";

export const processDataForLineInChart = (
    title: string,
    color: string,
    recordsData: ILineChartData[],
) => {
    // We want to pass the linechart data into the lowConfidence chart config
    // this way we "augment" our data with confidence representation
    const chartDataWithConfidence = markerWithDashedLinePerPointChartConfig({
        data: recordsData.map((rec) => [rec.x, rec.y, rec.confidenceData]),
        color: color,
        isDataSingleSeries: true,
    });

    // After augmenting the chart data with confidence,
    // we want to add our original data fields to the augmented data.
    chartDataWithConfidence["data"] = chartDataWithConfidence["data"].map((rec, index) => {
        return {
            originalX: recordsData[index]["originalX"],
            change: recordsData[index]["change"],
            ...rec,
        };
    });

    return {
        name: title,
        color: color,
        marker: { symbol: "circle" },
        ...chartDataWithConfidence,
    };
};

export const normalizeChartXData = (value) => {
    const date = new Date(value);

    if (date.toString() !== "Invalid Date") {
        const formattedDate = dayjs.utc(value).unix() * 1000;
        return formattedDate;
    }

    return value;
};
