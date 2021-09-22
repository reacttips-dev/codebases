import { colorsPalettes } from "@similarweb/styles";
import combineConfigs from "components/Chart/src/combineConfigs";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    percentageSignOnlyFilter,
    timeFilter,
} from "filters/ngFilters";
import dayjs from "dayjs";
import { changeTooltipFormatter } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChangeTooltip";
import { swSettings } from "common/services/swSettings";
import ChangeBellWithoutTooltip from "components/Chart/src/configs/plotLines/ChangeBellWithoutTooltip";

export const filtersList = {
    MobileWeb: ["Direct", "Email", "Referrals", "Social", "Display Ads", "Search"],
    Desktop: [
        "Direct",
        "Email",
        "Referrals",
        "Social",
        "Organic Search",
        "Paid Search",
        "Display Ads",
    ],
};
export const getYaxisFormat = (metric, value, isPercentage) => {
    if (isPercentage) {
        return percentageSignOnlyFilter()(value, 0);
    }
    switch (metric) {
        case "TrafficShare":
            return minVisitsAbbrFilter()(value);
        case "AverageDuration":
            return timeFilter()(value, null);
        case "PagesPerVisit":
            return numberFilter()(value, 2);
        case "BounceRate":
            return percentageSignFilter()(value, 2);
    }
};
export const getMetricTooltipHeader = (metric) => {
    switch (metric) {
        case "TrafficShare":
            return i18nFilter()("mmx.trafficshare.changetooltip.header");
        case "AverageDuration":
            return i18nFilter()("mmx.averageduration.changetooltip.header");
        case "PagesPerVisit":
            return i18nFilter()("mmx.pagespervisit.changetooltip.header");
        case "BounceRate":
            return i18nFilter()("mmx.bouncerate.changetooltip.header");
    }
};

const getChangeColor = (isDecrease, isNan) =>
    !isNan
        ? !isDecrease
            ? colorsPalettes.red.s100
            : colorsPalettes.green.s100
        : colorsPalettes.carbon[500];

export const getTooltip = (
    isPercent,
    metric,
    granularity,
    isMTDOn,
    mtdEndDate,
    periodDuration,
    isWindow,
) => {
    return {
        tooltip: {
            followPointer: false,
            shared: true,
            outside: true,
            useHTML: true,
            backgroundColor: colorsPalettes.carbon[0],
            borderWidth: 0,
            style: {
                fontFamily: "Roboto",
                margin: 0,
            },
            formatter: changeTooltipFormatter(
                metric,
                granularity,
                isMTDOn,
                mtdEndDate,
                isPercent,
                periodDuration,
                isWindow,
                metric === "BounceRate" ? getChangeColor : null,
            ),
        },
    };
};
const getZones = (granularity, data, isMTDOn, mtdEndDate, durationObject) => {
    const points = data[0]?.data;
    if (points) {
        const isPartial = () => {
            if (points.length > 1) {
                const from = dayjs(points[points.length - 1][0]);
                const to = isMTDOn
                    ? dayjs(mtdEndDate, "YYYY-MM-DD")
                    : dayjs(durationObject.forAPI.to, "YYYY-MM-DD");
                const toDate = from.clone().add(6, "days");
                return granularity === "Weekly"
                    ? !toDate.isSame(to, "day")
                    : !isMTDOn
                    ? false
                    : dayjs.utc(mtdEndDate).isAfter(swSettings.current.endDate);
            } else {
                return false;
            }
        };
        if (granularity !== "Daily") {
            return isPartial()
                ? [{ dashStyle: "Solid", value: points[points.length - 2][0] }]
                : [
                      {
                          dashStyle: "Solid",
                          value: points[points.length - 1][0],
                      },
                  ];
        }
        return [{ dashStyle: "Solid", value: points[points.length - 1][0] }];
    } else {
        return [];
    }
};
export const getChartConfig = (
    isPercentage,
    metric,
    granularity,
    isMTDOn,
    mtdEndDate,
    durationObject,
    isPoP,
    data,
    isDesktop,
    newMMXAlgoStartData,
) => {
    const { from, to, isWindow } = durationObject.forAPI;
    const start =
        dayjs(from, "YYYY-MM-DD").format("MMM YYYY") === dayjs(to, "YYYY-MM-DD").format("MMM YYYY");
    const currentGranularity = isWindow || start ? dailyIntervalConfig : monthlyIntervalConfig;
    const yAxisFormatter = ({ value }) => getYaxisFormat(metric, value, isPercentage);
    const xAxisFormatter = ({ value }) =>
        currentGranularity === monthlyIntervalConfig
            ? dayjs.utc(value).format("MMM YYYY")
            : dayjs.utc(value).format("DD MMM");
    const isPercent = isPercentage || metric === "BounceRate";
    const periodDuration = durationObject.raw.to.diff(durationObject.raw.from, "months");
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        noAnimationConfig,
        getTooltip(isPercent, metric, granularity, isMTDOn, mtdEndDate, periodDuration, isWindow),
        !isDesktop &&
            from !== dayjs(newMMXAlgoStartData).format("YYYY|MM|DD") &&
            ChangeBellWithoutTooltip(dayjs(newMMXAlgoStartData)),
        {
            chart: {
                height: 295,
                type: isPercentage ? "area" : "line",
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                style: {
                    fontFamily: "Roboto",
                },
            },
            plotOptions: {
                area: {
                    stacking: "percent",
                    fillOpacity: 1,
                },
                line: {
                    lineWidth: 2,
                    connectNulls: true,
                },
                series: {
                    dashStyle: "Dash",
                    marker: {
                        enabled:
                            granularity !== "Daily" &&
                            !(granularity === "Weekly" && periodDuration > 10) &&
                            !isPercentage,
                        symbol: "circle",
                    },
                    zoneAxis: "x",
                    zones: getZones(granularity, data, isMTDOn, mtdEndDate, durationObject),
                },
            },
            yAxis: {
                gridLineWidth: 0.5,
                showFirstLabel: true,
                showLastLabel: true,
                reversed: false,
                gridZIndex: 2,
                reversedStacks: true,
                tickPixelInterval: 50,
                plotLines: [
                    {
                        color: "#656565",
                        width: 2,
                        value: 0,
                    },
                ],
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        fontFamily: "Roboto",
                    },
                },
            },
            xAxis: {
                gridLineWidth: 0,
                gridLineDashStyle: "dash",
                tickLength: 5,
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
            },
        },
    ]);
};
