import { abbrNumberFilter, percentageSignFilter } from "filters/ngFilters";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import watermark from "components/Chart/src/configs/watermark/watermark";
import tooltipPositioner from "components/Chart/src/configs/tooltip/tooltipPositioner";
import dayjs from "dayjs";
import { colorsPalettes } from "@similarweb/styles";
import { ChartTooltip } from "pages/keyword-analysis/common/ChartTooltip";
import ReactDOMServer from "react-dom/server";
import { swSettings } from "common/services/swSettings";
import { ICategoryShareServices } from "pages/industry-analysis/category-share/CategoryShareTypes";
import {
    WebSourceType,
    DataGranularity,
} from "pages/industry-analysis/category-share/CategoryShareTypes";
import { DataTypeSwitcherEnum } from "../CategoryShareGraphTypes";
import { resolveLastSupportedDate } from "./CategoryShareGraphUtils";

/**
 * Resolves the y axis formatter, according to the data type.
 * data could be either share (percent), or visits (number)
 * @param dataType the current graph data type (share/visits)
 * @param percentAccuracy In case the graph data type is visits,
 * this number sets the number of digits after decimal point
 */
const resolveYAxisFormatter = (dataType: DataTypeSwitcherEnum, percentAccuracy?: number) => {
    switch (dataType) {
        case DataTypeSwitcherEnum.NUMBER:
            return ({ value }) => abbrNumberFilter()(value);
        case DataTypeSwitcherEnum.PERCENT:
        default:
            return ({ value }) => percentageSignFilter()(value, percentAccuracy);
    }
};

export const buildCategoryShareGraphConfig = (props: {
    webSource: WebSourceType;
    granularity: DataGranularity;
    dataType: DataTypeSwitcherEnum;
    isMonthToDateEnabled: boolean;
    duration: string;
    services: ICategoryShareServices;
}) => {
    const { webSource, granularity, dataType, duration, isMonthToDateEnabled, services } = props;
    if (!webSource || !granularity || !duration) return null;

    const lastSupportedDate = resolveLastSupportedDate(duration, isMonthToDateEnabled, services);

    const format = granularity === "Monthly" ? "MMM YY" : "DD MMM";
    const yAxisFormatter = resolveYAxisFormatter(dataType, 0);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        noLegendConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        getIntervalConfig(granularity),
        getTooltipConfig(granularity, dataType, lastSupportedDate),
        tooltipPositioner(),
        watermark,
        getChartConfig(webSource, dataType, yAxisFormatter),
    ]);
};

const getIntervalConfig = (timeGranularity: DataGranularity) => {
    switch (timeGranularity) {
        case "Monthly":
            return monthlyIntervalConfig;
        case "Weekly":
            return weeklyIntervalConfig;
        case "Daily":
        default:
            return dailyIntervalConfig;
    }
};

const getTooltipConfig = (
    timeGranularity: DataGranularity,
    dataType: DataTypeSwitcherEnum,
    lastSupportedDate: string,
) => {
    return {
        tooltip: {
            shared: true,
            outside: false,
            useHTML: true,
            backgroundColor: colorsPalettes.carbon[0],
            style: {
                fontFamily: "Roboto",
                margin: 0,
            },
            borderWidth: 0,
            borderRadius: "6px",
            boxShadow: `0 6px 6px 0 ${colorsPalettes.carbon[200]}`,
            formatter: function () {
                return ReactDOMServer.renderToString(
                    <ChartTooltip
                        timeGranularity={timeGranularity}
                        points={this.points}
                        yFormatter={resolveYAxisFormatter(dataType, 2)}
                        lastSupportedDate={lastSupportedDate}
                        shouldSkipSorting={true}
                        othersDomainPointPosition={"top"}
                    />,
                );
            },
        },
    };
};

