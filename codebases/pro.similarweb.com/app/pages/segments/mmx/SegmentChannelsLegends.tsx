import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Legends } from "components/React/Legends/Legends";
import { StyledLegendWrapper } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/StyledComponents";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    EngagementVerticals,
    SegmentsSingleGraphLegendsContext,
} from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { CHART_COLORS } from "constants/ChartColors";
import { SegmentsMmxChannelsMapping } from "./SegmentsMarketingChannelsConfig";

export interface ISegmentChannelsLegendProps {
    selectedDisplayTypeIndex: number;
    data: any;
    selectedMetric: string;
    selectedGranularity: any;
    id: string;
}

export const SegmentChannelsLegends = (props: ISegmentChannelsLegendProps) => {
    const { selectedDisplayTypeIndex, data, selectedMetric, selectedGranularity, id } = props;
    const { hiddenLegends, setHiddenLegends } = useContext(SegmentsSingleGraphLegendsContext);
    const augmentedChannels = SegmentsMmxChannelsMapping.map(({ dataKey, display }) => {
        return {
            key: dataKey,
            name: display,
            hidden: hiddenLegends?.length > 0 && hiddenLegends.includes(dataKey),
            color: CHART_COLORS.trafficSourcesColorsBySourceMMX[dataKey],
        };
    });
    const totals = useMemo(() => {
        const graphData = data?.[id]?.[selectedGranularity.value]?.[selectedMetric];
        const total: any = Object.values(graphData).reduce((acc: any, channelData: any, index) => {
            acc[Object.keys(graphData)[index]] = channelData?.Total?.Value || 0;
            return acc;
        }, {});
        const allChannelsTotal: any = Object.values(total).reduce(
            (acc: number, channelTotal: number) => {
                acc += channelTotal;
                return acc;
            },
            0,
        );
        return { total, allChannelsTotal };
    }, [selectedMetric]);
    const getLegendItems = (selectedMetric) => {
        const isPercentage =
            selectedMetric === EngagementVerticals.Visits.name && selectedDisplayTypeIndex === 1;
        return augmentedChannels.map((augChannel) => {
            const totalValue =
                selectedMetric !== EngagementVerticals.Duration.dataKey &&
                totals.total[augChannel.key] === 0
                    ? null
                    : totals.total[augChannel.key];
            const value =
                totalValue && isPercentage
                    ? EngagementVerticals[selectedMetric].percentFilter[0]()(
                          totalValue / totals.allChannelsTotal,
                          2,
                      )
                    : EngagementVerticals[selectedMetric].filter[0]()(
                          totalValue,
                          selectedMetric === EngagementVerticals.Duration.dataKey ? null : 2,
                      );
            return {
                key: augChannel.key,
                data: value,
                name: augChannel.name,
                hidden: augChannel.hidden,
                color: augChannel.color,
                isWinner: false,
            };
        });
    };
    const [legendItems, setLegendItems] = useState(() => {
        return getLegendItems(selectedMetric);
    });
    useEffect(() => {
        setLegendItems(getLegendItems(selectedMetric));
    }, [selectedMetric, selectedDisplayTypeIndex]);
    const onLegendClick = (filter) => {
        const action = filter.hidden ? "add" : "remove";
        let isAllLegendsChecked = true;
        const filteredChannels = [];
        const filterChannels = legendItems?.map((f) => {
            if (f.key === filter.key) {
                f.hidden = !f.hidden;
            }
            if (f.hidden) {
                isAllLegendsChecked = false;
                filteredChannels.push(f.key);
            }
            return f;
        });
        setLegendItems(filterChannels);
        setHiddenLegends(filteredChannels);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.checkbox_filters",
            "click",
            { metric: selectedMetric, name: filter.name, action },
        );
    };
    return (
        <Legends
            legendComponent={LegendWithOneLineCheckboxFlex}
            legendComponentWrapper={StyledLegendWrapper}
            legendItems={legendItems}
            toggleSeries={onLegendClick}
            gridDirection="column"
            textMaxWidth={"125px"}
        />
    );
};
