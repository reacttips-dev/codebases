import { useEffect, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import styled from "styled-components";
import Chart from "components/Chart/src/Chart";
import { Box } from "@similarweb/ui-components/dist/box";
import { Title } from "@similarweb/ui-components/dist/title";
import { fonts } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { DefaultFetchService } from "services/fetchService";
import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import YoutubeKeywordGeneratorChartTooltip from "pages/keyword-analysis/youtube-keyword-generator/YoutubeKeywordGeneratorChartTooltip";
import { commonOverTimeChartConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";

const fetchService = DefaultFetchService.getInstance();

const ChartContainer = styled(Box)`
    width: 100%;
    height: 248px;
    margin-bottom: 10px;
    padding: 20px 24px;
    box-sizing: border-box;
`;
const TitleStyled = styled(Title)`
    display: inline-flex;
    ${setFont({ $size: 20, $weight: 500, $family: fonts.$dmSansFontFamily })}
    margin-bottom: 20px;

    .SWReactIcons {
        margin: 0px 10px;
    }
`;

const CHART_ENDPOINT = "/api/recommendations/YoutubeKeywords/volumeTrend";
const CHART_TYPE = chartTypes.LINE;

const YoutubeKeywordGeneratorChart = ({ keyword, country }) => {
    const [chartData, setChartData] = useState<any>({});
    const [chartConfig, setChartConfig] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const i18n = i18nFilter();

    useEffect(() => {
        updateChartConfig();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetchService.get(
                    `${CHART_ENDPOINT}?${fetchService.requestParams({
                        keyword,
                        country,
                    })}`,
                );

                setChartData({
                    name: keyword,
                    data: Object.entries(response).map(([date, value]) => [
                        Date.parse(date),
                        value,
                    ]),
                });
                setIsLoading(false);
            } catch (ex) {
                setIsLoading(false);
            }
        })();
    }, [keyword, country]);

    const updateChartConfig = () => {
        const xAxisFormatter = ({ value }) => dayjs.utc(value).utc().format("MMM YY");
        const config = combineConfigs(
            { type: CHART_TYPE, xAxisFormatter, yAxisFormatter: ({ value }) => value },
            [
                monthlyIntervalConfig,
                noLegendConfig,
                yAxisLabelsConfig,
                xAxisLabelsConfig,
                xAxisCrosshair,
                commonOverTimeChartConfigSingle,
                YoutubeKeywordGeneratorChartTooltip,
                {
                    colors: [colorsPalettes.blue[400]],
                    chart: {
                        height: 160,
                        type: CHART_TYPE,
                        spacingTop: 10,
                        plotBackgroundColor: "transparent",
                        events: {},
                    },
                    plotOptions: {
                        line: {
                            lineWidth: 2,
                            connectNulls: false,
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
            ],
        );
        setChartConfig(config);
    };

    if (!isLoading && !chartData?.data?.length) {
        return <></>;
    }

    return (
        <ChartContainer>
            <TitleStyled>
                {i18n("youtube.keyword.generator.chart.volume.trend.title", { keyword })}
                <PlainTooltip
                    placement="top"
                    tooltipContent={i18n("youtube.keyword.generator.chart.tooltip.text")}
                >
                    <span>
                        <SWReactIcons iconName="info" size="xs" />
                    </span>
                </PlainTooltip>
            </TitleStyled>
            {isLoading ? (
                <GraphLoader width="100%" height="160px" />
            ) : (
                <Chart type={CHART_TYPE} config={chartConfig} data={[chartData]} />
            )}
        </ChartContainer>
    );
};

const mapStateToProps = ({ routing: { params } }) => {
    return params;
};

const connected = connect(mapStateToProps)(YoutubeKeywordGeneratorChart);
export default connected;
