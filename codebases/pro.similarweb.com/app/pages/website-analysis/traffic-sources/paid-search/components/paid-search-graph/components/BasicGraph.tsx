import { swSettings } from "common/services/swSettings";
import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { Legends } from "components/React/Legends/Legends";
import _ from "lodash";
import * as React from "react";
import { FunctionComponent, memo, useEffect, useMemo, useState } from "react";
import {
    initLegendItems,
    parseCompareModeData,
    parseSingleModeData,
} from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphDataParsers";
import {
    ButtonsContainer,
    ChartContainer,
    SitesChartLoaderContainer,
    SwitchersContainer,
} from "./StyledComponents";
import { TimeGranularitySwitcher } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/TimeGranularitySwitcher";
import {
    availableDataTypes,
    IPaidSearchMetricsConfig,
    ITimeGranularity,
    timeGranularityObjects,
} from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";
import { GraphTypeSwitcher, IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IBaseMetricProps {
    rawData: object;
    isSingle: boolean;
    getSiteColor: (string) => string;
    chosenSites: string[];
    isLoading: boolean;
    emptyState: React.ReactElement | null;
    isMonthsToDateActive: boolean;
    from: string;
    to: string;
    granularity: ITimeGranularity;
    setTimeGranularity: ({ value }) => void;
    graphType: IDataType;
    setGraphType: React.Dispatch<IDataType>;
    baseChartConfig: object;
    legendsLabelsFormatter: ({ value }) => void;
    rawDataMetricName: string;
    chartType: string;
    isGraphTypeEnabled: boolean;
    selectedMetricTab: IPaidSearchMetricsConfig;
    isGranularitySupported: (string) => boolean;
    unselectedLegends: string[];
    onToggleLegendItem: (string) => void;
}

const BaseMetricGraphInner: FunctionComponent<IBaseMetricProps> = ({
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
    isMonthsToDateActive,
    granularity,
    setTimeGranularity,
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

    const toggleLegendItem = (legendItem) => {
        const { rawName } = legendItem;
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
    }, [graphType, granularity, isMonthsToDateActive]);

    const chartData = useMemo(() => {
        const lastSupportedDate = isMonthsToDateActive
            ? swSettings.current.lastSupportedDailyDate
            : to.replace(/\|/g, "/");
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

    const onLegendItemClick = (selectedLegend) => {
        toggleLegendItem(selectedLegend);
    };

    ///////////////  Graph Type Switcher  ///////////////

    const GraphTypesSwitcherContainer = ({ graphType, setGraphType, selectedMetricTab }) => {
        // const availableDataTypes = getAvailableDataTypes();
        const onGraphTypeSwitcherClick = (index) => {
            const type = availableDataTypes[index].value;
            TrackWithGuidService.trackWithGuid(
                "websiteanalysis.trafficsources.paidsearch.graph.unit_type",
                "click",
                { metric: selectedMetricTab.name, type },
            );
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

    const TimeGranularitySwitcherContainer = ({ setTimeGranularity, granularity }) => {
        const granularityUpdate = (granularityIndex) => {
            const newTimeGranularity = granularityIndexToGranularityObject(granularityIndex).name;
            setTimeGranularity(newTimeGranularity);
        };
        const granularityIndexToGranularityObject = (granularityIndex) =>
            Object.values(timeGranularityObjects).find(({ index }) => index === granularityIndex);
        const getTimeGranularity = () => {
            const tmpTimeGranularityOptions = _.cloneDeep(timeGranularityObjects);
            Object.keys(tmpTimeGranularityOptions).map(
                (gran) =>
                    (tmpTimeGranularityOptions[gran].disabled = !isGranularitySupported(gran)),
            );
            return Object.values(tmpTimeGranularityOptions);
        };
        return (
            <TimeGranularitySwitcher
                timeGranularity={granularity}
                granularityUpdate={granularityUpdate}
                getGranularity={getTimeGranularity}
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
                <ButtonsContainer data-automation="paid-search-graph-buttons" isSingle={isSingle}>
                    {!isSingle && (
                        <Legends
                            legendItems={legendItems}
                            toggleSeries={onLegendItemClick}
                            data-automation="paid-search-graph-buttons"
                        />
                    )}
                    <SwitchersContainer data-automation="paid-search-graph-switchers">
                        {isGraphTypeEnabled && (
                            <GraphTypesSwitcherContainer
                                graphType={graphType}
                                setGraphType={setGraphType}
                                selectedMetricTab={selectedMetricTab}
                            />
                        )}
                        <TimeGranularitySwitcherContainer
                            setTimeGranularity={setTimeGranularity}
                            granularity={granularity}
                        />
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

export const BasicGraph = memo(BaseMetricGraphInner);
