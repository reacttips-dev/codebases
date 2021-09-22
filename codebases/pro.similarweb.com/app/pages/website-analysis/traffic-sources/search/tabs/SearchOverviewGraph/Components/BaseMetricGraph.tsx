import { swSettings } from "common/services/swSettings";
import Chart from "components/Chart/src/Chart";
import {
    GraphLoader,
    VerticalLegendsLoader,
} from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { Legends } from "components/React/Legends/Legends";
import _ from "lodash";
import * as React from "react";
import { memo, useContext, useMemo } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    initChannelSourcesAsLegends,
    initComparedSitesAsLegends,
    parseCompareModeData,
    parseSingleModeData,
} from "../Helpers/SearchOverviewGraphDataParsers";
import { searchOverviewContext } from "../SearchOverviewGraph";
import { ChartContainer, LegendsContainer, SitesChartLoaderContainer } from "./StyledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { StyledLegendWrapper } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import { AllLegendsSum } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/AllLegendsSum";
import { legendTypes } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";

const useLegendItems = ({
    rawData,
    isSingleMode,
    selectedChannel,
    chosenSites,
    rawDataMetricName,
    legendsLabelsFormatter,
    chartType,
    getSiteColor,
    isMobileWeb,
    showAllChannel,
}) => {
    const {
        legendItemsState,
        category,
        webSource,
        actions: { toggleLegendItem },
    } = useContext(searchOverviewContext);
    const legendsProps = {
        rawData,
        isSingleMode,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        chartType,
        getSiteColor,
        isMobileWeb,
        category,
        showAllChannel,
    };
    // tslint:disable-next-line:max-line-length
    const baseItems = useMemo(
        () =>
            rawData && !_.isEmpty(rawData)
                ? isSingleMode
                    ? initChannelSourcesAsLegends(legendsProps)
                    : initComparedSitesAsLegends(legendsProps)
                : [],
        [
            rawData,
            chartType,
            rawDataMetricName,
            legendsLabelsFormatter,
            chartType,
            selectedChannel,
            isMobileWeb,
            webSource,
            isSingleMode,
            category,
        ],
    );
    const legendItems = useMemo(
        () =>
            baseItems.map((legendItem) => {
                const itemInState = legendItemsState.find(
                    ({ rawName }) => rawName === legendItem.rawName,
                );
                if (itemInState) {
                    const { visible } = itemInState;
                    return {
                        ...legendItem,
                        visible,
                    };
                }
                return legendItem;
            }),
        [baseItems, legendItemsState],
    );
    return { legendItems, toggleLegendItem };
};

const BaseMetricGraphInner: any = (props) => {
    const { metricConfig } = props;
    const {
        getCurrentChartConfig,
        legendsLabelsFormatter,
        rawDataMetricName,
        chartType,
        showAllChannel,
        showTooltip = false,
        tooltipKey = "",
    } = metricConfig;
    const {
        filtersRow,
        emptyState,
        isLoading,
        rawData,
        isMobileWeb,
        getSiteColor,
        chosenSites,
        channel: selectedChannel,
        isSingle,
        granularity,
        durationObj,
        isMonthsToDateActive,
    } = useContext(searchOverviewContext);

    const { legendItems, toggleLegendItem } = useLegendItems({
        rawData,
        isSingleMode: isSingle,
        selectedChannel,
        chosenSites,
        rawDataMetricName,
        legendsLabelsFormatter,
        chartType,
        getSiteColor,
        isMobileWeb,
        showAllChannel,
    });
    const legendItemsOrganicPaid = legendItems.filter(
        (item) => item.rawName !== legendTypes.AllChannels,
    );
    const legendItemsAll = legendItems.filter((item) => item.rawName === legendTypes.AllChannels);

    ///////////// Chart Data //////////////////

    const chartConfig = useMemo(() => {
        // in case the chart type changed (area / line) - get a new chart configuration
        return getCurrentChartConfig();
    }, [chartType, granularity, isMonthsToDateActive]);

    const chartData = useMemo(() => {
        const { to } = durationObj.forAPI;
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
                      granularity,
                      lastSupportedDate,
                  })
                : parseCompareModeData({
                      rawData,
                      legendItems,
                      rawDataMetricName,
                      chartType,
                      selectedChannel,
                      granularity,
                      lastSupportedDate,
                  });
        }
        return [];
    }, [legendItems, chartConfig, selectedChannel, rawData]);

    const onClickLegendItem = (selectedLegend) => {
        if (isSingle) {
            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.search_overview.graph_filter.channel",
                "click",
                { legendItem: selectedLegend.name, add: !selectedLegend.visible },
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.search_overview.graph_filter.competitors",
                "click",
                { legendItem: selectedLegend.name, add: !selectedLegend.visible },
            );
        }
        toggleLegendItem(selectedLegend);
    };
    ///////////////////////////////////////////////////////
    const renderComponentState = () => {
        if (isLoading) {
            return (
                <SitesChartLoaderContainer>
                    <FlexRow justifyContent={"space-between"}>
                        <GraphLoader width={"100%"} height={296} />
                        <div style={{ paddingLeft: "16px" }}>
                            <VerticalLegendsLoader rowsCount={2} width={"100%"} height={24} />
                        </div>
                    </FlexRow>
                </SitesChartLoaderContainer>
            );
        }
        if (emptyState) {
            return emptyState;
        }
        return (
            <FlexRow justifyContent={"space-between"}>
                <ChartContainer className={"sharedTooltip"}>
                    <Chart type={chartType} data={chartData} config={chartConfig} />
                </ChartContainer>
                <LegendsContainer data-automation="search-tab-graph-legends">
                    <Legends
                        legendItems={legendItemsOrganicPaid}
                        toggleSeries={onClickLegendItem}
                        legendComponent={LegendWithOneLineCheckboxFlex}
                        legendComponentWrapper={StyledLegendWrapper}
                        gridDirection="column"
                        textMaxWidth={"128px"}
                    />
                    {showAllChannel && legendItemsAll.length > 0 && (
                        <AllLegendsSum
                            name={legendItemsAll[0].name}
                            isWinner={legendItemsAll[0].isWinner}
                            data={legendItemsAll[0].data}
                            showTooltip={showTooltip}
                            tooltip={i18nFilter()(tooltipKey)}
                        />
                    )}
                </LegendsContainer>
            </FlexRow>
        );
    };
    return (
        <>
            {filtersRow}
            {renderComponentState()}
        </>
    );
};

export const BaseMetricGraph = memo(BaseMetricGraphInner);
