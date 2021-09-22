/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    PptMetricDataFormat,
    PptMetricType,
} from "services/PptExportService/PptExportServiceTypes";

export const getWidgetTitle = (widget: any): string => {
    return widget._viewData.title?.trim();
};

export const getWidgetSubtitleForModal = (widget: any): string => {
    const entities = `${getWidgetEntities(widget).join(", ")}`;
    const country = `${widget._viewData.country.text}`;
    return `${entities} • ${country}`;
};

export const getWidgetSubtitle = (
    widget: any,
    options: { showDuration?: boolean; showEntities?: boolean } = {},
) => {
    const { showDuration = true, showEntities = true } = options;
    const showWebSource = widget._widgetModel.webSource && widget._widgetModel.webSource.length > 0;

    const entities = showEntities ? `${getWidgetEntities(widget).join(" vs. ")}, ` : "";
    const duration = showDuration ? `${widget._viewData.duration}, ` : "";
    const websource = showWebSource ? `${_resolveWebSource(widget._widgetModel.webSource)}, ` : ``;
    const country = `${widget._viewData.country.text}`;
    return `${entities}${duration}${websource}${country}`;
};

export const getWidgetPptMetricType = (metricType: string): PptMetricType => {
    switch (metricType) {
        case "SingleMetric":
            return "single";
        case "PieChart":
            return "pie";
        case "Graph":
            return "line";
        case "BarChart":
            return "bar";
        case "Table":
            return "table";

        default:
            return null;
    }
};

export const getYAxisFormat = (widget: any): PptMetricDataFormat => {
    const widgetFormat = widget._metricTypeConfig?.y_axis?.format || widget._defaultDataFormat;
    return resolveYAxisFormat(widgetFormat);
};

export const resolveYAxisFormat = (rawFormat: string): PptMetricDataFormat => {
    switch (rawFormat) {
        case "number":
        case "minVisitsAbbr":
        case "abbrNumberVisits":
        case "abbrNumber":
        case "decimalNumber":
            return "number";

        case "percent":
        case "percentagesign":
        case "smallNumbersPercentage":
        case "change":
            return "percent";

        case "time":
            return "duration";

        default:
            return null;
    }
};

/**
 * Adds a GA Marker for the legend name. this is used to indicate if the current
 * data record / data series is Google Analytics verified data.
 * @param value The current legend name
 * @param isGAVerified boolean flag indicating whether we have GA verified data or not
 */
export const augmentNameWithGAMark = (value: string | string[], isGAVerified: boolean) => {
    if (Array.isArray(value)) return value;
    return isGAVerified ? `${value} (GA)` : value;
};

export const getWidgetEntities = (widget: any): string[] => {
    const entities = widget._viewData?.key?.map((entity: { name: string }) => entity.name);
    return entities;
};

const _resolveWebSource = (sourceKey: string) => {
    switch (sourceKey) {
        case "Desktop":
            return "Desktop Traffic";

        case "MobileWeb":
            return "Mobile Traffic";

        case "Total":
            return "All Traffic";

        default:
            return "";
    }
};