const getChartConfig = (
    webSource: WebSourceType,
    dataType: DataTypeSwitcherEnum,
    yAxisFormatter: ({ value: any }) => string,
) => {
    const isPercent = dataType === DataTypeSwitcherEnum.PERCENT;

    return {
        chart: {
            height: 462,
            spacingTop: 10,
            marginTop: 27,
            plotBackgroundColor: "transparent",
            style: {
                fontFamily: "Roboto",
            },
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                },
                stacking: "normal",
                connectNulls: true,
                fillOpacity: 1,
                lineWidth: 0.5,
            },
            series: {
                fillOpacity: 1,
                animation: true,
            },
        },
        yAxis: [
            {
                labels: {
                    formatter: yAxisFormatter,
                },
                title: {
                    text: null,
                },
                gridLineColor: "rgba(200,200,200,0.4)",
                gridLineWidth: 1,
                gridLineDashStyle: "solid",
                lineWidth: 0,
                reversed: false,
                allowDecimals: true,
                startOnTick: false,
                endOnTick: true,
                tickPositioner: null,
                gridZIndex: 4,
                showFirstLabel: false,
                showLastLabel: true,
                ceiling: isPercent ? 1 : null,
                isDirty: true,
                min: 0,
                // max: isPercent ? 1 : null,
            },
            {
                labels: {
                    enabled: false,
                },
                title: {
                    text: null,
                },
                gridLineColor: "rgba(200,200,200,0.4)",
                gridLineWidth: 1,
                gridLineDashStyle: "solid",
                lineWidth: 0,
                reversed: false,
                allowDecimals: true,
                startOnTick: false,
                endOnTick: true,
                tickPositioner: null,
                gridZIndex: 4,
                showFirstLabel: false,
                showLastLabel: true,
                ceiling: 1,
                isDirty: true,
                min: 0,
            },
        ],
        xAxis: {
            gridLineWidth: 0,
            gridLineDashStyle: "dash",
            labels: {
                style: {
                    textTransform: "capitalize",
                    fontSize: "11px",
                    color: "#919191",
                    fontFamily: "Roboto",
                },
            },
            minPadding: 0,
            maxPadding: 0,
            type: "datetime",
            plotLines: getPlotLineIndicators(webSource),
        },
        stacked: true,
    };
};

const getPlotLineIndicators = (webSource: WebSourceType) => {
    const indicators = [];

    indicators.push({
        value: dayjs.utc(swSettings.getDataIndicators("KEYWORDS_ALGO_CHANGE")).valueOf(),
        color: "#D4D8DC",
        dashStyle: "Dash",
        id: "plotLine-kw-algochange",
        label: {
            rotation: 0,
            text: `<span class="mobileweb-algorithm-marker"><div id="custom-tooltip"  class="mobileweb-algorithm mobileweb-algorithm--left"><div class="mobile-algorithm-date">Keyword Algorithm Update</div><div class="mobile-algorithm-text">Starting December 2018 we've improved our traffic algorithm for keyword analysis, resulting in even more accurate estimations. Consequently, for some keywords you may see a jump in traffic between Nov-Dec.</div></div></span>`,
            useHTML: true,
            verticalAlign: "bottom",
            x: -10,
            y: 3,
        },
        left: 12,
        width: 1,
        zIndex: 5,
    });
    if (webSource === "MobileWeb") {
        const date = swSettings.getDataIndicators("KEYWORDS_MOBILE_ALGO_CHANGE");
        indicators.push({
            value: dayjs.utc(date).valueOf(),
            width: 1,
            dashStyle: "Dash",
            left: 12,
            label: {
                useHTML: true,
                x: -10,
                y: 3,
                rotation: 0,
                verticalAlign: "bottom",
                text:
                    // eslint-disable-next-line max-len
                    '<span class="mobileweb-algorithm-marker"><div id="custom-tooltip" class="mobileweb-algorithm mobileweb-algorithm--right">`                    <div class="mobile-algorithm-date">Algorithm Update</div>\n                    <div class="mobile-algorithm-text">Starting February 1st we’ve improved our traffic algorithm for mobile keyword analysis, resulting in even more accurate estimations. Consequently, for some keywords you may see a jump in traffic between Jan-Feb.</div>\n            </div>\n        </span>\n        ',
            },
            color: "#D4D8DC",
            id: "plotLine-kw-algochange",
            zIndex: 5,
        });
    }

    return indicators;
};
