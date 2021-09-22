import React from "react";
import {
    ChangePercentage,
    CountryCell,
    PercentageCell,
    TrafficShare,
} from "../../../components/React/Table/cells";
import { DefaultCellRightAlign } from "../../../components/React/Table/cells/DefaultCellRightAlign";
import { BounceRate, IndexCell } from "../../../components/React/Table/cells/index";
import { RowSelectionConsumer } from "../../../components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells/index";
import { i18nFilter } from "../../../filters/ngFilters";
import { PercentageCellRightAlign } from "../../../components/React/Table/cells/PercentageCell";

export const IndustryAnalysisGeoTableColumnsConfig = [
    {
        fixed: true,
        cellComponent: RowSelectionConsumer,
        disableHeaderCellHover: true,
        sortable: false,
        width: 33,
        headerComponent: DefaultCellHeader,
        visible: true,
    },
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
        displayName: i18nFilter()("industry.analysis.geo.table.column.country"),
        type: "string",
        format: "None",
        sortable: true,
        isSorted: false,
        cellComponent: CountryCell,
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.country"),
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
        displayName: i18nFilter()("industry.analysis.geo.table.column.traffic.share"),
        type: "double",
        sortable: true,
        isSorted: false,
        cellComponent: TrafficShare,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.traffic.share"),
        width: 130,
        visible: true,
    },
    {
        field: "Visits",
        displayName: i18nFilter()("industry.analysis.geo.table.column.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.visits"),
        width: 130,
        visible: true,
    },
    {
        field: "Growth",
        displayName: i18nFilter()("industry.analysis.geo.table.column.growth"),
        type: "double",
        format: "abbrNumberSupportNegative:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.growth"),
        width: 130,
        visible: true,
    },
    {
        field: "GrowthPercentage",
        displayName: i18nFilter()("industry.analysis.geo.table.column.growth.percentage"),
        type: "double",
        format: "percentagesign:2",
        sortable: true,
        isSorted: false,
        cellComponent: ChangePercentage,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.growth.percentage"),
        width: 130,
        visible: true,
    },
    {
        field: "TimePerVisit",
        displayName: i18nFilter()("industry.analysis.geo.table.column.time.per.visit"),
        type: "double",
        format: "time",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.time.per.visit"),
        width: 130,
        visible: true,
    },
    {
        field: "PagesPerVisit",
        displayName: i18nFilter()("industry.analysis.geo.table.column.pages.per.visit"),
        type: "double",
        format: "number:2",
        sortable: true,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.pages.per.visit"),
        width: 130,
        visible: true,
    },
    {
        field: "BounceRate",
        displayName: i18nFilter()("industry.analysis.geo.table.column.bounce.rate"),
        type: "double",
        format: "percentage:2",
        sortable: true,
        isSorted: false,
        cellComponent: PercentageCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("industry.analysis.geo.table.tooltip.bounce.rate"),
        width: 130,
        visible: true,
    },
];

export const IndustryAnalysisGeoTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
) => {
    return IndustryAnalysisGeoTableColumnsConfig.map((col, idx) => {
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
