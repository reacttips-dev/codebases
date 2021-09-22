import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import { colorsPalettes } from "@similarweb/styles";
import ReactDOMServer from "react-dom/server";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { granularityItem, toggleItems } from "components/widget/widget-utilities/time-granularity";
import { ITabMd } from "pages/industry-analysis/overview/highLevelMetrics/tabsMD";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { ChartTooltip as BaseChartTooltip } from "./ChartTooltip";
import { IIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { PeriodOverPeriodChartTooltip } from "pages/industry-analysis/overview/highLevelMetrics/PeriodOverPeriodChartTooltip";
import { TooltipContainer } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";

export const getChartConfig = (
    chartType: string,
    timeGranularity: granularityItem,
    selectedMetric: ITabMd,
    industryAnalysisOverviewHighLevelMetricsContext: IIndustryAnalysisOverviewHighLevelMetricsContext,
) => {
    const { isPeriodOverPeriod } = industryAnalysisOverviewHighLevelMetricsContext;
    const isDaily = timeGranularity.value === toggleItems.Daily.value;
    const isMarkerEnabled = chartType !== chartTypes.AREA && isDaily;
    const isChartStacking = false;
    const currentGranularity = timeGranularity.intervalConfig;
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(timeGranularity.format);
    const yAxisFormatter = ({ value }) => selectedMetric.formatter(value);
    const ChartTooltip = isPeriodOverPeriod ? PeriodOverPeriodChartTooltip : BaseChartTooltip;
    const chartConfig = combineConfigs({ xAxisFormatter, yAxisFormatter }, [
        noLegendConfig,
        xAxisCrosshair,
        xAxisLabelsConfig,
        yAxisLabelsConfig,
        currentGranularity,
        {
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
                borderRadius: "6px",
                boxShadow: `0 6px 6px 0 ${colorsPalettes.carbon[200]}`,
                formatter: function () {
                    return ReactDOMServer.renderToString(
                        <TooltipContainer>
                            <ChartTooltip
                                points={this.points}
                                industryAnalysisOverviewHighLevelMetricsContext={
                                    industryAnalysisOverviewHighLevelMetricsContext
                                }
                            />
                        </TooltipContainer>,
                    );
                },
            },
            chart: {
                height: 295,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
                style: {
                    fontFamily: "Roboto",
                },
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    connectNulls: false,
                },
                area: {
                    stacking: "normal",
                },
                series: {
                    fillOpacity: 1,
                    marker: {
                        enabled: isMarkerEnabled,
                        symbol: "circle",
                    },
                    stacking: isChartStacking,
                    animation: true,
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
                labels: {
                    style: {
                        textTransform: "uppercase",
                        fontSize: "11px",
                        fontFamily: "Roboto",
                        color: colorsPalettes.carbon[200],
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
    return chartConfig;
};
