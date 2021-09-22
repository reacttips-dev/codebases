import { toggleItems } from "components/widget/widget-utilities/time-granularity";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import ReactDOMServer from "react-dom/server";
import { TooltipContainer } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { percentageSignFilter } from "filters/ngFilters";
import { EChartViewType, ICompetitiveTrackerHighLevelMetricsContext } from "../context/types";
import { CompetitiveTrackingChartTooltip } from "./CompetitiveTrackingChartTooltip";

export const getCompetitiveTrackingChartConfig = (
    competitiveTrackerHighLevelMetricsContext: ICompetitiveTrackerHighLevelMetricsContext,
) => {
    const { chartType, selectedMetric, chartViewType } = competitiveTrackerHighLevelMetricsContext;
    const { formatter } = selectedMetric;
    const isMarkerEnabled = chartType !== chartTypes.AREA;
    const isChartStacking = false;
    const currentGranularity = monthlyIntervalConfig;
    const isPercentageView = chartViewType === EChartViewType.PERCENTAGE;
    const yAxisFormatter = ({ value }) =>
        isPercentageView ? percentageSignFilter()(value, 2) : formatter(value);
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format("MMM YY");
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
                            <CompetitiveTrackingChartTooltip
                                points={this.points?.reverse()}
                                competitiveTrackerHighLevelMetricsContext={
                                    competitiveTrackerHighLevelMetricsContext
                                }
                            />
                        </TooltipContainer>,
                    );
                },
            },
            chart: {
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
                ...(isPercentageView && { max: 1 }),
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
