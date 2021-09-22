import { ChangeAbs } from "components/React/Table/cells/ChangeAbs";
import React from "react";
import { DefaultCellRightAlign } from "../../../components/React/Table/cells/DefaultCellRightAlign";
import {
    BounceRate,
    ChangePercentage,
    DefaultCell,
} from "../../../components/React/Table/cells/index";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells/index";
import { i18nFilter } from "../../../filters/ngFilters";

const kw = {
    field: "Kw",
    fixed: true,
    width: 400,
    sortable: false,
    cellComponent: DefaultCell,
    displayName: i18nFilter()("segment.conversion.table.column.kw"),
    visible: true,
    headerComponent: DefaultCellHeader,
    showTotalCount: true,
};
const swScore = {
    field: "SwScore",
    displayName: i18nFilter()("segment.conversion.table.column.swscore"),
    type: "double",
    format: "swNumber",
    sortable: true,
    isSorted: false,
    cellComponent: DefaultCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "asc",
    tooltip: i18nFilter()("segment.conversion.table.column.swscore.tooltip"),
    visible: true,
    width: 160,
};
const upv = {
    field: "Upv",
    displayName: i18nFilter()("segment.conversion.table.column.upv"),
    type: "double",
    format: "pureNumberFixedZeros",
    sortable: true,
    isSorted: false,
    cellComponent: DefaultCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.upv.tooltip"),
    visible: true,
    width: 160,
};
const upvCompare = {
    ...upv,
    field: "UpvCompare",
    displayName: i18nFilter()("segment.conversion.table.column.upv.compare"),
    tooltip: i18nFilter()("segment.conversion.table.column.upv.compare.tooltip"),
    visible: false,
};
const upvDelta = {
    field: "UpvDelta",
    displayName: i18nFilter()("segment.conversion.table.column.upv.delta"),
    type: "double",
    format: "swNumber",
    sortable: true,
    isSorted: false,
    cellComponent: ChangeAbs,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.upv.delta.tooltip"),
    visible: true,
    width: 160,
};
const upvGrowth = {
    field: "UpvGrowth",
    displayName: i18nFilter()("segment.conversion.table.column.upv.growth"),
    type: "double",
    format: "percentagesign",
    sortable: true,
    isSorted: false,
    cellComponent: ChangePercentage,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.upv.growth.tooltip"),
    visible: true,
    width: 160,
};
const cv = {
    field: "Cv",
    displayName: i18nFilter()("segment.conversion.table.column.cv"),
    type: "double",
    format: "pureNumberFixedZeros",
    sortable: true,
    isSorted: false,
    cellComponent: DefaultCellRightAlign,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cv.tooltip"),
    visible: true,
    width: 150,
};
const cvCompare = {
    ...cv,
    field: "CvCompare",
    displayName: i18nFilter()("segment.conversion.table.column.cv.compare"),
    tooltip: i18nFilter()("segment.conversion.table.column.cv.compare.tooltip"),
    visible: false,
};
const cvDelta = {
    ...cv,
    field: "CvDelta",
    displayName: i18nFilter()("segment.conversion.table.column.cv.delta"),
    type: "double",
    format: "swNumber",
    sortable: true,
    isSorted: false,
    cellComponent: ChangeAbs,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cv.delta.tooltip"),
    visible: true,
};
const cvGrowth = {
    field: "CvGrowth",
    displayName: i18nFilter()("segment.conversion.table.column.cv.growth"),
    type: "double",
    format: "percentagesign",
    sortable: true,
    isSorted: false,
    cellComponent: ChangePercentage,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cv.growth.tooltip"),
    visible: false,
    width: 160,
};
const cvr = {
    field: "Cvr",
    displayName: i18nFilter()("segment.conversion.table.column.cvr"),
    type: "double",
    format: "percentagesign",
    sortable: true,
    isSorted: false,
    cellComponent: BounceRate,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cvr.tooltip"),
    visible: true,
    width: 160,
};
const cvrCompare = {
    ...cvr,
    field: "CvrCompare",
    displayName: i18nFilter()("segment.conversion.table.column.cvr.compare"),
    tooltip: i18nFilter()("segment.conversion.table.column.cvr.compare.tooltip"),
    visible: false,
};
const cvrDelta = {
    field: "CvrDelta",
    displayName: i18nFilter()("segment.conversion.table.column.cvr.delta"),
    type: "double",
    format: "percentagesign",
    sortable: true,
    isSorted: false,
    cellComponent: ChangePercentage,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cvr.delta.tooltip"),
    visible: true,
    width: 160,
};
const cvrGrowth = {
    field: "CvrGrowth",
    displayName: i18nFilter()("segment.conversion.table.column.cvr.growth"),
    type: "double",
    format: "percentagesign",
    sortable: true,
    isSorted: false,
    cellComponent: ChangePercentage,
    headerComponent: DefaultCellHeaderRightAlign,
    sortDirection: "desc",
    tooltip: i18nFilter()("segment.conversion.table.column.cvr.growth.tooltip"),
    visible: false,
    width: 160,
};

export const ConversionSegmentsOssTableColumnConfig = () => [
    kw,
    // swScore,
    upv,
    upvGrowth,
    cv,
    cvGrowth,
    cvr,
    cvrGrowth,
];

export const ConversionSegmentsOssCompareDurationTableColumnConfig = () => [
    kw,
    // swScore,
    upvCompare,
    upv,
    upvDelta,
    cvCompare,
    cv,
    cvDelta,
    cvrCompare,
    cvr,
    cvrDelta,
];

export const ConversionSegmentsOssTableConfigGen = (
    { sortbyField, sortDirection },
    comparedDuration,
) => {
    const columns = comparedDuration
        ? ConversionSegmentsOssCompareDurationTableColumnConfig()
        : ConversionSegmentsOssTableColumnConfig();
    return columns.map((col: any, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: col.field === sortbyField,
            visible: col.visible !== false,
            sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};
