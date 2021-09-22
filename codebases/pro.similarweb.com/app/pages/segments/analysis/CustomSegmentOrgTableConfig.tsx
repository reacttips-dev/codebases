/* eslint-disable react/display-name */
import { colorsPalettes, fonts } from "@similarweb/styles";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { DefaultCell } from "../../../../.pro-features/components/Workspace/TableCells/DefaultCell";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import I18n from "../../../components/React/Filters/I18n";
import { IndexCell } from "../../../components/React/Table/cells/index";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells/index";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import {
    getSegmentTypeById,
    USER_SEGMENT_TYPES_PREFIX,
} from "../wizard/SegmentFirstStep/UserSegmentTypes";
import { SegmentCellContainer } from "./segmentsGroupsAnalysisTableContainer/StyledComponents";
import { AnalyzeButton, EditButton, StyledCoreWebsiteCell } from "./StyledComponents";
import { SwTrack } from "services/SwTrack";

const itsMyOwnSegment = (userId) => {
    return +userId === swSettings.user.id ? true : false;
};

const NavLabel = styled.span`
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

export const CustomSegmentsOrgTableColumnsConfig = () => [
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 40,
        visible: true,
    },
    {
        field: "domain",
        displayName: i18nFilter()("segment.analysis.org.table.column.segments"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: ({ value, row }) => {
            const subtitleFilters = [];
            subtitleFilters.push({
                filter: "text",
                value: row.segmentName,
            });
            return (
                <SegmentCellContainer withSegment={true}>
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <StyledCoreWebsiteCell
                            icon={row.favicon}
                            domain={value}
                            externalLink={`http://${value}`}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    `Segments Group Analysis`,
                                )
                            }
                        />
                    </ComponentsProvider>
                </SegmentCellContainer>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("segment.analysis.org.table.column.segments.tooltip"),
        showTotalCount: true,
        visible: true,
        width: 276,
        fixed: true,
    },
    {
        field: "segmentType",
        displayName: i18nFilter()("segment.analysis.org.table.column.type"),
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
        tooltip: i18nFilter()("segment.analysis.org.table.column.type.tooltip"),
        visible: true,
        minWidth: 210,
    },
    {
        field: "creationDate",
        displayName: i18nFilter()("segment.analysis.org.table.column.creationdate"),
        type: "date",
        sortable: true,
        isSorted: true,
        cellComponent: ({ value, row }) => {
            return <DefaultCell>{dayjs(value).format("MMMM DD, YYYY")}</DefaultCell>;
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.org.table.column.creationdate.tooltip"),
        visible: true,
        minWidth: 152,
    },
    {
        field: "userName",
        displayName: i18nFilter()("segment.analysis.org.table.column.username"),
        type: "string",
        sortable: true,
        isSorted: true,
        cellComponent: ({ value, row }) => {
            return (
                <DefaultCell>
                    {value}
                    {itsMyOwnSegment(row.userId) && (
                        <NavLabel>
                            <I18n>segment.analysis.org.table.column.username.my.segment</I18n>
                        </NavLabel>
                    )}
                </DefaultCell>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.org.table.column.username.tooltip"),
        visible: true,
        width: 152,
    },
    {
        field: "Analysis",
        displayName: i18nFilter()("segment.analysis.org.table.column.analysis"),
        type: "date",
        format: "none",
        sortable: false,
        isSorted: false,
        cellComponent: () => {
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
        tooltip: i18nFilter()("segment.analysis.org.table.column.analysis.tooltip"),
        visible: true,
        minWidth: 158,
    },
    {
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
                const segmentWizardStateName = `${currentModule}.wizard`;
                swNavigator.go(segmentWizardStateName, { sid: row.id });
            };
            return (
                <EditButton
                    onClick={editSegmentClick}
                    iconName={itsMyOwnSegment(row.userId) ? "edit-icon" : "copy-and-edit"}
                    placement={"left"}
                />
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.org.table.column.edit.tooltip"),
        visible: true,
        width: 85,
    },
];

export const CustomSegmentsOrgTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
) => {
    return CustomSegmentsOrgTableColumnsConfig().map((col) => {
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
