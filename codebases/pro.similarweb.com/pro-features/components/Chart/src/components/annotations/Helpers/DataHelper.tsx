import dayjs from "dayjs";
import { IAnnotation } from "../Data/Annotation";

/*
 * Formated date display in callout (AnnotationsPanel, AddEditPanel)
 */
export const getShortFormatedDate = (timestamp) => {
    return dayjs.utc(+timestamp).format("MMM DD, YYYY");
};
/* When creating annotation we set createdTimestamp which should be utc time,
 * so that the sort will in be correct no matter in which timezone the user is.
 */
export const getCurrentUTCTimestamp = () => {
    const created = new Date();
    return Date.UTC(
        created.getUTCFullYear(),
        created.getUTCMonth(),
        created.getUTCDate(),
        created.getUTCHours(),
        created.getUTCMinutes(),
        created.getUTCSeconds(),
        created.getUTCMilliseconds(),
    );
};
/*
 * If we dont have data, we dont need to display annotations or add button,
 * there will be empty data chart image displayed
 */
export const hasNoChartData = (chart) => {
    let isData = false;
    if (chart?.series?.length) {
        let index = chart.series.length - 1;
        while (!isData && index >= 0) {
            isData = isData || chart.series[index].visible;
            index--;
        }
    }
    return !isData;
};
/*
 * Find closest timestamp data point (for weekly granularity)
 * according to annotation timestamp passed as parameter
 */
export const getCloserTimestampOnWeeklyGraph = (chart, timestamp: number) => {
    const min = chart.xAxis[0].dataMin;
    // time range between 2 points in the graph
    const timeRangeBetweenTwoPoints = chart.series[0].basePointRange; // we can use any series, in regards of basePointRange they all share same value
    const nbRange = Math.floor((timestamp - min) / timeRangeBetweenTwoPoints);
    return min + nbRange * timeRangeBetweenTwoPoints;
};
/*
 * Find closest timestamp data point (for monthly granularity)
 * according to annotation timestamp passed as parameter
 */
export const getCloserTimestampOnMonthlyGraph = (chart, timestamp: number) => {
    let chartTime,
        timeIndex = 0;
    // we can use any series, in regards of processedXData[timeIndex] they all share same value
    while (chart.series[0].processedXData[timeIndex] <= timestamp) {
        chartTime = chart.series[0].processedXData[timeIndex];
        timeIndex++;
    }
    return chartTime;
};
/*
 * We deduce granularity from the chart, it is more generic, and since there might be use case
 * where the chart support only one granularity and it is hardcoded in code rather than defined in redux
 */
export const getGranularity = (chart) => {
    if (chart && chart.series && chart.series.length > 0) {
        const tickInterval = chart.series[0].basePointRange; // we can use any series, in regards of basePointRange they all share same value
        if (!tickInterval || tickInterval >= 24 * 3600 * 1000 * 28) {
            return "Monthly";
        } else if (tickInterval > 24 * 3600 * 1000) {
            return "Weekly";
        } else {
            return "Daily";
        }
    }
    return undefined;
};
/*
 * This method is to build a map of annotation by timestamp (chart data point timestamp)
 * It is used as an easy way to count and render annotation in Highcharts (by chart data point timestamp)
 */
export const getAnnotationsByChartTimestampDataPoint = (chart, annotationsData) => {
    const granularity = getGranularity(chart);
    const annotationsChart = {};
    if (granularity === "Daily") {
        annotationsData.map((annotation) => {
            if (!annotationsChart[annotation.timestamp]) {
                annotationsChart[annotation.timestamp] = [];
            }
            annotationsChart[annotation.timestamp].push(annotation);
        });
    } else if (granularity === "Weekly") {
        annotationsData.map((annotation) => {
            const timestamp = getCloserTimestampOnWeeklyGraph(chart, annotation.timestamp);
            if (!annotationsChart[timestamp]) {
                annotationsChart[timestamp] = [];
            }
            annotationsChart[timestamp].push(annotation);
        });
    } else if (granularity === "Monthly") {
        annotationsData.map((annotation) => {
            const timestamp = getCloserTimestampOnMonthlyGraph(chart, annotation.timestamp);
            if (!annotationsChart[timestamp]) {
                annotationsChart[timestamp] = [];
            }
            annotationsChart[timestamp].push(annotation);
        });
    }
    return annotationsChart;
};
/*
 * For now it is just to sort annotation before editing them.
 * We sort by annotation timestamp then by createdTimestamp.
 */
export const preProcessAnnotationsToEdit = (annotations: IAnnotation[]) => {
    // should not happen
    if (!annotations) {
        return [];
    }
    const desc = true; // could be added later in a checkbox
    return annotations.sort((a, b) => {
        if (a.timestamp === b.timestamp) {
            return desc
                ? a.createdTimestamp - b.createdTimestamp
                : b.createdTimestamp - a.createdTimestamp;
        }
        return desc ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    });
};
/*
 * Use Highcharts API to add annotation in chart
 */
export const addAnnotationToChart = (
    chart,
    timestamp: number,
    chartX: number,
    annotationsCount: number,
    onClickAnnotationHandler: (e) => void,
) => {
    const offset =
        chart?.xAxis[0].options?.labels?.y > 20 ? chart.xAxis[0].options.labels.y + 26 : 45;
    const y = chart.xAxis[0].height + chart.xAxis[0].labelOffset + offset;
    const annotation = chart.addAnnotation({
        id: "" + timestamp, //must be a string
        draggable: "", // annotation must not be draggable
        labels: [
            {
                allowOverlap: true,
                borderWidth: 0,
                distance: 0,
                shape: `rect`,
                padding: 0,
                point: {
                    x: chartX,
                    y: y,
                },
                // y: 0,
                useHTML: true,
                verticalAlign: "top",
                text: `<div class="chart-annotation-label"
                            >${annotationsCount}</div>`,
            },
        ],
    });
    annotation.labels[0].graphic.on(`click`, (e) => onClickAnnotationHandler(e));
    return annotation;
};
/*
 * Following are methods to update annotation in models
 */
export const updateItemInListById = (list, item) => {
    if (!list || !list.length || !item || item.id === undefined || item.id === null) {
        return list;
    }
    const index = list.findIndex((listItem) => listItem.id === item.id);
    return [...list.slice(0, index), { ...item }, ...list.slice(index + 1)];
};

export const deleteItemInListById = (list, id) => {
    if (!list || !list.length || id === undefined || id === null) {
        return list;
    }
    const index = list.findIndex((listItem) => listItem.id === id);
    return [...list.slice(0, index), ...list.slice(index + 1)];
};

export const enum UpdateType {
    Deleted = 1,
    Updated,
    Added,
}
export const updateAnnotations = (
    annotations: IAnnotation[],
    annotation: IAnnotation,
    changeType: UpdateType,
) => {
    if (changeType === UpdateType.Deleted) {
        return deleteItemInListById(annotations, annotation.id);
    } else if (changeType === UpdateType.Updated) {
        return updateItemInListById(annotations, annotation);
    } else if (changeType === UpdateType.Added) {
        return [...annotations, annotation];
    }
};
