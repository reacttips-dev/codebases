import {
    countryTextByIdFilter,
    prettifyCategoryTextFilter,
    percentageFilter,
} from "filters/ngFilters";
import { ColumnConfig, TableCell, TableRow } from "../PptTableWidgetUtilsTypes";
import { augmentNameWithGAMark } from "components/widget/widget-utilities/widgetPpt/PptWidgetUtils";
import {
    IPptTableCell,
    IPptTableCellOptions,
    IPptTableColumn,
    PptTableRow,
} from "services/PptExportService/PptExportServiceTypes";
import { dynamicFilterFilter } from "filters/dynamicFilter";

const dynamicFilter = dynamicFilterFilter();
const percentFilter = percentageFilter();
const countryFilter = countryTextByIdFilter();
const categoryFilter = prettifyCategoryTextFilter();

const appFilter = (value: unknown, currRow: TableRow) => {
    const tooltipData = currRow["Tooltip"];
    return !!tooltipData ? tooltipData["Title"] : value;
};

const organicPaidFilter = (value: unknown, currRow: TableRow) => {
    const getOrganicPaidRatio = (organic, paid) => {
        if (organic === 0 || paid === 0) return 1;
        return organic > paid ? paid / organic : organic / paid;
    };

    const isOrganic = currRow["Organic"] === value;
    const organicValue = isOrganic ? value : currRow["Organic"];
    const paidValue = isOrganic ? currRow["Paid"] : value;
    const ratio = getOrganicPaidRatio(organicValue, paidValue);

    const adjustedValue = isOrganic ? ratio : 1 - ratio;
    return `${percentFilter(adjustedValue, 2)}%`;
};

/**
 * Returns the given table row, with its values formatted by the relevant ngFilter,
 * according to its column names.
 * @param row The table row to format
 * @param tableColumns a mapping between column names and the relevant ngFilter data format
 * @param options data adapter options
 */
export const adaptTableRowToPpt = (
    row: TableRow,
    tableColumns: IPptTableColumn[],
    columnConfigs: ColumnConfig[],
): PptTableRow => {
    const isGAVerified = !!row["isGAVerified"];

    // Since we want to "clear" any unnecessary properties from the current table row (such as "children" prop or any meta-data props)
    // we iterate over the columnToFormat mapping, and create a new object with these properties only.
    // this ensures that the returned row object will contain only the relevant table columns.
    const pptRow = tableColumns.reduce((res, column, index) => {
        const cell: TableCell = {
            value: row[column.field],
            dataFormat: column.format,
            dataType: column.type,
            cellIndex: index,
        };

        const columnConfig = columnConfigs.find((colConfig) => colConfig.name === column.field);
        const cellValue = _adaptTableCellValue(cell, row, column, columnConfig);
        const cellOptions = _adaptTableCellOptions(cell, columnConfig);

        // We want to add a Google Analytics (GA) Marker on the first column of each row
        // that is GA verified, therefore we check if the current cell is the first cell
        // and if the current row is GA verified row
        const shouldAugmentWithGA = index === 0 && isGAVerified;

        const pptCell: IPptTableCell = {
            value: augmentNameWithGAMark(cellValue, shouldAugmentWithGA),
            options: cellOptions,
        };

        return {
            ...res,
            [column.field]: pptCell,
        };
    }, {});

    return pptRow;
};

/**
 * Generate cell ppt options. these are visual options
 * that instruct the ppt API how to render the current table cell
 * (font color, size, bold etc.)
 */
const _adaptTableCellOptions = (
    cell: TableCell,
    columConfig: ColumnConfig,
): IPptTableCellOptions => {
    if (_isObjectValue(cell.value)) {
        // Check there are any props specified that should cause
        // the current cell to be highlighted (bold font in the presentation)
        const highlightProps = columConfig.ppt?.highlightCellWhenPropsTrue ?? [];
        const hasMatchingProps = highlightProps.some((prop) => {
            const hasPropOnCell = !!cell.value[prop];
            return hasPropOnCell;
        });

        return {
            bold: hasMatchingProps,
        };
    }

    return undefined;
};

/**
 * Formats a given table cell value, according to its format and data type
 * @param cell The current cell we're trying to format its value
 * @param row The current table row that this cell belongs to
 * @param options data adapter options
 */
const _adaptTableCellValue = (
    cell: TableCell,
    row: TableRow,
    column: IPptTableColumn,
    columnConfig: ColumnConfig,
) => {
    // In case the cell value consists of multiple values (its an array)
    // then we should format each of its values
    if (_isArrayValue(cell.value)) {
        return _adaptCellWithValuesArray(cell, row, column);
    }

    // In case the cell value is an object, we want to format its fields according to its column type
    // if the column should be split into sub-columns, we should treat each of its fields as a sub-column value
    // otherwise - we treat it as an array of values
    if (_isObjectValue(cell.value)) {
        const shouldSplitColumn = column.shouldSplitColumn && column.childColumns;
        return shouldSplitColumn
            ? _adaptCellAsSplitColumns(cell, row, column)
            : _adaptCellWithObjectValue(cell, row, column, columnConfig);
    }

    // Otherwise - we simply try to format the value
    return _adaptCellWithSingleValue(cell, row, column);
};

