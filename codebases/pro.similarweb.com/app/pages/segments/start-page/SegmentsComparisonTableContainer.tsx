import { IconButton } from "@similarweb/ui-components/dist/button";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import { Title } from "@similarweb/ui-components/dist/title";
import {
    toggleCreateUpdateSegmentGroupModal,
    toggleDeleteSegmentGroupModal,
} from "actions/segmentsModuleActions";
import BoxTitle, { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { i18nFilter } from "filters/ngFilters";
import { ISegmentsStartPageProps } from "pages/segments/start-page/SegmentsStartPage";
import { TableWrapper } from "pages/segments/start-page/StyledComponents";
import React from "react";
import { ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import {
    SEGMENT_CELL_VERSUS_CHAIN_MAX_ICONS,
    SegmentsComparisionColumnsConfig,
    SegmentsComparisionTableOptions,
} from "./SegmentsComparisonTableConfig";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    width: 100%;
    padding: 24px;
`;
TitleContainer.displayName = "TitleContainer";

export const StyledHeaderTitle = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 16px;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

const TablePagerContainer = styled.div`
    padding: 10px 15px;
    display: flex;
    flex-direction: row-reverse;
`;
const GROUPS_PER_PAGE = 5;

export interface ISegmentsComparisonTableContainer
    extends ISegmentsStartPageProps,
        IWithUseAdvancedPref {
    toggleDeleteSegmentGroupModal: (isOpen, segmentGroup) => void;
    toggleCreateUpdateSegmentGroupModal: (isOpen, segmentGroup?) => void;
}

const SegmentsComparisonTableContainer = (props: ISegmentsComparisonTableContainer) => {
    const {
        segments,
        groups,
        organizationSegments,
        toggleCreateUpdateSegmentGroupModal,
        toggleDeleteSegmentGroupModal,
        useAdvancedPref,
    } = props;
    const [currentPage, setCurrentPage] = React.useState(1);
    const changePageHandler = React.useCallback(
        (e) => {
            if (e !== currentPage) {
                setCurrentPage(e);
            }
        },
        [currentPage],
    );
    const fromRowIndex = currentPage * GROUPS_PER_PAGE - GROUPS_PER_PAGE;
    const toRowIndex = currentPage * GROUPS_PER_PAGE;
    const renderCreateGroupButton = React.useMemo(() => {
        const createSegmentsGroup = () => {
            TrackWithGuidService.trackWithGuid(
                "segments.start.page.comparison.table.create.group.button",
                "click",
                {},
            );
            toggleCreateUpdateSegmentGroupModal(true);
        };
        return (
            <FlexRow justifyContent="space-around">
                <IconButton
                    onClick={createSegmentsGroup}
                    isDisabled={segments?.length <= 1 && organizationSegments?.length <= 1}
                    iconName="add"
                    type="outlined"
                    iconSize="sm"
                    placement="left"
                >
                    {i18nFilter()("segment.startpage.comparision.new.compare")}
                </IconButton>
            </FlexRow>
        );
    }, [toggleCreateUpdateSegmentGroupModal, segments?.length, organizationSegments?.length]);

    const tableData = React.useMemo(
        () =>
            groups
                ?.sort((a: ICustomSegmentsGroup, b: ICustomSegmentsGroup) => {
                    return dayjs(a.creationTime).isBefore(b.creationTime) ? 1 : -1;
                })
                .map((group) => {
                    return {
                        name: group.name,
                        id: group.id,
                        versus: group.members.slice(0, SEGMENT_CELL_VERSUS_CHAIN_MAX_ICONS + 1).map(
                            (memberKey) =>
                                SegmentsUtils.getSegmentObjectByKey(memberKey, {
                                    segments: organizationSegments,
                                    websites: group.websites,
                                })[0],
                        ),
                        membersCount: group.members.length,
                    };
                }),
        [groups, organizationSegments],
    );

    const reactTableProps = React.useMemo(
        () => ({
            tableOptions: {
                hideHeader: true,
                ...SegmentsComparisionTableOptions(
                    groups,
                    toggleCreateUpdateSegmentGroupModal,
                    toggleDeleteSegmentGroupModal,
                ),
                customTableClass: "comparison-segments-table",
            },
            tableData: {
                Data: tableData.slice(fromRowIndex, toRowIndex).map((dataItem) => {
                    const isGroupDisabled =
                        ENABLE_FIREBOLT && !useAdvancedPref?.value
                            ? SegmentsUtils.isEntireGroupComposedOfAdvancedSegments(dataItem)
                            : false;
                    return {
                        ...dataItem,
                        segmentGroupIsDisabled: isGroupDisabled,
                        rowClass: isGroupDisabled ? "segmentRowDisabled" : "",
                    };
                }),
            },
            tableColumns: SegmentsComparisionColumnsConfig(),
        }),
        [
            groups,
            toggleCreateUpdateSegmentGroupModal,
            toggleDeleteSegmentGroupModal,
            tableData,
            fromRowIndex,
            toRowIndex,
            useAdvancedPref,
        ],
    );

    return (
        <TableWrapper>
            <TitleContainer>
                <StyledHeaderTitle>
                    <BoxTitle>{i18nFilter()("segment.startpage.comparision.title")}</BoxTitle>
                </StyledHeaderTitle>
                {renderCreateGroupButton}
            </TitleContainer>
            <SWReactTable {...reactTableProps} isLoading={props.isLoading} />
            <TablePagerContainer>
                <Pagination
                    page={currentPage}
                    itemsPerPage={GROUPS_PER_PAGE}
                    itemsCount={tableData.length}
                    hasItemsPerPageSelect={false}
                    handlePageChange={changePageHandler}
                />
            </TablePagerContainer>
        </TableWrapper>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        toggleDeleteSegmentGroupModal: (isOpen, segmentGroup) => {
            dispatch(toggleDeleteSegmentGroupModal(isOpen, segmentGroup));
        },
        toggleCreateUpdateSegmentGroupModal: (isOpen, segmentGroup?) => {
            dispatch(toggleCreateUpdateSegmentGroupModal(isOpen, segmentGroup));
        },
    };
}

export default withUseAdvancedPref(
    connect(undefined, mapDispatchToProps)(SegmentsComparisonTableContainer),
);
