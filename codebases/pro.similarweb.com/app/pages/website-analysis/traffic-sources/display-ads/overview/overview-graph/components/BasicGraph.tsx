import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { Legends } from "components/React/Legends/Legends";
import * as React from "react";
import { FunctionComponent, memo, useEffect, useMemo, useState } from "react";
import {
    initLegendItems,
    parseCompareModeData,
    parseSingleModeData,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphDataParsers";
import {
    ButtonsContainer,
    ChartContainer,
    SitesChartLoaderContainer,
    SwitchersContainer,
} from "./StyledComponents";
import {
    availableDataTypes,
    IDisplayAdsGraphConfig,
    ITimeGranularity,
    numbers,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { GraphTypeSwitcher, IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IBaseMetricProps {
    rawData: object;
    isSingle: boolean;
    getSiteColor: (string) => string;
    chosenSites: string[];
    isLoading: boolean;
    emptyState: React.ReactElement | null;
    from: string;
    to: string;
    granularity: ITimeGranularity;
    graphType: IDataType;
    setGraphType: React.Dispatch<IDataType>;
    baseChartConfig: object;
    legendsLabelsFormatter: ({ value }) => void;
    rawDataMetricName: string;
    chartType: string;
    isGraphTypeEnabled: boolean;
    selectedMetricTab: IDisplayAdsGraphConfig;
    isGranularitySupported: (string) => boolean;
    unselectedLegends: string[];
    onToggleLegendItem: (string) => void;
}

export const BaseMetricGraph: FunctionComponent<IBaseMetricProps> = ({
    baseChartConfig,
    legendsLabelsFormatter,
    rawDataMetricName,
    chartType,
    rawData,
    isSingle,
    getSiteColor,
    chosenSites,
    isLoading,
    emptyState,
    granularity,
    selectedMetricTab,
    graphType,
    setGraphType,
    isGraphTypeEnabled,
    isGranularitySupported,
    from,
    to,
    unselectedLegends,
    onToggleLegendItem,
}) => {
    const selectedChannel = selectedMetricTab.channel;
    const [legendItems, setLegendItems] = useState([]);

    useEffect(() => {
        setLegendItems(
            initLegendItems({
                rawData,
                isSingle,
                selectedChannel,
                chosenSites,
                rawDataMetricName,
                legendsLabelsFormatter,
                chartType,
                getSiteColor,
                unselectedLegends,
            }),
        );
    }, [chartType]);

    const toggleSeries = (legend) => {
        const { rawName } = legend;
        const unselectedLegendItemIndex = unselectedLegends.indexOf(rawName);
        const action = unselectedLegendItemIndex >= 0 ? "add" : "remove";
        TrackWithGuidService.trackWithGuid("display_ads.overview.graph.legend", "click", {
            metric: selectedMetricTab.name,
            site: rawName,
            action,
        });
        const legendItemIndex = legendItems.findIndex(({ rawName: n }) => n === rawName);
        if (legendItemIndex >= 0) {
            setLegendItems([
                ...legendItems.slice(0, legendItemIndex),
                { ...legendItems[legendItemIndex], visible: !legendItems[legendItemIndex].visible },
                ...legendItems.slice(legendItemIndex + 1),
            ]);
        }
        onToggleLegendItem(rawName);
    };

    ///////////// Chart Data //////////////////

    const granularityName = granularity.name;

    const chartConfig = useMemo(() => {
        // in case the chart type changed (area / line) - get a new chart configuration
        return baseChartConfig;
    }, [graphType, granularity]);

    const chartData = useMemo(() => {
        const lastSupportedDate = to.replace(/\|/g, "/");
        // once new legends updated, parse data for the chart
        if (
            rawData &&
            Object.keys(rawData).length > 0 &&
            (selectedChannel || 0 !== selectedChannel.length)
        ) {
            return isSingle
                ? parseSingleModeData({
                      rawData,
                      legendItems,
                      rawDataMetricName,
                      chartType,
                      granularityName,
                      lastSupportedDate,
                  })
                : parseCompareModeData({
                      rawData,
                      legendItems,
                      rawDataMetricName,
                      chartType,
                      selectedChannel,
                      granularityName,
                      lastSupportedDate,
                  });
        }
        return [];
    }, [legendItems, selectedChannel, rawData, chartType]);

    ///////////////  Graph Type Switcher  ///////////////

    const GraphTypesSwitcherContainer = ({ graphType, setGraphType, selectedMetricTab }) => {
        const onGraphTypeSwitcherClick = (index) => {
            const type = availableDataTypes[index].value;
            TrackWithGuidService.trackWithGuid("display_ads.overview.graph.data_type", "click", {
                metric: selectedMetricTab.name,
                type,
            });
            setGraphType(availableDataTypes[index]);
        };
        return (
            <GraphTypeSwitcher
                onItemClick={(index) => onGraphTypeSwitcherClick(index)}
                selectedIndex={availableDataTypes.findIndex(
                    (item) => item.value === graphType.value,
                )}
                buttonsList={availableDataTypes}
            />
        );
    };

    ///////////////////////////////////////////////////////

    const renderComponentState = () => {
        return isLoading ? (
            <SitesChartLoaderContainer>
                <GraphLoader width={"100%"} height={400} />
            </SitesChartLoaderContainer>
        ) : emptyState ? (
            emptyState
        ) : (
            <>
                <ButtonsContainer isSingle={isSingle}>
                    {!isSingle && (
                        <Legends
                            legendItems={legendItems}
                            toggleSeries={toggleSeries}
                            data-automation="display-ads-graph-legends"
                        />
                    )}
                    <SwitchersContainer data-automation="display-ads-graph-switchers">
                        {isGraphTypeEnabled && (
                            <GraphTypesSwitcherContainer
                                graphType={graphType}
                                setGraphType={setGraphType}
                                selectedMetricTab={selectedMetricTab}
                            />
                        )}
                    </SwitchersContainer>
                </ButtonsContainer>
                <ChartContainer className={"sharedTooltip"}>
                    <Chart type={chartType} data={chartData} config={chartConfig} />
                </ChartContainer>
            </>
        );
    };

    return renderComponentState();
};

export const BasicGraph = memo(BaseMetricGraph);
