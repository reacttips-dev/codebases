import isUndefined from "lodash/isUndefined";
import pickBy from "lodash/pickBy";
import {
    AdsenseCell,
    CategoryCell,
    ChangePercentage,
    IndexCell,
    RankCell,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "../../../components/React/Table/cells";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells";
import { i18nFilter } from "../../../filters/ngFilters";

export const getColumns = (sortedColumn = { field: "Share", sortDirection: "desc" }) => {
    return [
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 65,
        },
        {
            fixed: true,
            field: "Domain",
            displayName: i18nFilter()("analysis.dest.out.table.columns.domain.title"),
            tooltip: i18nFilter()("analysis.dest.out.table.columns.domain.title.tooltip"),
            cellComponent: WebsiteTooltipTopCell,
            sortable: true,
            showTotalCount: true,
            groupable: true,
            width: 270,
        },
        {
            field: "Category",
            displayName: i18nFilter()("analysis.dest.out.table.columns.category.title"),
            tooltip: i18nFilter()("analysis.dest.out.table.columns.category.title.tooltip"),
            cellComponent: CategoryCell,
            sortable: true,
            minWidth: 220,
        },
        {
            field: "Rank",
            displayName: i18nFilter()("analysis.dest.out.table.columns.rank.title"),
            tooltip: i18nFilter()("analysis.dest.out.table.columns.rank.title.tooltip"),
            cellComponent: RankCell,
            format: "rank",
            sortable: true,
            width: 120,
        },
        {
            field: "Share",
            displayName: i18nFilter()("analysis.dest.out.table.columns.share.title"),
            tooltip: i18nFilter()("analysis.dest.out.table.columns.share.title.tooltip"),
            cellComponent: TrafficShare,
            sortable: true,
            minWidth: 150,
        },
        {
            field: "Change",
            displayName: i18nFilter()("analysis.dest.out.table.columns.change.title"),
            tooltip: i18nFilter()("analysis.dest.out.table.columns.change.title.tooltipSimple"),
            cellComponent: ChangePercentage,
            sortable: true,
            width: 110,
        },
        {
            field: "HasAdsense",
            displayName: i18nFilter()("analysis.all.table.columns.googleAds.title"),
            tooltip: i18nFilter()("analysis.all.table.columns.googleAds.title.tooltip"),
            cellComponent: AdsenseCell,
            sortable: true,
            width: 95,
        },
    ].map((col: any) => {
        const isSorted = sortedColumn && col.field === sortedColumn.field;

        return pickBy(
            {
                ...col,
                visible: true,
                headerComponent: DefaultCellHeader,
                isSorted,
                sortDirection: isSorted ? sortedColumn.sortDirection : "desc",
            },
            (v) => !isUndefined(v),
        );
    });
};
