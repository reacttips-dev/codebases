import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
    TrafficShare,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "components/React/Table/headerCells";
import MultiColorSelectionTable from "components/React/Table/MultiColorSelectionTable";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { allTrackers } from "services/track/track";

export const OrganicSearchOverviewTabTableColumns = (excludeColumns = [], componentNameForI18n) => {
    const i18n = i18nFilter();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            isResizable: false,
            width: 48,
            disableHeaderCellHover: true,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 65,
        },
        {
            width: 200,
            sortable: false,
            field: "Domain",
            displayName: i18n(`workspaces.marketing.${componentNameForI18n}.table.column.domain`),
            // tooltip: i18n('workspaces.marketing.organic.search.table.column.domain.tooltip'),
            cellComponent: ({ value, row }) => {
                const props = {
                    domain: value,
                    icon: row.favicon,
                    target: "_blank",
                    internalLink: swNavigator.href("websites-worldwideOverview", {
                        key: value,
                        country: row.country,
                        duration: "3m",
                        webSource: "Total",
                        isWWW: "*",
                    }),
                    trackInternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
                    },
                    externalLink: `http://${value}`,
                    trackExternalLink: (e) => {
                        e.stopPropagation();
                        allTrackers.trackEvent("External Link", "click", `Table/${value}`);
                    },
                    hideTrackButton: true,
                };
                return (
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell {...props} />
                    </ComponentsProvider>
                );
            },
        },
        {
            displayName: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.trafficshare`,
            ),
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.trafficshare.tooltip`,
            ),
            field: "TrafficShare",
            cellComponent: TrafficShare,
            sortable: false,
            isResizable: true,
            width: 200,
        },
        {
            field: "Visits",
            displayName: i18n(`workspaces.marketing.${componentNameForI18n}.table.column.visits`),
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.visits.tooltip`,
            ),
            type: "double",
            format: "minVisitsAbbr",
            sortable: false,
            isResizable: true,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            width: 150,
        },
        {
            field: "Change",
            displayName: i18n(`workspaces.marketing.${componentNameForI18n}.table.column.change`),
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.change.tooltip`,
            ),
            sortable: false,
            isResizable: true,
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            width: 150,
        },
        {
            field: "ArgVisitDuration",
            displayName: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.argvisitduration`,
            ),
            type: "double",
            format: "time",
            sortable: false,
            isResizable: true,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.argvisitduration.tooltip`,
            ),
            width: 150,
        },
        {
            field: "PagesPerVisit",
            displayName: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.pagepervisit`,
            ),
            type: "double",
            format: "number:2",
            sortable: false,
            isResizable: true,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.pagepervisit.tooltip`,
            ),
            width: 150,
        },
        {
            field: "BounceRate",
            displayName: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.bouncerate`,
            ),
            type: "string",
            format: "percentagesign",
            sortable: false,
            isResizable: true,
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18n(
                `workspaces.marketing.${componentNameForI18n}.table.column.bouncerate.tooltip`,
            ),
            width: 150,
        },
    ]
        .map((column) => {
            return {
                visible: true,
                headerComponent: DefaultCellHeader,
                ...column,
            };
        })
        .filter((column) => {
            return !excludeColumns.includes(column.field);
        });
};

export const TrafficStatelessTable = ({
    tableData,
    isLoading,
    excludeColumns = [],
    tableSelectionKey,
    componentNameForI18n,
}) => {
    return (
        <MultiColorSelectionTable
            isLoading={isLoading}
            tableSelectionKey={tableSelectionKey}
            tableSelectionProperty={"Domain"}
            tableProps={{
                isLoading,
                type: "regular",
                tableData: { Data: tableData },
                tableColumns: OrganicSearchOverviewTabTableColumns(
                    excludeColumns,
                    componentNameForI18n,
                ),
            }}
            tableData={tableData}
        />
    );
};
