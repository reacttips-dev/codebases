import { Injector } from "common/ioc/Injector";
import { CoreSegmentCell } from "components/core cells/src/CoreSegmentCell/CoreSegmentCell";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    BounceRate,
    DefaultCellRightAlign,
    HeatmapCell,
    IndexCell,
    TrafficShare,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    DefaultCellHeaderRightAlignNoElipsis,
} from "components/React/Table/headerCells";
import { i18nFilter } from "filters/ngFilters";
import { SegmentCellContainer } from "pages/conversion/conversionTableContainer/StyledComponents";
import { itsMyOwnSegment } from "pages/segments/analysis/CustomSegmentsTableConfig";
import React from "react";
import { SEGMENT_TYPES } from "services/segments/segmentsApiService";
import { allTrackers } from "services/track/track";
import { EngagementVerticals } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { ChannelsObj } from "pages/segments/mmx/SegmentsGroupMMXGraph";
import { wrapCellComponentDisabled } from "../analysis/segmentsGroupsAnalysisTableContainer/SegmentsGroupsAnalysisTableConfig";
import { SwTrack } from "services/SwTrack";

const getHeatmapColumn = ({
    field,
    displayName,
    isPercentage,
}: {
    field: string;
    displayName: string;
    isPercentage: boolean;
}) => {
    return {
        field,
        displayName,
        cellComponent: wrapCellComponentDisabled(HeatmapCell),
        headerComponent: DefaultCellHeaderRightAlign,
        replaceZeroValue: "-",
        CellValueFormat: isPercentage ? "percentagesign" : "absNumber",
        sortable: false,
        minWidth: 72,
        hideZeroValue: false,
        visible: true,
    };
};

export const SegmentsGroupMMXTableColumnsConfig = (isPercentage, selectedmetric) => {
    const baseColumns = [
        {
            fixed: true,
            isCheckBox: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            width: 33,
            headerComponent: DefaultCellHeader,
            visible: true,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            displayName: "#",
            cellComponent: IndexCell,
            headerComponent: DefaultCellHeader,
            disableHeaderCellHover: true,
            sortable: false,
            width: 40,
            visible: true,
        },
        {
            fixed: true,
            field: "SegmentDomain",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.segment",
            ),
            type: "string",
            format: "None",
            isResizable: true,
            sortable: false,
            isSorted: false,
            cellComponent: ({ value, row }) => {
                const subtitleFilters = [];
                const swNavigator = Injector.get<any>("swNavigator");
                const editSegmentClick = () => {
                    SwTrack.all.trackEvent(
                        "Internal Link",
                        "click",
                        `segmentCard/editSegment/${row.id}`,
                    );
                    const currentModule = swNavigator.getCurrentModule();
                    const segmentWizardStateName = `${currentModule}-wizard`;
                    swNavigator.go(segmentWizardStateName, { sid: row.id });
                };
                if (row.SegmentType === SEGMENT_TYPES.SEGMENT) {
                    subtitleFilters.push({
                        filter: "text",
                        value: row.segmentName,
                    });
                }
                return (
                    <SegmentCellContainer withSegment={row.SegmentType === SEGMENT_TYPES.SEGMENT}>
                        {row.SegmentType === SEGMENT_TYPES.WEBSITE ? (
                            <CoreWebsiteCell
                                icon={row.favicon}
                                domain={row.domain}
                                domainBadge="WEBSITE"
                                externalLink={`http://${row.domain}`}
                                subtitleFilters={
                                    subtitleFilters.length > 0 ? subtitleFilters : null
                                }
                                trackExternalLink={() =>
                                    allTrackers.trackEvent(
                                        "external link",
                                        "click",
                                        "Segments Group MMX",
                                    )
                                }
                                hideTrackButton={true}
                            />
                        ) : (
                            <CoreSegmentCell
                                segmentName={row.segmentName}
                                lastModified={row.lastUpdated}
                                isOrgSegment={!itsMyOwnSegment(row.userId)}
                                onClick={editSegmentClick}
                                segmentId={row.id}
                                icon={row.favicon}
                                domain={row.domain}
                                externalLink={`http://${value}`}
                                subtitleFilters={
                                    subtitleFilters.length > 0 ? subtitleFilters : null
                                }
                                trackExternalLink={() =>
                                    allTrackers.trackEvent(
                                        "external link",
                                        "click",
                                        "Segments Group MMX",
                                    )
                                }
                            />
                        )}
                    </SegmentCellContainer>
                );
            },
            headerComponent: DefaultCellHeader,
            totalCount: true,
            width: 190,
            showTotalCount: false,
            visible: true,
        },
        {
            field: "GroupVisitsShare",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.GroupVisitsShare",
            ),
            type: "double",
            format: "percentagesign",
            sortable: true,
            sortDirection: "desc",
            isSorted: false,
            cellComponent: wrapCellComponentDisabled(TrafficShare),
            headerComponent: DefaultCellHeader,
            width: 124,
            visible: true,
        },
        {
            field: "Visits",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.visits",
            ),
            type: "double",
            format: "minVisitsAbbr",
            sortable: false,
            isSorted: false,
            isResizable: false,
            cellComponent: wrapCellComponentDisabled(DefaultCellRightAlign),
            headerComponent: DefaultCellHeaderRightAlign,
            visible: true,
            width: 104,
        },
        {
            field: "SegmentShare",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.segment.share",
            ),
            type: "double",
            format: "percentagesign",
            sortable: false,
            isResizable: false,
            isSorted: false,
            cellComponent: wrapCellComponentDisabled(BounceRate),
            headerComponent: DefaultCellHeaderRightAlign,
            visible: true,
            width: 104,
        },
    ];
    return selectedmetric === EngagementVerticals.Visits.name
        ? baseColumns.concat(HeatmapCol(isPercentage))
        : baseColumns.concat(channelsCol(selectedmetric));
};

export const channelsCol = (selectedMetric): any[] => {
    return Object.keys(ChannelsObj).map((channelKey) => {
        return {
            field: channelKey,
            displayName: i18nFilter()(
                `segment.analysis.marketingChannels.group.table.column.${channelKey}`.toLowerCase(),
            ),
            sortable: false,
            isSorted: false,
            format: EngagementVerticals[selectedMetric].format,
            cellComponent: wrapCellComponentDisabled(
                EngagementVerticals[selectedMetric].cellComponent,
            ),
            headerComponent: DefaultCellHeaderRightAlign,
            visible: true,
            minWidth: 72,
        };
    });
};

export const HeatmapCol = (isPercentage): any[] => {
    return [
        getHeatmapColumn({
            field: "Direct",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.direct",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "Mail",
            displayName: i18nFilter()("segment.analysis.marketingChannels.group.table.column.mail"),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "Referrals",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.referrals",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "Social",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.social",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "OrganicSearch",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.organicsearch",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "PaidSearch",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.paidsearch",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "PaidReferrals",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.paidreferrals",
            ),
            isPercentage,
        }),
        getHeatmapColumn({
            field: "InternalReferrals",
            displayName: i18nFilter()(
                "segment.analysis.marketingChannels.group.table.column.internalreferrals",
            ),
            isPercentage,
        }),
    ];
};

// export const SegmentsGroupMMXTableColumnsConfigGen = (
//     sortbyField: string,
//     sortDirection: string,
// ) => {
//     return SegmentsGroupMMXTableColumnsConfig().map((col) => {
//         if (!col.sortable) {
//             return col;
//         }
//         return {
//             ...col,
//             isSorted: col.field === sortbyField,
//             sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
//         };
//     });
// };
