import { IconButton } from "@similarweb/ui-components/dist/button";
import { Link } from "@similarweb/ui-components/dist/link";
import * as _ from "lodash";
import React from "react";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import {
    BounceRate,
    ChangePercentage,
    DefaultCellRightAlign,
} from "../../../components/React/Table/cells";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { LinkRowContainer } from "../conversionTableContainer/StyledComponents";
import { ConversionSegmentsUtils, ISegmentData } from "../ConversionSegmentsUtils";

export const ConversionLeaderboardTableColumnsConfig = (segments) => [
    {
        field: "Domain",
        displayName: i18nFilter()("conversion.home.leaderboard.table.column.domain"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: ({ value, row }) => {
            const segmentData = ConversionSegmentsUtils.getSegmentById(segments, row.SegmentId);
            const subtitleFilters = [];
            if (!segmentData.isSingleLob) {
                subtitleFilters.push({
                    filter: "text",
                    value: segmentData.segmentName,
                });
            }

            return (
                <ComponentsProvider components={{ WebsiteTooltip }}>
                    <CoreWebsiteCell
                        icon={row.Favicon}
                        domain={value}
                        externalLink={`http://${value}`}
                        trackExternalLink={() =>
                            allTrackers.trackEvent(
                                "external link",
                                "click",
                                `Conversion Category Overview`,
                            )
                        }
                        subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                    />
                </ComponentsProvider>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        showTotalCount: false,
        visible: true,
        minWidth: 250,
    },
    {
        field: "Stickiness",
        displayName: i18nFilter()("conversion.home.leaderboard.table.column.stickiness"),
        type: "double",
        format: "number",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("conversion.home.leaderboard.table.tooltip.stickiness"),
        visible: true,
        minWidth: 96,
    },
    {
        field: "Growth",
        displayName: i18nFilter()("conversion.home.leaderboard.table.column.conversion.growth"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("conversion.home.leaderboard.table.tooltip.conversion.growth"),
        visible: true,
        minWidth: 96,
    },
    {
        field: "ConversionRate",
        displayName: i18nFilter()("conversion.home.leaderboard.table.column.conversion.rate"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        cellComponent: BounceRate,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("conversion.home.leaderboard.table.tooltip.conversion.rate"),
        visible: true,
        minWidth: 96,
    },
    {
        field: "ConvertedVisits",
        displayName: i18nFilter()("conversion.home.leaderboard.table.column.converted.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("conversion.home.leaderboard.table.tooltip.converted.visits"),
        visible: true,
        minWidth: 126,
    },
];

export const TopConversionConfig = (cell) =>
    cell.field === "Domain" || cell.field === "ConvertedVisits" || cell.field === "ConversionRate";
export const TopStickynessConfig = (cell) =>
    cell.field === "Domain" || cell.field === "ConvertedVisits" || cell.field === "Stickiness";
export const TopGrowingConfig = (cell) =>
    cell.field === "Domain" || cell.field === "ConvertedVisits" || cell.field === "Growth";

export const ConversionLeaderboardTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    selectedConfigFilter,
    segments: ISegmentData,
) => {
    return ConversionLeaderboardTableColumnsConfig(segments)
        .filter(selectedConfigFilter)
        .map((col, idx) => {
            if (!col.sortable || !sortbyField) {
                return col;
            }
            return {
                ...col,
                isResizable: false,
                isSorted: col.field === sortbyField,
                sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
            };
        });
};

export const ConversionLeaderboardTableOptions = () => {
    const onLinkRowClick: any = (componentProps, row) => {
        if (!row) {
            return;
        }
        const swNavigator = Injector.get<any>("swNavigator");
        allTrackers.trackEvent(
            "Internal link",
            "click",
            `Top performing/Analyze website/${row.Domain}`,
        );
        swNavigator.go("conversion-customsegement-nogroup", {
            sid: row.SegmentId,
            country: 840,
            duration: "6m",
            comparedDuration: "12m",
        });
    };

    const drilldownLink = (
        <LinkRowContainer onClick={onLinkRowClick}>
            <IconButton
                onClick={onLinkRowClick}
                iconName="arrow-right"
                type="flat"
                placement={"right"}
            >
                {i18nFilter()("conversion.home.leaderboard.table.action.analyse")}
            </IconButton>
        </LinkRowContainer>
    );

    return {
        rowActionsComponents: [drilldownLink],
    };
};
