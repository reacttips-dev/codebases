import React, { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import {
    AdSpendChartLoaderContainer,
    ChartContainer,
    FiltersRowContainer,
} from "../Components/StyledComponents";
import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { Legends } from "components/React/Legends/Legends";
import { abbrNumberWithPrefixFilter, i18nFilter } from "filters/ngFilters";
import { getBaseChartConfig } from "../Helpers/AdSpendGraphConfig";
import {
    initChannelSourcesAsLegends,
    initComparedSitesAsLegends,
    parseCompareModeData,
    parseSingleModeData,
} from "../Helpers/AdSpendGraphDataParsers";
import { changeTooltipFormatter } from "../Components/ChangeTooltip";

interface IAdSpendGraphInnerProps {
    data: object;
    duration: string;
    isWindow: boolean;
    isSingle: boolean;
    getSiteColor: (string) => string;
    chosenSites: string[];
    selectedChannel: string;
    rawDataMetricName: string;
    isLoading: boolean;
    emptyState: React.ReactElement | null;
}

const useLegendItems = ({
    rawData,
    isSingleMode,
    selectedChannel,
    chosenSites,
    rawDataMetricName,
    legendsLabelsFormatter,
    getSiteColor,
}) => {
    const legendsProps = {
        rawData,
        isSingleMode,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        getSiteColor,
    };
    const [legendItems, setLegendItems] = useState([]);
    const baseItems = useMemo(() => {
        let rawItems =
            rawData && !_.isEmpty(rawData)
                ? isSingleMode
                    ? initChannelSourcesAsLegends(legendsProps)
                    : initComparedSitesAsLegends(legendsProps)
                : [];
        rawItems = rawItems.map((item) => {
            return { ...item, visible: true };
        });
        return rawItems;
    }, [
        rawData,
        isSingleMode,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        getSiteColor,
    ]);
    useEffect(() => {
        setLegendItems(baseItems);
    }, [baseItems, setLegendItems]);
    const toggleLegendItem = (legendItem) => {
        const { rawName /* , visible */ } = legendItem;
        const legendItemIndex = legendItems.findIndex(({ rawName: n }) => n === rawName);
        if (legendItemIndex >= 0) {
            setLegendItems([
                ...legendItems.slice(0, legendItemIndex),
                { ...legendItems[legendItemIndex], visible: !legendItems[legendItemIndex].visible },
                ...legendItems.slice(legendItemIndex + 1),
            ]);
        }
    };
    return { legendItems, toggleLegendItem };
};

const AdSpendGraphInner: FunctionComponent<IAdSpendGraphInnerProps> = ({
    data: rawData,
    duration,
    isWindow,
    isSingle,
    getSiteColor,
    chosenSites,
    selectedChannel,
    rawDataMetricName,
    isLoading,
    emptyState,
}) => {
    const chartType = "line";
    const legendsLabelsFormatter = useCallback(({ value }) => {
        return abbrNumberWithPrefixFilter()(value, "$");
    }, []);
    const metricName = i18nFilter()("analysis.search.adspend.metrics.title");
    const baseChartConfig = getBaseChartConfig(
        metricName,
        duration,
        isWindow,
        changeTooltipFormatter,
    );
    const getCurrentChartConfig = () => {
        baseChartConfig.stacked = false;
        return baseChartConfig;
    };
    const chartConfig = useMemo(() => {
        return getCurrentChartConfig();
    }, [chartType]);

    const { legendItems, toggleLegendItem } = useLegendItems({
        rawData,
        isSingleMode: isSingle,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        getSiteColor,
    });

    const chartData = useMemo(() => {
        if (rawData && Object.keys(rawData).length > 0) {
            return isSingle
                ? parseSingleModeData({
                      rawData,
                      legendItems,
                      rawDataMetricName,
                      chartType,
                      selectedChannel,
                  })
                : parseCompareModeData({
                      rawData,
                      legendItems,
                      rawDataMetricName,
                      chartType,
                      selectedChannel,
                  });
        }
        return [];
    }, [chartConfig, rawData, legendItems, isSingle]);

    ///////////////////////////////////////////////////////
    const renderComponentState = () => {
        if (isLoading) {
            return (
                <AdSpendChartLoaderContainer>
                    <GraphLoader width={"100%"} height={400} />
                </AdSpendChartLoaderContainer>
            );
        }
        return (
            <>
                <FiltersRowContainer data-automation="search-tab-graph-legends">
                    <Legends legendItems={legendItems} toggleSeries={toggleLegendItem} />
                </FiltersRowContainer>
                {emptyState ? (
                    emptyState
                ) : (
                    <ChartContainer>
                        <Chart type={chartType} data={chartData} config={chartConfig} />
                    </ChartContainer>
                )}
            </>
        );
    };
    return <>{renderComponentState()}</>;
};

export const AdSpendGraph = memo(AdSpendGraphInner);
