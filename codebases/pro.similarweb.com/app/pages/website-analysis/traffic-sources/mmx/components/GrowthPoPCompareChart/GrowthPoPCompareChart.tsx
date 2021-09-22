import { colorsPalettes } from "@similarweb/styles";
import Chart from "components/Chart/src/Chart";
import combineConfigs from "components/Chart/src/combineConfigs";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { i18nFilter, yAxisChangeFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { trafficSources as trafficSourcesDefinitons } from "Shared/utils";
import ReactDOMServer from "react-dom/server";
import { getYaxisFormat } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartConfig";
import { PoPCompareChangeTooltip } from "components/PoPCompareChangeTooltip/PoPCompareChangeTooltip";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Legends } from "components/React/Legends/Legends";
import { tooltipPositioner } from "pages/website-analysis/traffic-sources/mmx/components/popCompareTooltipPositioner";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled, { createGlobalStyle } from "styled-components";

interface IGrowthPoPCompareChart {
    chartRawData: {
        Data: [];
        ComparedData: [];
    };
    chosenSites: [];
    getSiteColor: any;
    durations: any;
}

const ChartLegendContainer: any = styled.div`
    padding-top: 24px;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
`;
ChartLegendContainer.displayName = "ChartLegendContainer";

const ChartContainer: any = styled.div`
    padding-top: 24px;
`;
ChartContainer.displayName = "ChartLegendContainer";

const GlobalStyle = createGlobalStyle`
  .highcharts-tooltip-container{
    z-index: 9999 !important;
  }
`;

export const GrowthPoPCompareChart: React.FC<IGrowthPoPCompareChart> = ({
    chartRawData,
    chosenSites,
    getSiteColor,
    durations,
}) => {
    const [hiddenLegends, setHiddenLegends] = useState([]);

    const translateSourceText = (source) => {
        return i18nFilter()(trafficSourcesDefinitons[source].title);
    };

    const PoPChangeTooltipContainer = (props) => {
        const tooltipFormatter = ({ value }) => getYaxisFormat("TrafficShare", value, false);
        return (
            <PoPCompareChangeTooltip
                headersList={["Domain", durations[0], durations[1], "Change"]}
                title={`${translateSourceText(props.pointsData[0].key)} traffic`}
                pointsData={props.pointsData}
                yFormatter={tooltipFormatter}
                changeFormatter={yAxisChangeFilter}
                cellWidth={100}
            />
        );
    };

    const extractPoPCompareDataPerWebsite = (data, website) => {
        const regularData = data.Data[website] ?? null;
        const comparedData = data.ComparedData[website] ?? null;

        if (!regularData || !comparedData) {
            return null;
        }

        // sorting and applying translations for bars
        const channels = _.union(Object.keys(regularData), Object.keys(comparedData))
            .filter((channel) => {
                return trafficSourcesDefinitons.hasOwnProperty(channel);
            })
            .sort((ch1, ch2) => {
                return (
                    trafficSourcesDefinitons[ch1].priority - trafficSourcesDefinitons[ch2].priority
                );
            })
            .map((channel) => ({ key: channel, name: translateSourceText(channel) }));

        return channels.reduce((acc, { key, name }) => {
            const regular = regularData[key] ?? 0;
            const compared = comparedData[key] ?? 0;
            acc.push({
                Values: [
                    { Key: name, Value: regular },
                    { Key: name, Value: compared },
                ],
                Change:
                    compared === 0
                        ? [(regular + 5000) / (compared + 5000) - 1] // represents Infinite change
                        : [regular / compared - 1],
            });
            return acc;
        }, []);
    };

    const parseChartRawData = (chartRawData, chosenSites) => {
        const allData = {};
        chosenSites.map((website) => {
            allData[website] = extractPoPCompareDataPerWebsite(chartRawData, website);
        });
        return adaptCompareData(allData);
    };

    const adaptCompareData = (dataSeries) => {
        const series = [];
        Object.keys(dataSeries).map((website) => {
            const channels = dataSeries[website] ?? [];
            series.push({
                name: website,
                visible: hiddenLegends.find((legend) => legend.name === website)?.visible ?? true,
                color: getSiteColor(website),
                data: channels.map((channel) => ({
                    y: channel && channel.Change ? channel?.Change[0] : null,
                    name: channel.Values[0].Key ?? null,
                    values: channel.Values,
                })),
            });
        });
        return series;
    };

    const chartData = parseChartRawData(chartRawData, chosenSites);

    const getLegendItems = () => {
        return chartData.map((item) => {
            return {
                name: item.name,
                visible: item.visible,
                color: item.color,
            };
        });
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
                .filter((item) => item.visible)
                .flatMap((item) => item.data.map((data) => data.y)),
        );
        return minValue > 0 ? 0 : minValue;
    };

    const chartConfig = combineConfigs({ yAxisFormatter, xAxisFormatter: defaultXAxisFormatter }, [
        yAxisLabelsConfig,
        xAxisLabelsConfig,
        noLegendConfig,
        xAxisCrosshair,
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
                formatter: function () {
                    return ReactDOMServer.renderToString(
                        PoPChangeTooltipContainer({ pointsData: this.points }),
                    );
                },
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

    const onLegendClick = (selectedLegend) => {
        const action = selectedLegend.hidden ? "add" : "remove";
        const currentHiddenLegendsArr = getLegendItems().map((legend) => {
            if (legend.name === selectedLegend.name) {
                legend.visible = !legend.visible;
            }
            return legend;
        });
        setHiddenLegends(currentHiddenLegendsArr);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.traffic_sources_overview.growth.checkbox_filters",
            "click",
            { name: selectedLegend.name, action },
        );
    };

    return (
        <>
            <ChartLegendContainer>
                <FlexRow>
                    <Legends legendItems={getLegendItems()} toggleSeries={onLegendClick} />
                </FlexRow>
            </ChartLegendContainer>
            <ChartContainer>
                <div className="chartContainer">
                    {/*fix SIM-34274*/}
                    <GlobalStyle />
                    <Chart type="column" data={chartData} config={chartConfig} />
                </div>
            </ChartContainer>
        </>
    );
};
