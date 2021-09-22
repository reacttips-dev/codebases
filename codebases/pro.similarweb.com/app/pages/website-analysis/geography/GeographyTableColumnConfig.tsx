import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import {
    ChangePercentage,
    CountryCell,
    DefaultCellRightAlign,
    GroupTrafficShare,
    IndexCell,
    RankCell,
    TrafficShare,
} from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { PercentageCellRightAlign } from "components/React/Table/cells/PercentageCell";

export const GeographyTableColumnsSingleConfig = [
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 65,
        visible: true,
    },
    {
        fixed: true,
        field: "Country",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.country.title"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: CountryCell,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("analysis.audience.geo.table.columns.country.title.tooltip"),
        width: 300,
        showTotalCount: true,
        visible: true,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "Share",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.share.title"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("analysis.audience.geo.table.columns.share.title.tooltip"),
        width: 130,
        visible: true,
    },
    {
        field: "Change",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.change.title"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isSorted: false,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("widget.table.tooltip.topsites.change"),
        width: 130,
        visible: true,
    },
    {
        field: "Rank",
        displayName: i18nFilter()("wa.ao.ranks.country"),
        type: "long",
        format: "swRank",
        sortable: true,
        isSorted: false,
        sortDirection: "desc",
        groupable: false,
        cellComponent: RankCell,
        headerComponent: DefaultCellHeaderRightAlign,
        totalCount: false,
        tooltip: i18nFilter()("widget.table.tooltip.topsites.rank"),
        width: 130,
        visible: true,
    },
    {
        field: "AvgVisitDuration",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.AvgTime.title"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("widget.table.tooltip.topsites.avgvisitduration"),
        width: 130,
        visible: true,
    },
    {
        field: "PagePerVisit",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.PPV.title"),
        type: "double",
        format: "number:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("widget.table.tooltip.topsites.ppv"),
        width: 130,
        visible: true,
    },
    {
        field: "BounceRate",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.BounceRate.title"),
        type: "double",
        format: "percentage:2",
        sortable: true,
        isSorted: false,
        cellComponent: PercentageCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("widget.table.tooltip.topsites.bouncerate"),
        width: 130,
        visible: true,
    },
];

export const GeographyTableColumnsCompareConfig = [
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 65,
        visible: true,
    },
    {
        fixed: true,
        field: "Country",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.country.title"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: CountryCell,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("analysis.audience.geo.table.columns.country.title.tooltip"),
        width: 300,
        showTotalCount: true,
        visible: true,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "Share",
        displayName: i18nFilter()("analysis.audience.geo.table.columns.share.title"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        tooltip: i18nFilter()("analysis.audience.geo.table.columns.share.title.tooltip"),
        width: 130,
        visible: true,
    },
    {
        field: "ShareList",
        displayName: i18nFilter()("analysis.source.search.all.table.columns.shareCompare.title"),
        type: "double[]",
        format: "percentagesign",
        sortable: false,
        isSorted: false,
        groupable: false,
        headerComponent: DefaultCellHeader,
        cellComponent: GroupTrafficShare,
        totalCount: false,
        tooltip: i18nFilter()("analysis.audience.geo.table.columns.share.title.tooltip"),
        width: 230,
        visible: true,
        ppt: {
            // Indicates that we want to split this column into sub-columns
            // where each sub-column will be a table entity (table item - a website/app/category.
            // such as ynet.co.il, whatsapp, all industries etc.)
            splitColumnToEntities: true,

            // override the table column format when rendered in ppt
            overrideFormat: "smallNumbersPercentage:1",

            // Override default value when no value is present in a table row
            defaultValue: "0",
        },
    },
];

export const GeographyTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    isCompare: boolean,
) => {
    if (isCompare) {
        return GeographyTableColumnsCompareConfig.map((col, idx) => {
            if (!col.sortable) {
                return col;
            }
            return {
                ...col,
                isSorted: col.field === sortbyField,
                sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
            };
        });
    }
    return GeographyTableColumnsSingleConfig.map((col, idx) => {
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
