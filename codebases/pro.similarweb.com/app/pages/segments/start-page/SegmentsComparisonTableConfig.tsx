/* eslint-disable react/display-name */
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { ItemIcon, ItemIconChain } from "@similarweb/ui-components/dist/item-icon";
import { Injector } from "common/ioc/Injector";
import { DefaultCell } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { SegmentsStartTableAdditionalOptionsEllipsis } from "pages/segments/start-page/SegmentsStartTableAdditionalOptionsEllipsis";
import React from "react";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import swLog from "@similarweb/sw-log";
import { SEGMENT_TYPES } from "services/segments/segmentsApiService";
import { SegmentTypeBadge } from "pages/segments/StyledComponents";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SwTrack } from "services/SwTrack";

export const SEGMENT_CELL_VERSUS_CHAIN_MAX_ICONS = 5;

const CompareCell = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-top: -6px;
`;

const SmallItemIcon: any = styled(ItemIcon)`
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 12px;
    width: 70px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Domain = styled.div`
    width: 100%;
    font-size: 12px;
    color: ${(colorsPalettes.carbon["500"], 0.6)};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const VersusLabel = styled.div`
    font-size: 14px;
    color: ${(colorsPalettes.carbon["500"], 0.8)};
    margin-right: 12px;
`;

const SegmentName = styled.div`
    width: 100%;
    font-size: 12px;
    color: ${colorsPalettes.carbon["500"]};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const SegmentsComparisionColumnsConfig: any = () => {
    return [
        {
            field: "name",
            type: "string",
            format: "None",
            sortable: true,
            isSorted: true,
            cellComponent: DefaultCell,
            sortDirection: "desc",
            totalCount: false,
            showTotalCount: false,
            visible: true,
            minWidth: 200,
        },
        {
            field: "versus",
            type: "string",
            format: "None",
            sortable: true,
            isSorted: true,
            cellComponent: ({ value, row }) => {
                if ((value?.length ?? 0) < 1) {
                    return undefined;
                }
                return (
                    <CompareCell>
                        <SmallItemIcon iconSrc={value[0]?.favicon} iconName={""} />
                        <TitleWrapper>
                            <Domain>{value[0].domain}</Domain>
                            <SegmentName>
                                {value[0].type === SEGMENT_TYPES.WEBSITE ? (
                                    <SegmentTypeBadge>WEBSITE</SegmentTypeBadge>
                                ) : (
                                    value[0].segmentName
                                )}
                            </SegmentName>
                        </TitleWrapper>
                        <VersusLabel>
                            {i18nFilter()("segment.startpage.comparision.versus")}
                        </VersusLabel>
                        <ItemIconChain
                            icons={[
                                ...value.slice(1).map((segment) => segment.favicon),
                                ...new Array(
                                    Math.max(
                                        0,
                                        row.membersCount - SEGMENT_CELL_VERSUS_CHAIN_MAX_ICONS - 1,
                                    ),
                                ).fill(""),
                            ]}
                            maxIconChain={SEGMENT_CELL_VERSUS_CHAIN_MAX_ICONS}
                        />
                    </CompareCell>
                );
            },
            sortDirection: "desc",
            totalCount: false,
            showTotalCount: false,
            visible: true,
            minWidth: 300,
        },
    ];
};

export const SegmentsComparisionTableOptions = (
    groups,
    toggleCreateUpdateSegmentGroupModal,
    toggleDeleteSegmentGroupModal,
) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const editSegmentsGroupClick = (row) => {
        const { id } = row;
        TrackWithGuidService.trackWithGuid(
            "segments.start.page.comparison.table.additional.options.edit.group",
            "click",
            { id },
        );
        const segmentGroup = SegmentsUtils.getSegmentGroupById(groups, id);
        toggleCreateUpdateSegmentGroupModal(true, segmentGroup);
    };
    const onLinkRowClick: any = (row) => {
        if (!row) {
            return;
        }
        SwTrack.all.trackEvent(
            "Internal link",
            "click",
            `SegmentAnalysis/Analyze segments group/${row.domain}/${row.id}`,
        );
        const currentModule = swNavigator.getCurrentModule();
        const segmentAnalysisStateName = `${currentModule}-analysis-traffic`;
        swNavigator.go(segmentAnalysisStateName, {
            id: row.id,
            country: 840,
            mode: MODE.group,
            duration: "3m",
            ...SegmentsUtils.getPageFilterParams(row.id),
        });
    };

    const onDeleteGroupClick = async (row) => {
        const { id } = row;
        try {
            TrackWithGuidService.trackWithGuid(
                "segments.module.sidenav.additional.options.delete.group",
                "click",
                { id },
            );
            const segmentGroup = SegmentsUtils.getSegmentGroupById(groups, id);
            toggleDeleteSegmentGroupModal(true, segmentGroup);
        } catch (e) {
            swLog.error(`Failed to delete custom segmentID: ${row.id}`, e);
        }
    };

    const button = ({ row }) => {
        const isDisabled = row?.segmentGroupIsDisabled;
        const buttonElem = (
            <Button
                onClick={isDisabled ? undefined : () => onLinkRowClick(row)}
                className=""
                type="flat"
                isDisabled={isDisabled}
            >
                {i18nFilter()("conversion.home.leaderboard.table.action.analyse")}
            </Button>
        );
        if (isDisabled) {
            return (
                <PlainTooltip
                    placement="top"
                    tooltipContent={i18nFilter()(
                        "segment.analysis.table.column.segment.group.advanced.disabled",
                    )}
                >
                    <div>{buttonElem}</div>
                </PlainTooltip>
            );
        }
        return buttonElem;
    };
    const ellipsis = ({ row }) => (
        <SegmentsStartTableAdditionalOptionsEllipsis
            row={row}
            groupEllipsis={true}
            onClickDelete={onDeleteGroupClick}
            onClickEdit={editSegmentsGroupClick}
        />
    );
    return {
        rowActionsComponents: [button, ellipsis],
    };
};
