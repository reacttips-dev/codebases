import _ from "lodash";
import { IPptAreaChartOptions } from "services/PptExportService/PptExportServiceTypes";
import { IPptLineChartOptions } from "services/PptExportService/PptExportServiceTypes";

type GraphLineDetails = {
    name: string;
    color: string;
    isGAVerified?: boolean;
    data: number[][];
};

const resolvePeriodMonthsCount = (period: string): number => {
    const isLessThanMonth = period.endsWith("d");
    return isLessThanMonth ? 1 : Number(period.replace("m", ""));
};

const resolveCategoryAxisLabelFrequency = (widget: any) => {
    const dataPointsCount = widget.chartConfig.series[0].data.length;
    const dataPeriod = resolvePeriodMonthsCount(widget._widgetModel.duration);

    // In case the data spans over a single month, then we shouldn't reduce label frequency
    // but rather show the full range
    const isSingleMonth = dataPeriod === 1;
    return isSingleMonth ? 1 : Math.floor(dataPointsCount / dataPeriod);
};

export const getGraphWidgetPptOptions = (widget: any): IPptLineChartOptions => {
    return {
        showMarkers: widget?.metadata?.chartOptions?.timeGranularity?.toLowerCase() !== "daily",
        showLegend: true,
        categoryAxisLabelFrequency: resolveCategoryAxisLabelFrequency(widget),
        minValue: widget._metricTypeConfig?.ppt?.minValue,
        maxValue: widget._metricTypeConfig?.ppt?.maxValue,
    };
};

export const getAreaGraphWidgetPptOptions = (widget: any): IPptAreaChartOptions => {
    return {
        isStacked: true,
        showLegend: true,
        categoryAxisLabelFrequency: resolveCategoryAxisLabelFrequency(widget),
        minValue: widget._metricTypeConfig?.ppt?.minValue,
        maxValue: widget._metricTypeConfig?.ppt?.maxValue,
    };
};

export const getGraphWidgetCategoryAxisLabelFormat = (timeGranularity: string) => {
    const isMonthlyGranularity = timeGranularity.toLowerCase() === "monthly";
    return isMonthlyGranularity ? "MMM YYYY" : "MMM DD, YYYY";
};

export const formatLineChartLegendName = (widget: any, entityKey: string): string => {
    // In case the widget is an industry widget, then the entityKey should be an industry name
    // therefore we can simply return it as it.
    const isIndustryWidget = widget._widgetModel.family?.toLowerCase() === "industry";
    if (!isIndustryWidget) return entityKey;

    // Otherwise - we should check if the current entity key is a category id, and return the relevant
    // category if so. in case it's not a category id, then its simply the entity name.
    const industryEntity = widget._widgetModel.key?.find((entity) => entity.id === entityKey);
    return industryEntity ? industryEntity.name : entityKey;
};

export const fixLinesWithMissingData = (series: Array<GraphLineDetails>) => {
    const linesWithFixedLabels = fillLinesWithMissingLabels(series);
    const linesWithFixedValues = fillLinesWithMissingValues(linesWithFixedLabels);
    return linesWithFixedValues;
};

/**
 * In some cases, some of the data series within a graph widget (line chart) might have missing values
 * this means that the current line's data array HAS all elements, but some of it's Y values are null/undefined
 * this casues issues when rendering the ppt widget, since it relies on a complete data array.
 * in such cases - we fill replace any null/undefined values with 0, so that the ppt widget will render
 * all values properly.
 */
const fillLinesWithMissingValues = (series: Array<GraphLineDetails>) => {
    const fixedSeries = series.map((line) => {
        const isLineValid = line.data.every(isYValueValid);
        return isLineValid ? line : createLineWithFixedValues(line);
    });

    return fixedSeries;
};

/**
 * In some cases, some of the data series within a graph widget (line chart) might have missing labels
 * this means that the current line's data array has less elements (points) than expected.
 * this causes issues when rendering the ppt widget, since it relies on a complete data array.
 * in such cases - we fill any missing data points with undefined values, so that the ppt widget
 * will render all labels properly.
 */
const fillLinesWithMissingLabels = (series: Array<GraphLineDetails>) => {
    // Find a line that has all data points
    const lineWithMaximumLabels = _.maxBy(series, (line) => line.data.length);
    const validGraphLabels = lineWithMaximumLabels.data.map((point) => point[0]);

    // interate through each of the data lines, in case it has all data points
    // then we shouldn't touch it. otherwise - we fill in the missing data labels,
    // and add 0 value to them.
    const fixedSeries = series.map((line) => {
        const isLineValid = line.data.length === validGraphLabels.length;
        return isLineValid ? line : createLineWithFixedLabels(line, validGraphLabels);
    });

    return fixedSeries;
};

/**
 * Checks if the line has missing points, and fills them inץ
 */
const createLineWithFixedLabels = (
    lineWithMissingLabels: GraphLineDetails,
    validDataLabels: number[],
) => {
    const fixedData = validDataLabels.map((label) => {
        // Check if the current label exists on the line, and use its value. Otherwise,
        // it means that the current label is missing from the line, so we should add it.
        const pointForLabel = lineWithMissingLabels.data.find((point) => point[0] === label);
        const valueForLabel = pointForLabel?.[1] ?? 0;
        return [label, valueForLabel];
    });

    return {
        ...lineWithMissingLabels,
        data: fixedData,
    };
};

/**
 * Fills any missing Y values from a given a line. replaces any null/undefined with 0 value.
 */
const createLineWithFixedValues = (lineWithMissingValues: GraphLineDetails) => {
    const fixedData = lineWithMissingValues.data.map((point) => {
        const isPointValid = isYValueValid(point);
        return [point[0], isPointValid ? point[1] : 0];
    });

    return {
        ...lineWithMissingValues,
        data: fixedData,
    };
};

/**
 * Checks if a point within a graph line has a valid Y value. (not null/undefined/NaN)
 */
const isYValueValid = (point: number[]) => {
    const yValue = point && point[1];
    const isValid = yValue !== null && typeof yValue !== "undefined" && !isNaN(yValue);
    return isValid;
};
