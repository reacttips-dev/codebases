import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";
import { percentageSignFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import watermark from "components/Chart/src/configs/watermark/watermark";
import { swSettings } from "common/services/swSettings";
import tooltipPositioner from "components/Chart/src/configs/tooltip/tooltipPositioner";
import { ChartTooltip } from "pages/keyword-analysis/common/ChartTooltip";
import {
    EGraphGranularities,
    graphGranularityToString,
} from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import ReactDOMServer from "react-dom/server";
import { colorsPalettes } from "@similarweb/styles";

const getIntervalConfig = (timeGranularity) => {
    if (timeGranularity === EGraphGranularities.MONTHLY) {
        return monthlyIntervalConfig;
    }
    if (timeGranularity === EGraphGranularities.WEEKLY) {
        return weeklyIntervalConfig;
    }
    return dailyIntervalConfig;
};

export const getBaseChartConfig = ({ webSource, timeGranularity, lastSupportedDate }) => {
    const format = timeGranularity === EGraphGranularities.MONTHLY ? "MMM YY" : "DD MMM";
    const yAxisFormatter = ({ value }) => percentageSignFilter()(value, 0);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);
    return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
        noLegendConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        getIntervalConfig(timeGranularity),
        {
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
                            timeGranularity={graphGranularityToString[timeGranularity]}
                            points={this.points}
                            yFormatter={({ value }) => percentageSignFilter()(value, 2)}
                            lastSupportedDate={lastSupportedDate}
                        />,
                    );
                },
            },
        },
        tooltipPositioner(),
        watermark,
        {
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
                    ceiling: 1,
                    isDirty: true,
                    min: 0,
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
            export: {
                title: "Traffic distribution",
                csvUrl:
                    // eslint-disable-next-line max-len
                    "/widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/TrafficDistributionExcel?country=840&includeSubDomains=true&webSource=Desktop&timeGranularity=Monthly&to=2020%7C06%7C30&from=2020%7C04%7C01&isWindow=false&keys=iphone&sites=theverge.com%2C9to5mac.com%2Ctomsguide.com%2Cfaqtoids.com%2Cwikipedia.org%2Cen.wikipedia.org%2Czh.wikipedia.org%2Cru.wikipedia.org%2Cja.wikipedia.org%2Car.wikipedia.org%2Ces.wikipedia.org%2Cfa.wikipedia.org%2Cid.wikipedia.org%2Cnl.wikipedia.org%2Csimple.wikipedia.org%2Clife123.com%2Ccnet.com%2Cflipgrid.com%2Cforbes.com%2Capple.com%2Csupport.apple.com%2Cdiscussions.apple.com%2Capps.apple.com",
            },
        },
    ]);
};

const getPlotLineIndicators = (webSource) => {
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
