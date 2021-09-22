/* eslint-disable react/display-name */
import { colorsPalettes, fonts } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { swSettings } from "common/services/swSettings";
import { getIndex } from "components/React/Table/cells/IndexCell";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import dayjs from "dayjs";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { loadCustomSegmentsMetadata } from "pages/segments/config/segmentsConfigHelpers";
import { SegmentsStartTableAdditionalOptionsEllipsis } from "pages/segments/start-page/SegmentsStartTableAdditionalOptionsEllipsis";
import SegmentsApiService from "services/segments/segmentsApiService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { DefaultCell } from "../../../../.pro-features/components/Workspace/TableCells/DefaultCell";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import I18n from "../../../components/React/Filters/I18n";
import { IndexCell } from "../../../components/React/Table/cells/index";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells/index";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import {
    getSegmentTypeById,
    USER_SEGMENT_TYPES_PREFIX,
} from "../wizard/SegmentFirstStep/UserSegmentTypes";
import { SegmentCellContainer } from "./segmentsGroupsAnalysisTableContainer/StyledComponents";
import { AnalyzeButton, EditButton } from "./StyledComponents";
import { CoreSegmentCell } from "../../../../.pro-features/components/core cells/src/CoreSegmentCell/CoreSegmentCell";
import { SwTrack } from "services/SwTrack";

const Capitalize = styled.div`
    text-transform: capitalize;
`;

const OwnerLabel = styled.span`
    letter-spacing: 0.6px;
    font-family: ${fonts.$robotoFontFamily};
    font-size: 8px;
    border-radius: 10px;
    margin: 3px 0 0 9px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    padding: 4px 5px 3px 5px;
    height: 15px;
    line-height: 1;
    background-color: ${colorsPalettes.midnight[200]};
`;

export const itsMyOwnSegment = (userId) => {
    return +userId === swSettings.user.id;
};

