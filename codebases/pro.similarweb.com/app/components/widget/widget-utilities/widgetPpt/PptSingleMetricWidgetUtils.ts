import { dynamicFilterFilter } from "filters/dynamicFilter";
import {
    PptSingleMetricType,
    IPptSingleMetricChartData,
} from "services/PptExportService/PptExportServiceTypes";
import { resolveYAxisFormat } from "./PptWidgetUtils";

const dynamicFilter = dynamicFilterFilter();

/**
 * Formats money values. this is used with the CPC singleMetric widgets. (keyword analysis)
 */
const moneyFilter = (value: string, defaultValue = "N/A") => {
    // In case the value consists of money range ("X - Y"), then we format
    // each of the values in the range.
    const isPriceRange = value.includes(" - ");
    if (isPriceRange) {
        const formattedRange = value
            .split("-")
            .map((val) => `$${val?.trim() ?? defaultValue}`)
            .join(" - ");
        return formattedRange;
    }

    return `$${value || defaultValue}`;
};

type SingleMetricRecordDetails = {
    displayName: string;
    field: string;
    format: string;
    ppt?: {
        overrideFormat?: string;
        ignoreRow?: boolean;
    };
};

export const resolveSingleMetricType = (widget: any): PptSingleMetricType | undefined => {
    const widgetRows: SingleMetricRecordDetails[] = widget.metadata.rows;

    // Check how many visible data records this widget has (a visible row is a data row
    // that did not instruct the ppt service to ignore it)
    const visibleRows = widgetRows.filter((x) => {
        const shouldIgnoreRow = x.ppt?.ignoreRow ?? false;
        return !shouldIgnoreRow;
    });

    // In case the widget contains a trend field, then it's a trend widget.
    const hasTrendField = visibleRows.some((row) => row.field.toLowerCase() === "trend");
    if (hasTrendField) return "trend";

    // In case the widget contains a single data row - then it's a singleNumber widget
    return visibleRows.length === 1 ? "singleNumber" : null;
};

export const adaptSingleMetricRecords = (
    data: Record<string, string>,
    recordDetails: SingleMetricRecordDetails[],
) => {
    const recordsToAdapt = _filterUnusedRecords(recordDetails);
    return recordsToAdapt.map((record) => {
        const { displayName, field, format, ppt } = record;
        const recordFormat = ppt?.overrideFormat ?? format;

        return {
            recordName: displayName,
            value: _formatSingleMetricRecordValue(data[field], recordFormat),
        };
    });
};

export const adaptSingleMetricChart = (type: PptSingleMetricType, widget: any) => {
    switch (type) {
        case "trend":
            return _adaptSingleMetricTrendChart(widget.data, widget.metadata.rows);
        case "singleNumber":
        default:
            return undefined;
    }
};

const _adaptSingleMetricTrendChart = (
    data: Record<string, string | string[]>,
    recordDetails: SingleMetricRecordDetails[],
): IPptSingleMetricChartData => {
    // The trend chart data format will always match the format of the metric's first record
    // no idea why they did it like that, that's how the data is structured ¯\_(ツ)_/¯
    const firstRecord = _filterUnusedRecords(recordDetails)[0];
    const trendChartRecord = _getTrendRecord(recordDetails);
    const trendChartData = data[trendChartRecord.field] as string[];

    return {
        values: trendChartData,
        format: resolveYAxisFormat(firstRecord.format),
    };
};

const _getTrendRecord = (recordDetails: SingleMetricRecordDetails[]): SingleMetricRecordDetails => {
    return recordDetails.find((record) => record.field.toLowerCase().trim() === "trend");
};

const _filterUnusedRecords = (
    recordDetails: SingleMetricRecordDetails[],
): SingleMetricRecordDetails[] => {
    return recordDetails
        .filter((record) => record.field.toLowerCase().trim() !== "trend")
        .filter((record) => {
            const shouldIgnoreRecord = record.ppt?.ignoreRow ?? false;
            return !shouldIgnoreRecord;
        });
};

/**
 * Type guard for numerical values
 * @param value The current cell value to check whether its a number or not
 */
const _isNumericValue = (value: unknown): value is number => {
    const floatValue = Number.parseFloat(value as string);
    const isNumber = !Number.isNaN(floatValue);
    return isNumber;
};

/**
 * Checks if the given table cell value is a numerical value that represents percent
 * and if that value is 0%, or very close to 0% (below 0.0001)
 * @param value The current table cell value to inspect
 * @param cellFormat The current table cell format
 */
const _isZeroPercentValue = (value: unknown, cellFormat: string): boolean => {
    const isPercent = cellFormat.toLowerCase().indexOf("percent") !== -1;
    if (!isPercent) return false;

    const isNumericValue = _isNumericValue(value);
    if (!isNumericValue) return false;

    const isZeroPercent = isPercent && Math.abs(value as number) < 0.0001;
    return isZeroPercent;
};

export const _formatSingleMetricRecordValue = (
    value: string,
    format: string,
    defaultValue = "N/A",
) => {
    const isFormattable = typeof value !== "undefined";
    if (!isFormattable) return defaultValue;

    /**
     * the ng dynamic filter returns N/A whenever it encounters a 0 value. this is problematic
     * in case we have a percentage value that is 0%. in such cases - we want to explicitly
     * return 0% and bypass the dynamic filter.
     */
    const isZeroPercent = _isZeroPercentValue(value, format);
    if (isZeroPercent) return "0%";

    /**
     * Boolean values usually have a cell format of "none", and a string value of "true" | "false"
     * the ng-dynamic filter returns N/A whenever it encounters a "false" value. therefore - we want
     * to explicitliy return the boolean value when it's falsy, with no filter applied.
     */
    const isBoolValue = `${value}`.toLowerCase() === "true" || `${value}`.toLowerCase() === "false";
    if (isBoolValue) return `${value}`;

    if (format === "cpc") {
        return moneyFilter(value, defaultValue);
    }

    return dynamicFilter(value, format, defaultValue);
};
