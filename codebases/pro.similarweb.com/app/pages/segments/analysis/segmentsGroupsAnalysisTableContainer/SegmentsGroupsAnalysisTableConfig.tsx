/* eslint-disable react/display-name */
import { Injector } from "common/ioc/Injector";
import { CoreSegmentCell } from "components/core cells/src/CoreSegmentCell/CoreSegmentCell";
import { itsMyOwnSegment } from "pages/segments/analysis/CustomSegmentsTableConfig";
import React, { useMemo } from "react";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { DefaultCellRightAlign } from "../../../../components/React/Table/cells/DefaultCellRightAlign";
import { BounceRate, IndexCell, TrafficShare } from "../../../../components/React/Table/cells";
import { RowSelectionConsumer } from "../../../../components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../../components/React/Table/headerCells";
import { WebsiteTooltip } from "../../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../../filters/ngFilters";
import { allTrackers } from "../../../../services/track/track";
import { SegmentCellContainer } from "./StyledComponents";
import { ICustomSegment, SEGMENT_TYPES } from "services/segments/segmentsApiService";
import { WinnerCellWrapper } from "components/React/Table/cells/WinnerCellWrapper";
import { SwTrack } from "services/SwTrack";

const wrapCellComponentWithWinner = (CellComponent) => (props) => {
    const { row, field, tableColumns } = props;
    const columnConfig = tableColumns.find((c) => c.field === field);
    const isWinner = useMemo(() => {
        return columnConfig.showWinner ? (row?.winnersList || []).includes(field) : false;
    }, [field, row.winnersList]);

    return (
        <WinnerCellWrapper
            {...props}
            isWinner={isWinner}
            cellComponent={CellComponent}
            winnerCellAlign="right"
            winnerCellBold={true}
        />
    );
};

export const wrapCellComponentDisabled = (CellComponent) => (props) => {
    const { row } = props;
    if (row.isDisabled) {
        return null;
    }
    return <CellComponent {...props} />;
};

export const SegmentsGroupsAnalysisColumnsConfig = () => [
    {
        fixed: true,
        cellComponent: RowSelectionConsumer,
        sortable: false,
        width: 33,
        headerComponent: DefaultCellHeader,
        visible: true,
        disableHeaderCellHover: true,
    },
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        sortable: false,
        disableHeaderCellHover: true,
        width: 65,
        visible: true,
    },
    {
        fixed: true,
        field: "SegmentDomain",
        displayName: i18nFilter()("segments.group.analysis.table.column.segments"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: ({ value, row }) => {
            const subtitleFilters = [];
            const swNavigator = Injector.get<any>("swNavigator");
            const editSegmentClick = () => {
                SwTrack.all.trackEvent(
                    "Internal Link",
                    "click",
                    `segmentCard/editSegment/${row.SegmentId}`,
                );
                const currentModule = swNavigator.getCurrentModule();
                const segmentWizardStateName = `${currentModule}-wizard`;
                swNavigator.go(segmentWizardStateName, { sid: row.SegmentId });
            };
            if (!row.SegmentIsWebsite) {
                subtitleFilters.push({
                    filter: "text",
                    value: row.SegmentName,
                });
            }
            return (
                <SegmentCellContainer withSegment={row.SegmentType === SEGMENT_TYPES.SEGMENT}>
                    {row.SegmentType === SEGMENT_TYPES.WEBSITE ? (
                        <CoreWebsiteCell
                            icon={row.SegmentFavicon}
                            domain={value}
                            domainBadge="WEBSITE"
                            externalLink={`http://${value}`}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    "Segments Group Analysis",
                                )
                            }
                            hideTrackButton={true}
                        />
                    ) : (
                        <CoreSegmentCell
                            segmentName={row.SegmentName}
                            lastModified={row.SegmentLastUpdated}
                            isOrgSegment={!itsMyOwnSegment(row.userId)}
                            onClick={editSegmentClick}
                            segmentId={row.SegmentId}
                            icon={row.SegmentFavicon}
                            domain={value}
                            externalLink={`http://${value}`}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    "Segments Group Analysis",
                                )
                            }
                        />
                    )}
                </SegmentCellContainer>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.segments"),
        width: 300,
        showTotalCount: false,
        visible: true,
    },
    {
        field: "GroupVisitsShare",
        displayName: i18nFilter()("segments.group.analysis.table.column.groupVisitsShare"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        cellComponent: wrapCellComponentDisabled(TrafficShare),
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.groupVisitsShare"),
        minWidth: 230,
        visible: true,
    },
    {
        field: "Visits",
        displayName: i18nFilter()("segments.group.analysis.table.column.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: true,
        cellComponent: wrapCellComponentDisabled(
            wrapCellComponentWithWinner(DefaultCellRightAlign),
        ),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.visits"),
        minWidth: 120,
        visible: true,
        showWinner: true,
    },
    {
        field: "PagesViews",
        displayName: i18nFilter()("segments.group.analysis.table.column.pageviews"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: wrapCellComponentDisabled(
            wrapCellComponentWithWinner(DefaultCellRightAlign),
        ),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.pageviews"),
        minWidth: 120,
        visible: true,
        showWinner: true,
    },
    {
        field: "PagePerVisit",
        displayName: i18nFilter()("segments.group.analysis.table.column.pagePerVisit"),
        type: "double",
        format: "number",
        sortable: true,
        isSorted: false,
        cellComponent: wrapCellComponentDisabled(
            wrapCellComponentWithWinner(DefaultCellRightAlign),
        ),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.pagePerVisit"),
        minWidth: 120,
        visible: true,
        showWinner: true,
    },
    {
        field: "Duration",
        displayName: i18nFilter()("segments.group.analysis.table.column.visitDuration"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: wrapCellComponentDisabled(
            wrapCellComponentWithWinner(DefaultCellRightAlign),
        ),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.visitDuration"),
        minWidth: 120,
        visible: true,
        showWinner: true,
    },
    {
        field: "BounceRate",
        displayName: i18nFilter()("segments.group.analysis.table.column.bounceRate"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        cellComponent: wrapCellComponentDisabled(wrapCellComponentWithWinner(BounceRate)),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "asc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.bounceRate"),
        minWidth: 120,
        visible: true,
        showWinner: true,
    },
    {
        field: "TrafficShare",
        displayName: i18nFilter()("segments.group.analysis.table.column.trafficShare"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: true,
        cellComponent: wrapCellComponentDisabled(wrapCellComponentWithWinner(BounceRate)),
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segments.group.analysis.table.tooltip.trafficShare"),
        minWidth: 120,
        visible: true,
        showWinner: false,
    },
];

export const SegmentsGroupsAnalysisColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
) => {
    return SegmentsGroupsAnalysisColumnsConfig().map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: col.field === sortbyField,
            sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};
