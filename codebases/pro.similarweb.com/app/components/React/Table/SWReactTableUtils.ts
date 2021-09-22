import * as classNames from "classnames";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import * as React from "react";

import * as Cells from "./cells";
import * as HeaderCells from "./headerCells";

import swLog from "@similarweb/sw-log";
import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { ComponentsUtils } from "components/ComponentsUtils";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";
import { DefaultCell } from "./cells/DefaultCell";
import { DefaultCellHeader } from "./headerCells/DefaultCellHeader";
import { column, TABLE_CONFIG } from "./SWReactTableDefaults";
import { INFO_SIDEBAR_EVENTS_NS } from "../../info-sidebar/constants/infoSidebarEventNs";

function toComponentName(templateName) {
    if (templateName) {
        return templateName.match(/([^/]+?)\.htm/)[1].replace(/(.+?)(-|\b)/gi, (all, match1) => {
            return match1[0].toUpperCase() + match1.slice(1);
        });
    }
}

function getCellComponent(column) {
    if (typeof column.cellComponent === "function") {
        return column.cellComponent;
    }
    if (column?.cellComponent?.displayName) {
        return column.cellComponent;
    }
    const cellComponentName = toComponentName(column.cellTemplate || "");
    const cellComponent = Cells[cellComponentName] || Cells[cellComponentName + "Cell"];
    if (!cellComponent) {
        swLog.info(`Could not find a Cell Component for: '${column.cellTemplate}'.`);
        return DefaultCell;
    }
    return cellComponent;
}

function getHeaderCellComponent(column) {
    if (typeof column.headerComponent === "function") {
        return column.headerComponent;
    }
    if (column?.headerComponent?.displayName) {
        return column.headerComponent;
    }
    const headerComponentName = toComponentName(column.headerCellTemplate || "");
    const headerCell = HeaderCells[headerComponentName];
    if (!headerCell) {
        swLog.info(`Could not find an HeaderCell Component for: '${headerComponentName}'.`);
        return DefaultCellHeader;
    }
    return headerCell;
}

export function decorateColumn(column, tableOptions, resizedCols, isLast) {
    const COL_MIN_WIDTH = 40;
    const sortDirection =
            column.inverted && column.sortDirection
                ? toggleDirection(column)
                : column.sortDirection,
        headerSortClass = classNames(
            column.sortable ? "is-sortable" : "",
            column.isSorted ? "is-sorted sortDirection--" + sortDirection : "",
        );
    const isNarrowColumn = (parseInt(column.width) || parseInt(column.minWidth)) < COL_MIN_WIDTH;
    const isResizableColumn =
        column.isResizable !== undefined ? column.isResizable : !isLast && !isNarrowColumn;

    const resizedWidth =
        resizedCols && resizedCols[column.field] > 0
            ? {
                  width: resizedCols[column.field],
                  minWidth: null,
                  maxWidth: null,
              }
            : {};
    if (
        resizedCols &&
        resizedCols[column.field] > 0 &&
        resizedCols[column.field] !== (column.width || column.minWidth || column.maxWidth)
    ) {
        swLog.info(
            `%coverriding column's '${column.field}' width from ${
                column.width || column.minWidth || column.maxWidth
            } to ${resizedCols[column.field]} (retrieved from local user preferences)`,
            "color:blue",
        );
    }

    return Object.assign(
        {},
        column,
        {
            columnClass: classNames(column.columnClass, {
                "swReactTable-column": isResizableColumn,
                "swReactTable-unResizeColumn": !isResizableColumn,
            }),
            isSortedClass: column.sortable && column.isSorted ? "is-sorted" : "",
            headerCellClass: classNames({
                ["swReactTableHeaderCell swTable-headerCell"]: true,
                [column.headerCellClass]: true,
                [headerSortClass]: true,
                ["u-force-hide"]: tableOptions.hideHeader,
                ["nohover"]: column.disableHeaderCellHover,
            }),
            cellClass: classNames(column.cellClass, "swReactTableCell", "swTable-cell", {
                "resizeableCell-hover": isResizableColumn,
            }),
            width: _.includes(column.width, "%") ? column.width : parseInt(column.width),
            minWidth: _.includes(column.minWidth, "%")
                ? column.minWidth
                : parseInt(column.minWidth),
            maxWidth: _.includes(column.maxWidth, "%")
                ? column.maxWidth
                : parseInt(column.maxWidth),
            CellComponent: getCellComponent(column),
            HeaderComponent: getHeaderCellComponent(column),
        },
        resizedWidth,
    );
}