const rowSelection = {
    cellComponent: RowSelectionConsumer,
    // headerComponent: SelectAllRowsHeaderCellConsumer,
    headerComponent: DefaultCellHeader,
    disableHeaderCellHover: true,
    sortable: false,
    visible: true,
    fixed: true,
    width: 48,
    isResizable: false,
};
const index = {
    field: "#",
    fixed: true,
    sortDirection: "desc",
    cellComponent: IndexCell,
    headerComponent: DefaultCellHeader,
    disableHeaderCellHover: true,
    sortable: false,
    width: 40,
    visible: true,
    isResizable: false,
};
const domain = {
    field: "domain",
    displayName: i18nFilter()("segment.analysis.table.column.segments"),
    type: "string",
    format: "None",
    sortable: true,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        const subtitleFilters = [];
        const swNavigator = Injector.get<any>("swNavigator");
        const editSegmentClick = () => {
            SwTrack.all.trackEvent("Internal Link", "click", `segmentCard/editSegment/${row.id}`);
            const currentModule = swNavigator.getCurrentModule();
            const segmentWizardStateName = `${currentModule}-wizard`;
            swNavigator.go(segmentWizardStateName, { sid: row.id });
        };
        subtitleFilters.push({
            filter: "text",
            value: row.segmentName,
        });
        return (
            <SegmentCellContainer withSegment={true}>
                <CoreSegmentCell
                    segmentName={row.segmentName}
                    lastModified={row.lastUpdated}
                    isOrgSegment={!itsMyOwnSegment(row.userId)}
                    onClick={editSegmentClick}
                    segmentId={row.id}
                    icon={row.favicon}
                    domain={value}
                    externalLink={`http://${value}`}
                    subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                    trackExternalLink={() =>
                        allTrackers.trackEvent("external link", "click", `Segments Group Analysis`)
                    }
                />
            </SegmentCellContainer>
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    totalCount: true,
    tooltip: i18nFilter()("segment.analysis.table.column.segments.tooltip"),
    showTotalCount: true,
    visible: true,
    width: 360,
    fixed: true,
    isResizable: false,
};
const lastUpdated = {
    field: "lastUpdated",
    displayName: i18nFilter()("segment.analysis.table.column.creationdate"),
    type: "date",
    sortable: true,
    isSorted: true,
    cellComponent: ({ value, row }) => {
        return <DefaultCell>{dayjs(value).format("MMMM DD, YYYY")}</DefaultCell>;
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.table.column.creationdate.tooltip"),
    visible: true,
    minWidth: 160,
};
const userName = {
    field: "userName",
    displayName: i18nFilter()("segment.analysis.org.table.column.username"),
    type: "string",
    sortable: true,
    isSorted: true,
    cellComponent: ({ value, row }) => {
        return (
            <DefaultCell>
                {<Capitalize>{value}</Capitalize>}
                {itsMyOwnSegment(row.userId) && (
                    <OwnerLabel>
                        <I18n>segment.analysis.org.table.column.username.my.segment</I18n>
                    </OwnerLabel>
                )}
            </DefaultCell>
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.org.table.column.username.tooltip"),
    visible: true,
    width: 152,
};
const segmentType = {
    field: "segmentType",
    displayName: i18nFilter()("segment.analysis.table.column.type"),
    type: "string",
    format: "None",
    sortable: true,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        return (
            <DefaultCell>
                {getSegmentTypeById(value) &&
                    i18nFilter()(
                        `${USER_SEGMENT_TYPES_PREFIX}.${getSegmentTypeById(value).name}.title`,
                    )}
            </DefaultCell>
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.table.column.type.tooltip"),
    visible: true,
    minWidth: 250,
};
const analysis = {
    field: "Analysis",
    displayName: i18nFilter()("segment.analysis.table.column.analysis"),
    type: "date",
    format: "none",
    sortable: false,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        return (
            <AnalyzeButton>
                <ButtonLabel>
                    <I18n>folderanalysis.table.analyze.button</I18n>
                </ButtonLabel>
            </AnalyzeButton>
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.table.column.analysis.tooltip"),
    visible: true,
    minWidth: 150,
};
const edit = {
    field: "Edit",
    displayName: i18nFilter()("segment.analysis.table.column.edit"),
    type: "date",
    format: "none",
    sortable: false,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        const swNavigator = Injector.get<any>("swNavigator");
        const editSegmentClick = () => {
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                `segmentAnalysis/editSegment/${row.id}`,
            );
            const currentModule = swNavigator.getCurrentModule();
            const segmentWizardStateName = `${currentModule}-wizard`;
            swNavigator.go(segmentWizardStateName, { sid: row.id });
        };
        return <EditButton onClick={editSegmentClick} iconName="edit-icon" placement={"left"} />;
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.table.column.edit.tooltip"),
    visible: true,
    width: 100,
};
const copyAndEdit = {
    field: "Edit",
    displayName: i18nFilter()("segment.analysis.org.table.column.edit"),
    type: "date",
    format: "none",
    sortable: false,
    isSorted: false,
    cellComponent: ({ value, row }) => {
        const swNavigator = Injector.get<any>("swNavigator");
        const editSegmentClick = () => {
            SwTrack.all.trackEvent(
                "Internal Link",
                "click",
                `segmentAnalysis/editSegment/${row.id}`,
            );
            const currentModule = swNavigator.getCurrentModule();
            const segmentWizardStateName = `${currentModule}-wizard`;
            swNavigator.go(segmentWizardStateName, { sid: row.id });
        };
        return (
            <PlainTooltip
                tooltipContent={
                    itsMyOwnSegment(row.userId)
                        ? i18nFilter()("segment.analysis.org.table.column.edit.button.tooltip")
                        : i18nFilter()(
                              "segment.analysis.org.table.column.button.copy.and.edit.tooltip",
                          )
                }
                placement={"top"}
            >
                <span>
                    <EditButton
                        onClick={editSegmentClick}
                        iconName={itsMyOwnSegment(row.userId) ? "edit-icon" : "copy-and-edit"}
                        placement={"left"}
                    />
                </span>
            </PlainTooltip>
        );
    },
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.analysis.org.table.column.edit.tooltip"),
    visible: true,
    width: 85,
};

export const CustomSegmentsTableColumnsConfig = () => [rowSelection, index, domain, lastUpdated];

export const CustomSegmentsOrgTableColumnsConfig = () => [
    rowSelection,
    {
        ...index,
        cellComponent: ({ row, tableOptions }) => {
            const currentPage = tableOptions?.customPager?.currentPage;
            const index = getIndex(row.index, currentPage, 100);
            return <div className="u-alignCenter">{index}</div>;
        },
    },
    { ...domain, width: 276 },
    { ...lastUpdated, minWidth: 152 },
    userName,
];

export const CustomSegmentsTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    organizationSegments = false,
    displayPage?: number,
) => {
    const columns: any = organizationSegments
        ? CustomSegmentsOrgTableColumnsConfig()
        : CustomSegmentsTableColumnsConfig();
    return columns.map((col, idx) => {
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

export const SegmentsTableOptions = () => {
    const swNavigator = Injector.get<any>("swNavigator");
    const segmentApiService = new SegmentsApiService();
    const duplicateSegmentClick = (row) => {
        SwTrack.all.trackEvent(
            "Internal Link",
            "click",
            `segmentAnalysis/duplicateSegment/${row.id}`,
        );
        const currentModule = swNavigator.getCurrentModule();
        const segmentWizardStateName = `${currentModule}-wizard`;
        swNavigator.go(segmentWizardStateName, { sid: row.id, createNew: true });
    };
    const editSegmentClick = (row) => {
        SwTrack.all.trackEvent("Internal Link", "click", `segmentAnalysis/editSegment/${row.id}`);
        const currentModule = swNavigator.getCurrentModule();
        const segmentWizardStateName = `${currentModule}-wizard`;
        swNavigator.go(segmentWizardStateName, { sid: row.id });
    };
    const onLinkRowClick: any = (row) => {
        if (!row) {
            return;
        }
        SwTrack.all.trackEvent(
            "Internal link",
            "click",
            `SegmentAnalysis/Analyze segment/${row.domain}/${row.id}`,
        );

        const currentModule = swNavigator.getCurrentModule();
        const segmentAnalysisStateName = `${currentModule}-analysis-traffic`;

        swNavigator.go(segmentAnalysisStateName, {
            id: row.id,
            country: 840,
            mode: MODE.single,
            duration: "6m",
            ...SegmentsUtils.getPageFilterParams(row.id),
        });
    };

    const onDeleteSegmentClick = async (row) => {
        try {
            await segmentApiService.deleteCustomSegment(row.id);
            TrackWithGuidService.trackWithGuid("custom.segment.analysis.delete", "click", {
                id: row.id,
                segmentName: row.segmentName,
            });
            loadCustomSegmentsMetadata(true); // reload segments metadata
        } catch (e) {
            swLog.error(`Failed to delete custom segmentID: ${row.id}`, e);
        }
    };

    const button = ({ row = undefined }) => {
        const isDisabled = row?.segmentAdvancedDisabled;
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
                        "segment.analysis.table.column.segment.advanced.disabled",
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
            onClickDelete={onDeleteSegmentClick}
            onClickDuplicate={duplicateSegmentClick}
            onClickEdit={editSegmentClick}
        />
    );
    return {
        rowActionsComponents: [button, ellipsis],
    };
};
