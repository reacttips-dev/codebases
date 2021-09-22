import dayjs from "dayjs";
import { IPptSeriesData } from "services/PptExportService/PptExportServiceTypes";

type PopDataPoint = { key: string; y: number };
type PopDataSeries = Array<{ color: string; data: PopDataPoint[] }>;

/**
 * A Period-Over-Period chart legend should contain the periods in comparison
 * therefore we take the dates range of each of the data series and generate a legend item from it.
 */
const getLegendNameForPOPSeries = (seriesData: Array<{ key: string; y: number }>): string => {
    // In case we have multiple dates - we want to take the first and last dates, and create
    // a dates range string. otherwise - we simply return the single date.
    const hasDatesRange = seriesData.length > 1;
    if (hasDatesRange) {
        const firstDate = dayjs(seriesData[0].key).format("MMM YYYY");
        const lastDate = dayjs(seriesData[seriesData.length - 1].key).format("MMM YYYY");
        return `${firstDate} - ${lastDate}`;
    }

    return dayjs(seriesData[0].key).format("MMM YYYY");
};

const resolvePointLabelForPOP = (
    thisPoint: PopDataPoint,
    otherPoint: PopDataPoint,
    isYearOverYear: boolean,
) => {
    // In case the widget consists of year-over-year data ("compare to previous year" mode)
    // then the data labels should simply specify the month
    if (isYearOverYear) {
        return dayjs(thisPoint.key).format("MMM");
    }

    // Otherwise, the current metric consits of period-over-period data ("compare to previous period" mode)
    // in such case, our label must explicitly specify what are the periods in comparison
    const thisPointLabel = dayjs(thisPoint.key).format("MMM YYYY");
    const otherPointLabel = dayjs(otherPoint.key).format("MMM YYYY");
    return `${thisPointLabel} <> ${otherPointLabel}`;
};

/**
 * POP metrics can have two comparison modes: "compare to previous year" or "compare to previous period"
 * this method checks if the metric is set to "compare to previous year" mode.
 */
export const isYearOverYearWidget = (widget: any) => {
    const widgetComparedPeriod = widget?._widgetConfig?.properties?.comparedDuration ?? "12m";
    return widgetComparedPeriod === "12m";
};

export const getPOPWidgetSeriesData = (
    widgetSeries: PopDataSeries,
    isYearOverYear: boolean,
): IPptSeriesData[] => {
    return widgetSeries.map((currentSeries, currSeriesIndex) => {
        // Retreive the compared series (the series that are compared to the current series)
        // and use them for formatting the data labels
        const comparedSeries = widgetSeries.find(
            (otherSeries, otherSeriesIndex) => otherSeriesIndex !== currSeriesIndex,
        );

        const name = getLegendNameForPOPSeries(currentSeries.data);
        const values = currentSeries.data.map((point) => `${point.y}`);
        const labels = currentSeries.data.map((thisPoint, index) => {
            const comparedPoint = comparedSeries.data[index];
            return resolvePointLabelForPOP(thisPoint, comparedPoint, isYearOverYear);
        });
        return {
            seriesName: name,
            seriesColor: currentSeries.color,
            labels,
            values,
        };
    });
};