export function setColumnWidth(isBigTable, col, isLast?) {
    const style: React.CSSProperties = {};
    if (col.width && (col.minWidth || col.maxWidth)) {
        console.error("col.width && col.minWidth both have values");
    }
    if (col.width) {
        style.flexShrink = 0;
        style.flexGrow = 0;
        style.flexBasis = col.width;
    } else {
        if (col.minWidth) {
            style.flexGrow = 1;
            style.flexShrink = !isBigTable ? 0 : style.flexShrink;
            style.flexBasis = col.minWidth;
        }
        if (col.maxWidth) {
            style.flexGrow = 1;
            style.maxWidth = col.maxWidth;
        }
    }

    if (isBigTable) {
        // fixed columns do not grow
        if (col.fixed) {
            style.flexGrow = 0;
        }
        // last columns must grow
        if (isLast && !col.lastColumnFixed) {
            style.flexGrow = 1;
            style.maxWidth = undefined;
        }
    }

    return style;
}

export function trackEvent(tableOptions, category, subname?, action?, value?) {
    if (category === "upgrade") {
        allTrackers.trackEvent("Internal Link", "click", "Hook/Table/Pricing Page");
    } else {
        let subName = subname;
        if (tableOptions && tableOptions.trackName) {
            subName = i18nFilter()(tableOptions.trackName) + "/" + subName;
        }
        allTrackers.trackEvent(category, action, "Table/" + subName + (value ? "/" + value : ""));
    }
}

export function toggleDirection(col) {
    return col.sortDirection.toLowerCase() === "asc" ? "desc" : "asc";
}

export function getTableMetadata(tableData, hasChilds, totalCount) {
    return {
        totalCount,
        minCellValue: tableData.minCellValue,
        maxCellValue: tableData.maxCellValue,
        page: tableData.page,
        pageSize: tableData.pageSize,
        upgradeUrl: swSettings["swurls"].UpgradeAccountURL,
        hasChilds,
        Header: tableData.Header,
    };
}

export function getElementOffsetTop(el) {
    if (!el) {
        return 0;
    }
    let top = el.offsetTop;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
    }
    return top;
}

export function onLoadMoreData(pageSize, onUpdateData) {
    onUpdateData({ pageSize });
}

export function addIndexColumn(columns, overrideWidth = "65px") {
    if (
        columns.length === 0 ||
        (columns[0].cellTemplate &&
            columns[0].cellTemplate !== TABLE_CONFIG.cellTemplatePath + "row-info.html")
    ) {
        columns.unshift(
            column({
                width: overrideWidth,
                sortable: false,
                cellTemplate: "row-info",
            }),
        );
    }
}

export function addReactIndexColumn(columns, cellClass = "") {
    const index = column({
        width: 65,
        cellTemplate: "index",
        sortable: false,
        cellClass,
        fixed: true,
        disableHeaderCellHover: true,
    });
    columns.unshift(index);
}

export function addSelectionColumn(columns) {
    columns.unshift(
        column({
            width: "27px",
            sortable: false,
            cellTemplate: "row-selection",
            cellClass: "row-selection-cell",
        }),
    );
}

export function markSortedColumn(name, columns, defaultSorted) {
    const defaultSortedColumn = defaultSorted || "Share desc";
    const sortedColumn =
        ComponentsUtils.parseURLQueryString(window.location.href)[name + "_orderby"] ||
        defaultSortedColumn;
    const split = sortedColumn.split(" ");
    columns.forEach((column) => {
        column.isSorted = column.field === split[0];
        column.sortDirection = column.sortDirection || split[1];
    });
}

export function toggleSidebar(domain) {
    (Injector.get("$rootScope") as IRootScopeService).$emit(
        INFO_SIDEBAR_EVENTS_NS + ".exec",
        "toggle",
        domain,
    );
}

export const paddingRightCell = {
    field: "paddingRightCell",
    displayName: "",
    type: "string",
    format: "None",
    sortable: false,
    isSorted: false,
    cellComponent: () => "",
    headerComponent: DefaultCellHeader,
    sortDirection: "desc",
    tooltip: "",
    visible: true,
};
