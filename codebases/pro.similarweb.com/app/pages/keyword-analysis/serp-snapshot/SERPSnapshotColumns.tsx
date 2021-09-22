import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { invertSortDirection } from "UtilitiesAndConstants/UtilityFunctions/sort";
import moment from "moment";
import { FORMAT_VISUAL } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { PositionAbsoluteChangeCell } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/PositionAbsoluteChangeCell";
import { i18nFilter } from "filters/ngFilters";
import { SERPPositionCell } from "components/React/Table/cells/SERPPositionCell";
import { SERPSnapshotDomainCell } from "./SERPSnapshotDomainCell";
import { SERPSnapshotResultCell } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotResultCell";

const i18n = i18nFilter();

interface IColumnsConfigArguments {
    sortedColumn: string;
    sortDirection: string;
    currentMonth: string;
}

type InnerTableTopColumnConfigArguments = Omit<IColumnsConfigArguments, "currentMonth">;

export const tableColumns = {
    getColumnsConfig: ({ sortedColumn, sortDirection, currentMonth }: IColumnsConfigArguments) => {
        const columns = [
            {
                field: "position",
                trackingName: "Position",
                displayName: i18n("keyword.research.serp.snapshot.columns.position"),
                headerComponent: DefaultCellHeader,
                tooltip: i18n("keyword.research.serp.snapshot.columns.position.tooltip", {
                    current: moment.utc(currentMonth).format(FORMAT_VISUAL),
                }),
                cellComponent: SERPPositionCell,
                sortable: true,
                sortDirection: "asc",
                width: 98,
                cellClass: "serp-snapshot-table-cell right-alignment",
                inverted: "True",
            },
            {
                field: "Change",
                trackingName: "Change",
                displayName: i18n("keyword.research.serp.snapshot.columns.change"),
                headerComponent: DefaultCellHeaderRightAlign,
                tooltip: i18n("keyword.research.serp.snapshot.columns.change.tooltip", {
                    current: moment.utc(currentMonth).format(FORMAT_VISUAL),
                    previous: moment.utc(currentMonth).subtract(1, "month").format(FORMAT_VISUAL),
                }),
                cellComponent: PositionAbsoluteChangeCell,
                width: 114,
                cellClass: "serp-snapshot-table-cell right-alignment",
                showTooltip: true,
            },
            {
                field: "url",
                trackingName: "SerpSnapshotResult",
                tooltip: i18n("keyword.research.serp.snapshot.columns.url.tooltip"),
                displayName: i18n("keyword.research.serp.snapshot.columns.url"),
                headerComponent: DefaultCellHeader,
                cellComponent: SERPSnapshotResultCell,
                minWidth: 450,
                cellClass: "serp-snapshot-table-cell",
            },
            {
                field: "site",
                trackingName: "SerpSnapshotDomain",
                tooltip: i18n("keyword.research.serp.snapshot.columns.site.tooltip"),
                displayName: i18n("keyword.research.serp.snapshot.columns.domain"),
                headerComponent: DefaultCellHeader,
                cellComponent: SERPSnapshotDomainCell,
                width: 225,
                cellClass: "serp-snapshot-table-cell",
            },
        ].filter((column) => !!column);

        return columns.map<any>((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn;
            return {
                ...col,
                visible: true,
                sortable: col.sortable || false,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted
                    ? col.inverted
                        ? invertSortDirection(sortDirection)
                        : sortDirection
                    : "desc",
            };
        });
    },
    getWidgetTableColumnsConfig: ({
        sortedColumn,
        sortDirection,
    }: InnerTableTopColumnConfigArguments) => {
        const columns = [
            {
                field: "position",
                trackingName: "Position",
                displayName: i18n("keyword.research.serp.snapshot.columns.position"),
                tooltip: i18n("keyword.research.serp.snapshot.top.table.columns.position.tooltip"),
                headerComponent: DefaultCellHeader,
                cellComponent: SERPPositionCell,
                sortable: true,
                sortDirection: "asc",
                width: 92,
                inverted: "True",
            },
            {
                field: "Change",
                trackingName: "Change",
                displayName: i18n("keyword.research.serp.snapshot.columns.change"),
                tooltip: i18n("keyword.research.serp.snapshot.top.table.columns.change.tooltip"),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: PositionAbsoluteChangeCell,
                width: 114,
                showTooltip: true,
            },
            {
                field: "url",
                trackingName: "Featured URL",
                displayName: i18n("keyword.research.serp.snapshot.columns.url"),
                tooltip: i18n("keyword.research.serp.snapshot.top.table.columns.url.tooltip"),
                headerComponent: DefaultCellHeader,
                cellComponent: SERPSnapshotResultCell,
                minWidth: 120,
            },
            {
                field: "site",
                trackingName: "SerpSnapshotDomain",
                displayName: i18n("keyword.research.serp.snapshot.columns.domain"),
                tooltip: i18n("keyword.research.serp.snapshot.top.table.columns.site.tooltip"),
                headerComponent: DefaultCellHeader,
                cellComponent: SERPSnapshotDomainCell,
                width: 225,
            },
        ].filter((column) => !!column);

        return columns.map<any>((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn;
            return {
                ...col,
                visible: true,
                sortable: col.sortable || false,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted
                    ? col.inverted
                        ? invertSortDirection(sortDirection)
                        : sortDirection
                    : "desc",
            };
        });
    },
};
