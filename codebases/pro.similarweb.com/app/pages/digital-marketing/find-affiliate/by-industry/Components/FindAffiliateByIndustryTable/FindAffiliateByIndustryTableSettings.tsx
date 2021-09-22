import {
    CategoryNoLinkCell,
    ChangePercentage,
    CountryCell,
    IndexCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import * as React from "react";
import { i18nFilter } from "filters/ngFilters";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { NewChangeWrapper } from "pages/digital-marketing/find-affiliate/by-industry/Components/FindAffiliateByIndustryTable/StyledComponents";

export const DEFAULT_SORT_FIELD = "TotalShare";
export const DEFAULT_SORT_DIRECTION = "desc";
const i18n = i18nFilter();

export const getWebsiteTypeOptions = () => {
    return [
        {
            id: "2",
            text: i18n("topsites.table.site.functionality.filter.transactional"),
            tooltipText: i18n("topsites.table.site.functionality.filter.transactional.tooltip"),
        },
        {
            id: "4",
            text: i18n("topsites.table.site.functionality.filter.news"),
            tooltipText: i18n("topsites.table.site.functionality.filter.news.tooltip"),
        },
        {
            id: "1",
            text: i18n("topsites.table.site.functionality.filter.other"),
            tooltipText: i18n("topsites.table.site.functionality.filter.other.tooltip"),
        },
    ];
};

export const getTableColumns = (
    sortedColumn = { field: DEFAULT_SORT_FIELD, sortDirection: DEFAULT_SORT_DIRECTION },
) => {
    const tableColumns: any[] = [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            isResizable: false,
            width: 40,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 40,
            isResizable: false,
        },
        {
            fixed: true,
            field: "Domain",
            cellComponent: WebsiteTooltipTopCell,
            displayName: "Website",
            tooltip: i18n("affiliate.by.opportunities.table.columns.domain.title.tooltip"),
            sortable: false,
            showTotalCount: true,
            width: 220,
        },
        {
            field: "TotalShare",
            cellComponent: TrafficShare,
            displayName: i18n("affiliate.by.opportunities.table.columns.share.title"),
            tooltip: i18n("affiliate.by.opportunities.table.columns.share.title.tooltip"),
            sortable: true,
            width: 152,
            isSorted: true,
        },
        {
            field: "Change",
            cellComponent: (props) =>
                props.row.NewChange ? (
                    <NewChangeWrapper>{i18n("new.label.pill")}</NewChangeWrapper>
                ) : (
                    <ChangePercentage {...props} />
                ),
            displayName: i18n("affiliate.by.opportunities.table.columns.change.title"),
            tooltip: i18n("affiliate.by.opportunities.table.columns.change.title.tooltip"),
            sortable: true,
            width: 104,
        },
        {
            field: "Category",
            cellComponent: (props) => <CategoryNoLinkCell {...props} isIconHidden={true} />,
            displayName: i18n("affiliate.by.opportunities.table.columns.category.title"),
            tooltip: i18n("affiliate.by.opportunities.table.columns.category.title.tooltip"),
            sortable: false,
            width: 232,
        },
        {
            field: "Leader",
            displayName: "Leader",
            tooltip: i18n("affiliate.by.opportunities.table.columns.leader.title.tooltip"),
            cellComponent: (props) =>
                props.value ? (
                    <WebsiteTooltipTopCell
                        {...props}
                        secondaryIcon={props.row.LeaderFavicon}
                        secondaryUrl={props.row.LeaderUrl}
                        secondaryValue={props.row.Leader}
                    />
                ) : (
                    <div style={{ marginLeft: 25 }}>-</div>
                ),
            headerComponent: DefaultCellHeader,
            sortable: false,
            visible: true,
            minWidth: 200,
        },
        {
            field: "TopCountry",
            displayName: i18n("affiliate.by.opportunities.table.columns.topCountry.title"),
            tooltip: i18n("affiliate.by.opportunities.table.columns.topCountry.title.tooltip"),
            sortable: false,
            cellComponent: (props) =>
                props.value === 0 ? (
                    <div style={{ marginLeft: 5 }}>-</div>
                ) : (
                    <CountryCell {...props} />
                ),
            headerComponent: DefaultCellHeader,
            width: 144,
            visible: true,
            ppt: {
                // override the table column format when rendered in ppt
                overrideFormat: "Country",
            },
        },
    ];
    return tableColumns.map((col: any) => {
        const isSorted = sortedColumn && col.field === sortedColumn.field;
        return {
            ...col,
            visible: col.visible !== false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection: isSorted ? sortedColumn.sortDirection : DEFAULT_SORT_DIRECTION,
            isResizable: col.isResizable !== false,
        };
    });
};
