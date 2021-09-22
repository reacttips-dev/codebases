import React from "react";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";

import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";
import { ChangePercentage, TrafficShare } from "../../../components/React/Table/cells";
import { DefaultCellRightAlign } from "../../../components/React/Table/cells/DefaultCellRightAlign";
import { PercentageCellRightAlign } from "../../../components/React/Table/cells/PercentageCell";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells/index";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";

export const ArenaTableColumnsConfig = [
    {
        fixed: true,
        field: "Site",
        displayName: i18nFilter()("arena.visits.table.column.domain"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: ({ row }) => {
            return (
                <ComponentsProvider components={{ WebsiteTooltip }}>
                    <CoreWebsiteCell
                        icon={row.Favicon}
                        domain={row.Site}
                        internalLink={Injector.get<SwNavigator>("swNavigator").href(
                            "websites-worldwideOverview",
                            {
                                key: row.Site,
                                country: row.country,
                                duration: row.duration,
                                webSource: row.webSource,
                                isWWW: row.includeSubDomains ? "*" : "-",
                            },
                        )}
                        externalLink={`http://${row.Site}`}
                        trackExternalLink={() =>
                            allTrackers.trackEvent("external link", "click", `Arena visits table`)
                        }
                        showGaIcon={row.showGAIcon}
                        isGaPrivate={row.isGAPrivate}
                    />
                </ComponentsProvider>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("arena.visits.table.tooltip.domain"),
        width: 244,
        showTotalCount: false,
        visible: true,
    },
    {
        field: "TotalVisitsShare",
        displayName: i18nFilter()("arena.visits.table.column.traffic.share"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.traffic.share"),
        width: 224,
        visible: true,
    },
    {
        field: "TotalVisits",
        displayName: i18nFilter()("arena.visits.table.column.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.visits"),
        width: 136,
        visible: true,
    },
    {
        field: "VisitsChangeWithinPeriod",
        displayName: i18nFilter()("arena.visits.table.column.change"),
        sortable: true,
        isSorted: false,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.change"),
        width: 136,
        visible: true,
    },
    {
        field: "UniqueUsers",
        displayName: i18nFilter()("arena.visits.table.column.unique.users"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.column.unique.users.tooltip"),
        width: 136,
        visible: true,
    },
    {
        field: "TotalDuration",
        displayName: i18nFilter()("arena.visits.table.column.time.per.visit"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.time.per.visit"),
        width: 136,
        visible: true,
    },
    {
        field: "TotalPagesPerVisit",
        displayName: i18nFilter()("arena.visits.table.column.pages.per.visit"),
        type: "double",
        format: "number:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.pages.per.visit"),
        width: 136,
        visible: true,
    },
    {
        field: "BounceRate",
        displayName: i18nFilter()("arena.visits.table.column.bounce.rate"),
        type: "double",
        format: "percentage:2",
        sortable: true,
        isSorted: false,
        cellComponent: PercentageCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.bounce.rate"),
        width: 136,
        visible: true,
    },
];

export const ArenaUnbouncedTableColumnsConfig = [
    {
        field: "Site",
        displayName: i18nFilter()("arena.visits.table.column.domain"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: ({ value, row }) => {
            return (
                <ComponentsProvider components={{ WebsiteTooltip }}>
                    <CoreWebsiteCell
                        icon={row.Favicon}
                        domain={value}
                        externalLink={`http://${value}`}
                        trackExternalLink={() =>
                            allTrackers.trackEvent("external link", "click", `Arena visits table`)
                        }
                        showGaIcon={row.showGAIcon}
                        isGaPrivate={row.isGAPrivate}
                    />
                </ComponentsProvider>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("arena.visits.table.tooltip.domain"),
        width: 244,
        showTotalCount: false,
        visible: true,
    },
    {
        field: "TotalUnbounceVisitsShare",
        displayName: i18nFilter()("arena.visits.table.column.traffic.share"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.traffic.share"),
        width: 224,
        visible: true,
    },
    {
        field: "UnbounceVisits",
        displayName: i18nFilter()("arena.visits.table.column.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.visits"),
        width: 136,
        visible: true,
    },
    {
        field: "UnbounceVisitsChangeWithinPeriod",
        displayName: i18nFilter()("arena.visits.table.column.change"),
        sortable: true,
        isSorted: false,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.change"),
        width: 136,
        visible: true,
    },
    {
        field: "UnbounceVisitDuration",
        displayName: i18nFilter()("arena.visits.table.column.time.per.visit"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.time.per.visit"),
        width: 136,
        visible: true,
    },
    {
        field: "UnbouncePagesPerVists",
        displayName: i18nFilter()("arena.visits.table.column.pages.per.visit"),
        type: "double",
        format: "number:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("arena.visits.table.tooltip.pages.per.visit"),
        width: 136,
        visible: true,
    },
];

export const ArenaTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    unbounceVisits: boolean,
) => {
    let selectedConfig: any = ArenaTableColumnsConfig;
    if (unbounceVisits) {
        selectedConfig = ArenaUnbouncedTableColumnsConfig;
    }
    return selectedConfig.map((col, idx) => {
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
