import { default as React } from "react";
import {
    ChangePercentage,
    CountryCell,
    DefaultCell,
    IndexCell,
    OrganicPaid,
    TrafficShare,
    UrlCellWebsiteAnalysis,
    VisitsThreshHoldCell,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { DefaultCellHeader, HeaderCellBlank } from "components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { i18nFilter } from "filters/ngFilters";

const DEFAULT_SORT_FIELD = "Share";
const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();

export const FindAffiliateByKeywordsTableSettings = {
    defaultSortField: DEFAULT_SORT_FIELD,
    defaultSortDirection: DEFAULT_SORT_DIRECTION,
    searchFieldName: "Domain",
    getColumns: (
        sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
        useSelection = true,
    ) => {
        const columns: any = [
            {
                fixed: true,
                cellComponent: RowSelectionConsumer,
                sortable: false,
                headerComponent: SelectAllRowsHeaderCellConsumer,
                isResizable: false,
                width: 40,
                visible: useSelection,
            },
            {
                fixed: true,
                cellComponent: IndexCell,
                headerComponent: HeaderCellBlank,
                disableHeaderCellHover: true,
                sortable: false,
                isResizable: false,
                width: 40,
            },
            {
                width: 230,
                isResizable: true,
                sortable: true,
                fixed: true,
                field: "Domain",
                showTotalCount: true,
                displayName: i18n("affiliate.by.opportunities.table.columns.domain.title"),
                tooltip: i18n("affiliate.by.keywords.table.columns.domain.title.tooltip"),
                cellComponent: WebsiteTooltipTopCell,
            },
            {
                width: 112,
                isResizable: true,
                sortable: true,
                field: "Share",
                displayName: i18n("affiliate.by.opportunities.table.columns.share.title"),
                tooltip: i18n("affiliate.by.opportunities.table.columns.share.title.tooltip"),
                cellComponent: TrafficShare,
                groupKey: "keyword",
            },
            {
                width: 159,
                isResizable: true,
                field: "Category",
                displayName: i18n("affiliate.by.opportunities.table.columns.category.title"),
                tooltip: i18n("affiliate.by.opportunities.table.columns.category.title.tooltip"),
                cellComponent: (props) =>
                    props.value === "Unknown" ? <>-</> : <DefaultCell {...props} />,
                groupKey: "website",
            },
            {
                width: 90,
                isResizable: true,
                field: "AvgVisitsPerMonth",
                displayName: i18n(
                    "affiliate.by.opportunities.table.columns.avgVisitsPerMonth.title",
                ),
                tooltip: i18n(
                    "affiliate.by.opportunities.table.columns.avgVisitsPerMonth.title.tooltip",
                ),
                cellComponent: VisitsThreshHoldCell,
                groupKey: "website",
            },
            {
                width: 104,
                isResizable: true,
                field: "Organic",
                displayName: i18n("affiliate.by.opportunities.table.columns.OrganicVsPaid.title"),
                tooltip: i18n(
                    "affiliate.by.opportunities.table.columns.OrganicVsPaid.title.tooltip",
                ),
                cellComponent: OrganicPaid,
                groupKey: "keyword",
            },

            {
                width: 110,
                isResizable: true,
                field: "Url",
                displayName: i18n("affiliate.by.opportunities.table.columns.referringUrl.title"),
                tooltip: i18n(
                    "affiliate.by.opportunities.table.columns.referringUrl.title.tooltip",
                ),
                cellComponent: UrlCellWebsiteAnalysis,
                groupKey: "keyword",
            },
            {
                width: 120,
                isResizable: true,
                field: "HighestTrafficCountry",
                displayName: i18n("affiliate.by.opportunities.table.columns.topCountry.title"),
                tooltip: i18n("affiliate.by.opportunities.table.columns.topCountry.title.tooltip"),
                cellComponent: (props) =>
                    props.value === 0 ? (
                        <div style={{ marginLeft: 5 }}>-</div>
                    ) : (
                        <CountryCell {...props} />
                    ),
                visible: false,
                groupKey: "website",
                ppt: {
                    // override the table column format when rendered in ppt
                    overrideFormat: "Country",
                },
            },
            {
                width: 200,
                isResizable: true,
                field: "Leader",
                displayName: i18n("affiliate.by.opportunities.table.columns.leader.title"),
                tooltip: i18n("affiliate.by.opportunities.table.columns.leader.title.tooltip"),
                cellComponent: (props) =>
                    props.value ? (
                        <WebsiteTooltipTopCell
                            {...props}
                            secondaryIcon={props.row.LeaderFavicon}
                            secondaryUrl={props.row.LeaderUrl}
                            secondaryValue={props.value}
                        />
                    ) : (
                        <div style={{ marginLeft: 25 }}>-</div>
                    ),
                visible: false,
                groupKey: "website",
            },
            {
                minWidth: 90,
                isResizable: true,
                field: "Change",
                displayName: i18n("affiliate.by.opportunities.table.columns.change.title"),
                tooltip: i18n("affiliate.by.opportunities.table.columns.change.title.tooltip"),
                cellComponent: ChangePercentage,
                visible: false,
                groupKey: "keyword",
            },
            {
                minWidth: 100,
                isResizable: true,
                field: "OutGoingVisits",
                displayName: i18n("affiliate.by.opportunities.table.columns.outgoingVisits.title"),
                tooltip: i18n(
                    "affiliate.by.opportunities.table.columns.outgoingVisits.title.tooltip",
                ),
                cellComponent: VisitsThreshHoldCell,
                visible: false,
                groupKey: "website",
            },
        ];
        return columns.map((col: any) => {
            const isSorted = sortedColumn && col.field === sortedColumn.field;
            return {
                ...col,
                visible: col.visible !== false,
                headerComponent: col.headerComponent || DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            };
        });
    },
};
