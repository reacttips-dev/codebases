import { colorsSets } from "@similarweb/styles";
import dayjs from "dayjs";
import combineConfigs from "../../../../.pro-features/components/Chart/src/combineConfigs";
import noLegendConfig from "../../../../.pro-features/components/Chart/src/configs/legend/noLegendConfig";
import sharedTooltip from "../../../../.pro-features/components/Chart/src/configs/tooltip/sharedTooltip";
import xAxisCrosshair from "../../../../.pro-features/components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { granularityConfigs } from "../../../pages/website-analysis/website-content/leading-folders/FolderAnalysisDefaults";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";

export const getChartConfig = ({
    type,
    filter,
    selectedVisualizationIndex,
    selectedGranularity,
    isPercentage,
    chartData = [],
}) => {
    const format = selectedGranularity !== "Monthly" ? "D MMM" : "MMM YYYY";
    const tooltipFormat =
        selectedGranularity === "Daily"
            ? "dddd, MMM DD, YYYY"
            : selectedGranularity === "Monthly"
            ? "MMM YYYY"
            : "MMM DD, YYYY";
    const currentGranularity = granularityConfigs[selectedGranularity];
    const yAxisFormatter = ({ value }) =>
        selectedVisualizationIndex === 1 ? filter[0]()(value, filter[1]) : `${value}%`;
    const xAxisFormatter = ({ value }) => dayjs.utc(value).format(format);
    const isOneDatePerItem = chartData.some((item) => {
        return item.data.length === 1;
    });
    const isMarkerEnabled =
        (!isPercentage && selectedGranularity !== "Daily") || (isPercentage && isOneDatePerItem);

    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        currentGranularity,
        noAnimationConfig,
        noLegendConfig,
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        xAxisCrosshair,
        sharedTooltip({ filter, xAxisFormat: tooltipFormat }),
        {
            chart: {
                height: null,
                type,
                spacingTop: 10,
                plotBackgroundColor: "transparent",
                events: {},
            },
            plotOptions: {
                series: {
                    turboThreshold: selectedGranularity === "Daily" ? 0 : 1000,
                    marker: {
                        enabled: isMarkerEnabled,
                        symbol: "circle",
                    },
                },
                area: {
                    stacking: "percent",
                    marker: {
                        enabled: isMarkerEnabled,
                    },
                },
                line: {
                    lineWidth: 2,
                    connectNulls: true,
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
                        color: "#919191",
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
                    },
                },
                minPadding: 0,
                maxPadding: 0,
            },
        },
    ]);
};

export const dateToUTC = (dateString) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10));
};

export const transformData = (data, percentage: boolean) => {
    const max = {};
    const finalData = Object.keys(data).map((chartKey: string, index) => {
        const color = colorsSets.c.toArray()[index];

        return {
            name: chartKey,
            color,
            data: data[chartKey].map((item: { Key: string; Value: number }, index) => {
                max[index] ? max[index].push(item.Value) : (max[index] = [item.Value]);
                return { x: dateToUTC(item.Key), y: item.Value };
            }),
        };
    });
    return percentage
        ? finalData.map((dataItem) => {
              return {
                  ...dataItem,
                  data: dataItem.data.map((item, index) => {
                      const groupSum: number = max[index].reduce((acc, val) => {
                          acc += val;
                          return acc;
                      }, 0);
                      return { ...item, y: item.y / groupSum };
                  }),
              };
          })
        : finalData;
};
