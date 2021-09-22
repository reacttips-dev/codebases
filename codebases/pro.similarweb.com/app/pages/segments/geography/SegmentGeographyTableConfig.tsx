import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import {
    CountryCell,
    DefaultCellRightAlign,
    IndexCell,
    TrafficShare,
} from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { PercentageCellRightAlign } from "components/React/Table/cells/PercentageCell";

export const SegmentsGeoTableColumnsConfig = [
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
        displayName: i18nFilter()("segment.analysis.geo.table.column.country"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: CountryCell,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("segment.analysis.geo.table.tooltip.country"),
        width: 300,
        showTotalCount: false,
        visible: true,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "TrafficShare",
        displayName: i18nFilter()("segment.analysis.geo.table.column.traffic.share"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.geo.table.tooltip.traffic.share"),
        width: 130,
        visible: true,
    },
    {
        field: "Duration",
        displayName: i18nFilter()("segment.analysis.geo.table.column.duration"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.geo.table.tooltip.duration"),
        width: 130,
        visible: true,
    },
    {
        field: "PagePerVisit",
        displayName: i18nFilter()("segment.analysis.geo.table.column.pages.per.visit"),
        type: "double",
        format: "number:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.geo.table.tooltip.pages.per.visit"),
        width: 130,
        visible: true,
    },
    {
        field: "BounceRate",
        displayName: i18nFilter()("segment.analysis.geo.table.column.bounce.rate"),
        type: "double",
        format: "percentage:2",
        sortable: true,
        isSorted: false,
        cellComponent: PercentageCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("segment.analysis.geo.table.tooltip.bounce.rate"),
        width: 130,
        visible: true,
    },
];

export const SegmentsAnalysisGeoTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
) => {
    return SegmentsGeoTableColumnsConfig.map((col, idx) => {
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
