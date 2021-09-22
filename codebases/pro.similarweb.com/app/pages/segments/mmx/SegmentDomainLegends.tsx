import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Legends } from "components/React/Legends/Legends";
import React, { useEffect, useMemo, useState } from "react";
import { LegendWithOneLineCheckboxFlexWithSubtitle } from "@similarweb/ui-components/dist/legend";
import { SegmentLegendWrapper } from "./styledComponents";
import {
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { EngagementVerticals } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { ChannelsObj } from "pages/segments/mmx/SegmentsGroupMMXGraph";

export interface ISegmentDomainLegendsProps {
    selectedDisplayTypeIndex: number;
    selectedMetric: string;
    selectedRows: any;
    allSegments: any;
    currentChannel: any;
    setHiddenLegends?: any;
    hiddenLegends?: string[];
    groups?: any;
    params?: any;
    data?: any;
}

export const SegmentDomainLegends = (props: ISegmentDomainLegendsProps) => {
    const {
        selectedDisplayTypeIndex,
        selectedMetric,
        selectedRows,
        allSegments,
        currentChannel,
        setHiddenLegends,
        hiddenLegends,
        groups,
        params,
        data,
    } = props;

    const getLegendItems = useMemo(() => {
        const legends = selectedRows?.map((row) => {
            if (
                !(
                    SegmentsUtils.getSegmentIdTypeByKey(row.id)[1] === SEGMENT_TYPES.WEBSITE &&
                    currentChannel === ChannelsObj.InternalReferrals
                )
            ) {
                const [memberObj, memberType] = SegmentsUtils.getSegmentObjectByKey(row.id, {
                    segments: allSegments,
                    websites: groups.find((group) => group.id === params.id)?.websites,
                });
                const filter =
                    selectedDisplayTypeIndex === 1 &&
                    selectedMetric === EngagementVerticals.Visits.name
                        ? EngagementVerticals[selectedMetric].percentFilter
                        : EngagementVerticals[selectedMetric].filter;
                const dataKey =
                    selectedDisplayTypeIndex === 1 &&
                    selectedMetric === EngagementVerticals.Visits.name
                        ? "Percentage"
                        : "Value";
                switch (memberType) {
                    case SEGMENT_TYPES.SEGMENT:
                        const segmentObj = memberObj as ICustomSegment;
                        return {
                            data:
                                data[row.id]["Monthly"][selectedMetric][currentChannel]["Total"][
                                    dataKey
                                ] === 0
                                    ? "-"
                                    : filter[0]()(
                                          data[row.id]["Monthly"][selectedMetric][currentChannel][
                                              "Total"
                                          ][dataKey],
                                          filter[1],
                                      ),
                            segmentId: row.id,
                            gridRowGap: "0px",
                            name: segmentObj.domain,
                            subtitleText: segmentObj.segmentName,
                            hidden: hiddenLegends.includes(row.id),
                            color: row.selectionColor,
                            isWinner: false,
                        };
                        break;
                    case SEGMENT_TYPES.WEBSITE:
                        const websiteObj = memberObj as ICustomSegmentGroupWebsite;
                        return {
                            data:
                                data[row.id]["Monthly"][selectedMetric][currentChannel]["Total"][
                                    dataKey
                                ] === 0
                                    ? "-"
                                    : filter[0]()(
                                          data[row.id]["Monthly"][selectedMetric][currentChannel][
                                              "Total"
                                          ][dataKey],
                                          filter[1],
                                      ),
                            segmentId: row.id,
                            gridRowGap: "0px",
                            name: websiteObj.domain,
                            subtitleText: websiteObj.domain,
                            hidden: hiddenLegends.includes(row.id),
                            color: row.selectionColor,
                            isWinner: false,
                        };
                        break;
                }
            }
        });
        return legends.filter((legend) => legend !== undefined);
    }, [selectedRows, selectedDisplayTypeIndex, data, currentChannel, selectedMetric]);

    const [legendItems, setLegendItems] = useState(() => {
        return getLegendItems;
    });
    useEffect(() => {
        setLegendItems(getLegendItems);
    }, [selectedMetric, selectedRows, selectedDisplayTypeIndex, currentChannel, data]);

    const onLegendClick = (filter) => {
        const action = filter.hidden ? "add" : "remove";
        const filteredChannels = [];
        const filterChannels = legendItems?.map((f) => {
            if (f.segmentId === filter.segmentId) {
                f.hidden = !f.hidden;
            }
            if (f.hidden) {
                filteredChannels.push(f.segmentId);
            }
            return f;
        });
        setLegendItems(filterChannels);
        setHiddenLegends(filteredChannels);
        TrackWithGuidService.trackWithGuid(
            "segments_analysis.marketing_channels.group.checkbox_filters",
            "click",
            { metric: selectedMetric, name: filter.name, action },
        );
    };
    return (
        <Legends
            legendComponent={LegendWithOneLineCheckboxFlexWithSubtitle}
            legendComponentWrapper={SegmentLegendWrapper}
            legendItems={legendItems}
            toggleSeries={onLegendClick}
            gridDirection="column"
            textMaxWidth={
                window.innerWidth < 1680 ? (window.innerWidth > 1366 ? "125px" : "100px") : "150px"
            }
        />
    );
};
