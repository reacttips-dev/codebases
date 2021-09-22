import * as React from "react";
import {
    CountryCell,
    DefaultCell,
    DefaultCellRightAlign,
    IndexCell,
    OrganicPaid,
    RelevancyCell,
} from "../../../components/React/Table/cells";
import {
    DefaultCellHeaderRightAlign,
    DefaultEllipsisHeaderCell,
    HeaderCellBlank,
} from "../../../components/React/Table/headerCells";
import { i18nFilter } from "../../../filters/ngFilters";

export const DEFAULT_SORT = "Score";
export const DEFAULT_SORT_DIRECTION = "desc";

export const AmazonKeywordGeneratorRelatedColumnsConfig = {
    getColumns: () => {
        return [
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
                fixed: true,
                field: "Keyword",
                sortable: true,
                showTotalCount: true,
                cellComponent: DefaultCell,
                displayName: i18nFilter()("amazon.keyword.generator.table.column.keyword"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.keyword.tooltip"),
                width: 258,
            },
            {
                field: "Score",
                sortable: true,
                cellComponent: (props) => (
                    <RelevancyCell {...props} value={Math.ceil(props.value * 5)} />
                ),
                displayName: i18nFilter()("amazon.keyword.generator.table.column.score"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.score.tooltip"),
                width: 144,
            },
            {
                field: "AvgVolume",
                sortable: true,
                displayName: i18nFilter()("amazon.keyword.generator.table.table.column.volume"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.volume.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "swPosition",
                width: 100,
            },
            {
                field: "AvgClicks",
                sortable: true,
                displayName: i18nFilter()("amazon.keyword.generator.table.table.column.clicks"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.clicks.tooltip"),
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "swPosition",
                width: 100,
            },
            {
                field: "OrganicClicksShare",
                displayName: i18nFilter()("amazon.keyword.generator.table.column.organicshare"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.organicshare.tooltip"),
                cellComponent: OrganicPaid,
                width: 115,
            },
            {
                field: "YearlyTopCategory",
                sortable: true,
                displayName: i18nFilter()("amazon.keyword.generator.table.column.topCategory"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.topCategory.tooltip"),
                cellComponent: DefaultCell,
                width: 200,
            },
            {
                field: "TopCountry",
                sortable: false,
                displayName: i18nFilter()("amazon.keyword.generator.table.column.topCountry"),
                tooltip: i18nFilter()("amazon.keyword.generator.table.column.topCountry.tooltip"),
                cellComponent: CountryCell,
                width: 230,
            },
        ].map((col: any) => {
            const isSorted = col.field === DEFAULT_SORT;
            return {
                visible: true,
                headerComponent: DefaultEllipsisHeaderCell,
                isSorted,
                sortDirection: DEFAULT_SORT_DIRECTION,
                isResizable: col.isResizable !== false,
                ...col,
            };
        });
    },
};
