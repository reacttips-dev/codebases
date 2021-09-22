import { colorsPalettes } from "@similarweb/styles";
import Chart from "components/Chart/src/Chart";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { PoPCompareChangeTooltip } from "components/PoPCompareChangeTooltip/PoPCompareChangeTooltip";
import { i18nFilter, yAxisChangeFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { getYaxisFormat } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartConfig";
import ReactDOMServer from "react-dom/server";
import { compose } from "redux";
import { formatDate } from "utils";
import { tooltipPositioner } from "pages/website-analysis/traffic-sources/mmx/components/popCompareTooltipPositioner";
import { trafficSources as trafficSourcesDefinitons } from "Shared/utils";
import { PoPChartWrapper } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
interface IChannelSeries {
    [key: string]: {
        [key: string]: ISeries[];
    };
}

interface ISeries {
    Change: number[];
    Values: Array<{
        Key: string;
        Value: number;
    }>;
}

interface IDataSeries {
    data: any;
    name: string;
    visible?: boolean;
}

const generateChartData = (
    type: string,
    chartTitles: string[],
    chartDataSeries: IChannelSeries,
    webSource: string,
) => {
    if (type === "column") {
        return generateColumnChartData(chartTitles, chartDataSeries, webSource);
    }
};

const generateColumnChartData = (
    chartTitles: string[],
    dataSeries: IChannelSeries,
    webSource: string,
): IDataSeries[] => {
    const arr: IDataSeries[] = [];
    chartTitles.forEach((site) => {
        if (dataSeries[site]) {
            arr.push({
                name: site,
                data: dataSeries[site][webSource].map((item) => ({
                    y: item.Change[0],
                    comparedDate: dayjs.utc(item.Values[1].Key).valueOf(),
                    values: item.Values,
                    name: item.Values[0].Key
                        ? dayjs.utc(item.Values[0].Key).utc().format("MMM")
                        : "N/A",
                })),
            });
        }
    });
    return arr;
};

export const ChannelAnalysisPoPCompare = ({
    type,
    data,
    postProcessChartData = _.identity as <T, K extends T = T>(arg: T) => K,
    webSource,
    dropdownFilter,
    metric,
    isPercentage,
}) => {
    const titles = Object.keys(data);

    const chartData = compose(postProcessChartData, generateChartData)(
        type,
        titles,
        data,
        webSource,
    );

    const translateSourceText = (source) => {
        return i18nFilter()(trafficSourcesDefinitons[source].title);
    };

    const getChangeTooltip = () => {
        const PoPChangeTooltipFormatter = (props) => {
            const regularDate = formatDate(
                props.pointsData[0].point.values[0].Key,
                null,
                "MMM YYYY",
            );
            const comparedDate = formatDate(
                props.pointsData[0].point.values[1].Key,
                null,
                "MMM YYYY",
            );
            const yAxisFormatter = ({ value }) => getYaxisFormat(metric, value, isPercentage);

            return (
                <PoPCompareChangeTooltip
                    headersList={["Domain", comparedDate, regularDate, "Change"]}
                    title={`${translateSourceText(props.dropdownFilter)} traffic`}
                    pointsData={props.pointsData}
                    yFormatter={yAxisFormatter}
                    changeFormatter={yAxisChangeFilter}
                    invertColors={metric === "BounceRate"}
                />
            );
        };

        return {
            tooltip: {
                formatter: function () {
                    return ReactDOMServer.renderToString(
                        PoPChangeTooltipFormatter({ pointsData: this.points, dropdownFilter }),
                    );
                },
            },
        };
    };

    ///////////// Chart Configuration //////////////////

    const yAxisFormatter = ({ value }) => yAxisChangeFilter()(value, 0, 50);

    const defaultXAxisFormatter = ({ value }) => value;

    const getMaxYAxisValue = () => {
        const maxValue = Math.max(
            ...chartData
                .filter((item) => item.visible)
                .flatMap((item) => item.data.map((data) => data.y)),
        );
        return maxValue >= 50 ? 50 : maxValue;
    };

    const getMinYAxisValue = () => {
        const minValue = Math.min(
            ...chartData
                .filter((item) => item?.visible)
                .flatMap((item) => item.data?.map((data) => data.y)),
        );
        return minValue > 0 ? 0 : minValue;
    };

    const chartConfig = combineConfigs({ yAxisFormatter, xAxisFormatter: defaultXAxisFormatter }, [
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        noLegendConfig,
        xAxisCrosshair,
        getChangeTooltip,
        {
            chart: {
                zoomType: null,
            },
            yAxis: {
                min: getMinYAxisValue(),
                max: getMaxYAxisValue(),
            },
            xAxis: {
                type: "category",
                crosshair: true,
            },
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
                positioner: tooltipPositioner,
            },
            plotOptions: {
                column: {
                    marker: {
                        enabled: false,
                    },
                },
            },
        },
    ]);

    return (
        <PoPChartWrapper className="chartContainer">
            <Chart type={type} data={chartData} config={chartConfig} />
        </PoPChartWrapper>
    );
};

ChannelAnalysisPoPCompare.displayName = "ChannelAnalysisPoPCompare";

/**
 * @example input
 * {
 *     {
 *      BreakDown: { <channel>: { <date>: value ... } },
 *      Total: { <channel>: value },
 *      comparedData: { BreakDown: { <channel>: { <date>: value ... }, Total: { <channel>: value } } }
 *     },
 * }
 * @example output
 * <Channel>: {
 * Desktop: [
    {
        Values: [
            {
                Key: "2018-08-01",
                Value: 11.923214058330537
            },
            {
                Key: "2018-05-01",
                Value: 11.91976964495465
            }
        ],
        Change: [
            0.0002889664379835016
        ]
    }
    ]}
 *
 * @param data
 */
export function adaptCompareData(data, webSource) {
    const regularData = data?.BreakDown;
    const comparedData = data?.comparedData?.BreakDown;

    if (!regularData || !comparedData) return data;

    const parsedData = {};

    const allComparedChannels = Object.keys(
        Object.keys(comparedData).reduce((channels, date) => {
            return { ...channels, ...comparedData[date] };
        }, {}),
    );

    const allRegularChannels = Object.keys(
        Object.keys(regularData).reduce((channels, date) => {
            return { ...channels, ...regularData[date] };
        }, {}),
    );

    const allChannels = Array.from(new Set(allComparedChannels.concat(allRegularChannels)));

    allChannels.forEach((channel) => {
        const channelValues = [];
        const regularValues = [];
        const comparedValues = [];

        Object.keys(regularData).forEach((date) => {
            regularValues.push({
                Key: date,
                Value: regularData[date]
                    ? regularData[date][channel]
                        ? regularData[date][channel]
                        : 0
                    : 0,
            });
        });

        Object.keys(comparedData).forEach((date) => {
            comparedValues.push({
                Key: date,
                Value: comparedData[date]
                    ? comparedData[date][channel]
                        ? comparedData[date][channel]
                        : 0
                    : 0,
            });
        });

        for (let i = 0; i < regularValues.length && i < comparedValues.length; ++i) {
            const change =
                comparedValues[i].Value === 0 || !comparedValues[i].Value
                    ? [0]
                    : [regularValues[i].Value / comparedValues[i].Value - 1];

            channelValues.push({
                Values: [regularValues[i], comparedValues[i]],
                Change: change,
            });
        }

        parsedData[channel] = {
            [webSource]: channelValues,
        };
    });

    return parsedData;
}