const _adaptCellWithSingleValue = (cell: TableCell, row: TableRow, column: IPptTableColumn) => {
    const cellFormat = cell.dataFormat;
    const cellValue = cell.value as unknown;
    const defaultValue = column.defaultValue ?? "N/A";

    return _formatValueWithFilter(cellValue, cellFormat, row, defaultValue);
};

const _adaptCellWithValuesArray = (cell: TableCell, row: TableRow, column: IPptTableColumn) => {
    const cellFormat = cell.dataFormat;
    const cellValues = cell.value as unknown[];
    const defaultValue = column.defaultValue ?? "N/A";

    return Object.values(cellValues).map((val) =>
        _formatValueWithFilter(val, cellFormat, row, defaultValue),
    );
};

const _adaptCellWithObjectValue = (
    cell: TableCell,
    row: TableRow,
    column: IPptTableColumn,
    columnConfig: ColumnConfig,
) => {
    const cellFormat = cell.dataFormat;
    const cellValues = cell.value as Record<string, unknown>;
    const defaultValue = column.defaultValue ?? "N/A";

    // Check if the cell object contains fields that we should ignore
    // these are values that we don't want to render in the PPT table
    const cellPropsToIgnore = columnConfig.ppt?.ignoreCellProps ?? [];

    const values = Object.entries(cellValues)
        .filter(([key]) => cellPropsToIgnore.every((prop) => prop !== key))
        .map(([, val]) => _formatValueWithFilter(val, cellFormat, row, defaultValue));

    return values.length ? values : [defaultValue];
};

const _adaptCellAsSplitColumns = (cell: TableCell, row: TableRow, column: IPptTableColumn) => {
    const cellFormat = cell.dataFormat;
    const cellValues = cell.value as Record<string, unknown>;
    const defaultValue = column.defaultValue ?? "N/A";

    const fieldsToTake = column.childColumns.map((subColumn) => subColumn.field);
    return fieldsToTake.map((field) => {
        const childColumnValue = cellValues[field];
        const formatted = _formatValueWithFilter(childColumnValue, cellFormat, row, defaultValue);
        return formatted;
    });
};

/**
 * Type guard for object types
 * @param value the current cell value to check whether its an object or not
 */
const _isObjectValue = (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};

/**
 * Type guard for array types
 * @param value the current cell value to check whether its an array or not
 * @param cellDataType the current cell data type
 */
const _isArrayValue = (value: unknown): value is unknown[] => {
    return value && Array.isArray(value);
};

/**
 * Type guard for numerical values
 * @param value The current cell value to check whether its a number or not
 */
const _isNumericValue = (value: unknown): value is number => {
    const floatValue = Number.parseFloat(value as string);
    const isNumber = !Number.isNaN(floatValue);
    return isNumber;
};

/**
 * Checks if the given table cell value is a numerical value that represents percent
 * and if that value is 0%, or very close to 0% (below 0.0001)
 * @param value The current table cell value to inspect
 * @param cellFormat The current table cell format
 */
const _isZeroPercentValue = (value: unknown, cellFormat: string): boolean => {
    const isPercent = cellFormat.toLowerCase().indexOf("percent") !== -1;
    if (!isPercent) return false;

    const isNumericValue = _isNumericValue(value);
    if (!isNumericValue) return false;

    const isZeroPercent = isPercent && Math.abs(value as number) < 0.0001;
    return isZeroPercent;
};

const _formatValueWithFilter = (
    value: unknown,
    format: string,
    row: TableRow,
    defaultValue = "N/A",
): string => {
    const isFormattable = typeof value !== "undefined";
    if (!isFormattable) return defaultValue;

    /**
     * the ng dynamic filter returns N/A whenever it encounters a 0 value. this is problematic
     * in case we have a percentage value that is 0%. in such cases - we want to explicitly
     * return 0% and bypass the dynamic filter.
     */
    const isZeroPercent = _isZeroPercentValue(value, format);
    if (isZeroPercent) return "0%";

    /**
     * Boolean values usually have a cell format of "none", and a string value of "true" | "false"
     * the ng-dynamic filter returns N/A whenever it encounters a "false" value. therefore - we want
     * to explicitliy return the boolean value when it's falsy, with no filter applied.
     */
    const isBoolValue = `${value}`.toLowerCase() === "true" || `${value}`.toLowerCase() === "false";
    if (isBoolValue) return `${value}`;

    // Otherwise - we want to format the current value according to the data format
    switch (format) {
        case "Country":
            return countryFilter(value as string, defaultValue);
        case "Category":
            return categoryFilter(value as string, defaultValue);
        case "App":
            return appFilter(value, row);
        case "OrganicPaid":
            return organicPaidFilter(value, row);
        default:
            // In case no specific filter was matching, we want to run the ng-dynamic filter
            // which automatically determines what filter should be applied, according to the dataFormat (filter) name
            return dynamicFilter(value, format, defaultValue);
    }
};
