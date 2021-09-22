import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import queryString from "querystring";
import { allTrackers } from "services/track/track";
import { PdfExportService } from "services/PdfExportService";

export const webSourceDisplayName = {
    MobileWeb: "Mobile web",
    Total: "All traffic",
    Desktop: "Desktop",
};

// the excel endPoint for all the non (POP + compare) modes.
export const defaultExcelEndPoint = "widgetApi/TrafficAndEngagement/EngagementOverview/Excel";

export const popCompareExcelEndPoint =
    "widgetApi/TrafficGrowthComparison/EngagementVisits/GraphExcel";
export const popCompareEndPoint = "widgetApi/TrafficGrowthComparison/EngagementVisits/Graph";
export const popSingleChartType = "ComparedLine";

// Disable Month granularity in 28 days mode
export const isTimeGranularityDisabled = (props, meta) => {
    const { is28Days } = meta;
    return is28Days && props.title === "M";
};

// Disable the Month granularity
export const isTimeGranularityDisabledOnlyMonth = ({ title }) => title === "D" || title === "W";

// define the most common use cases of graph type, in order to choose another type the GenericGraph instance
// should implement this method and compose it.
export const getChartType = (meta) => {
    const { isSingleMode, isOneWebSource } = meta;
    if (isSingleMode && !isOneWebSource) {
        return "area";
    }
    return "line";
};

// define the most common use cases of web source, in order to choose another one the GenericGraph instance
// should implement this method and compose it.
export const getWebSourceForApiPOP = ({ webSource, chartType }) => {
    if (chartType === "column" && webSource === "Total") {
        return "Combined";
    }
    return webSource;
};

export const getGetExcel = (prefix) => (apiParams) =>
    prefix + "?" + queryString.stringify(apiParams);

const getDateFormatter = (format) => ({ value }) => dayjs.utc(value).format(format);
export const dateFormatter = getDateFormatter("MMM YY");
export const minVisitsAbbrFormatter = ({ value }) => minVisitsAbbrFilter()(value);

export const getrInitPOPItemsSingleModeWebSources = ({ durations }) => [
    {
        name: durations[1],
        isSelected: true,
        color: colorsPalettes.orange[400],
        transparentColor: colorsPalettes.orange[200],
    },
    {
        name: durations[0],
        isSelected: true,
        color: colorsPalettes.blue[400],
        transparentColor: colorsPalettes.blue[200],
    },
];

export const webSources = [
    { name: "Desktop", isSelected: true, color: colorsPalettes.blue[400], alias: "Desktop" },
    { name: "Mobile Web", isSelected: true, color: colorsPalettes.sky[300], alias: "MobileWeb" },
    { name: "Total", isSelected: true, color: colorsPalettes.blue[400], alias: "Total" },
];

export const getDualCalculations = (isGAVerified = false) => {
    const i18nInstance = i18nFilter();
    return [
        {
            name: i18nInstance("wa.traffic.engagement.calculation.new"),
            isSelected: true,
            color: colorsPalettes.blue[400],
            alias: "newCalculation",
            isBeta: true,
        },
        {
            name: i18nInstance(
                isGAVerified
                    ? "wa.traffic.engagement.calculation.ga"
                    : "wa.traffic.engagement.calculation.current",
            ),
            isSelected: true,
            color: colorsPalettes.sky[300],
            alias: "currentCalculation",
        },
    ];
};

// for the rare case of columns vs area [ and not columns vs lines]
export const chartGranularityItemClickArea = (chartIndex) => {
    return chartIndex === 1 ? "area" : "column";
};

export const neverStacking = () => false;

export const pngDownload = (chartRef, fileName) => {
    setTimeout(() => pngDownloadInner(chartRef, fileName), 1000);
};

export const pngDownloadInner = (chartRef, fileName) => {
    allTrackers.trackEvent("Download", "submit-ok", `Over Time Graph/Engagement Overview/PNG`);
    const offSetX = 0;
    const offSetY = 105;
    const styleHTML = Array.from(document.querySelectorAll("style"))
        .map((stylesheet) => stylesheet.outerHTML)
        .join("");
    PdfExportService.downloadHtmlPngFedService(
        styleHTML + chartRef.outerHTML,
        fileName,
        chartRef.offsetWidth + offSetX,
        chartRef.offsetHeight + offSetY,
    );
};

export const addBetaBranchParam = (params, add = true, noGAVerified = true) =>
    add
        ? { ...params, beta: true, ...(noGAVerified ? { ShouldGetVerifiedData: false } : {}) }
        : params;
