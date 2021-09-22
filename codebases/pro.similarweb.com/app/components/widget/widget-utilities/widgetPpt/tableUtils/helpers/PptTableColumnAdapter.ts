import { IPptTableColumn } from "services/PptExportService/PptExportServiceTypes";
import { ColumnConfig, ColumnDetails } from "../PptTableWidgetUtilsTypes";

/**
 * Adapts a single table column into ppt-compatible data
 */
export const adaptTableColumnToPpt = (
    columnDetails: ColumnDetails,
    columnConfig: ColumnConfig,
    tableEntities?: string[],
): IPptTableColumn[] => {
    const shouldSplitColumn = _shouldSplitColumnToEntities(columnConfig);
    if (shouldSplitColumn) return _adaptSplitColumn(columnDetails, columnConfig, tableEntities);

    const shouldReplaceColumn = _shouldReplaceColumn(columnConfig);
    if (shouldReplaceColumn) return _adaptReplacedColumn(columnDetails, columnConfig);

    return _adaptRegularColumn(columnDetails, columnConfig);
};

/**
 * Checks if the current column is a comparison column. that is - a column that compares
 * between multiple entites. (also known as a "traffic bar" in SW)
 */
const _shouldSplitColumnToEntities = (columnConfig: ColumnConfig) => {
    const splitColumnToEntities = columnConfig.ppt?.splitColumnToEntities ?? false;
    return splitColumnToEntities;
};

const _shouldReplaceColumn = (columnConfig: ColumnConfig) => {
    const replaceWithOtherColumns = columnConfig.ppt?.replaceWithColumns ?? [];
    return replaceWithOtherColumns.length > 0;
};

const _adaptRegularColumn = (
    columnDetails: ColumnDetails,
    columnConfig: ColumnConfig,
): IPptTableColumn[] => {
    const columnName = columnConfig.ppt?.overrideName
        ? columnConfig.ppt.overrideName
        : columnDetails.displayName;

    const isVisible = _resolveIsColumnVisible(columnDetails, columnConfig);

    return [
        {
            name: columnName,
            field: columnDetails.field,
            format: _resolvePptColumnFormat(columnDetails, columnConfig),
            visible: isVisible,
            type: columnConfig.type,
            shouldSplitColumn: false,
            defaultValue: columnConfig.ppt?.defaultValue,
        },
    ];
};

const _adaptReplacedColumn = (
    columnDetails: ColumnDetails,
    columnConfig: ColumnConfig,
): IPptTableColumn[] => {
    const columnsToReplaceWith = columnConfig.ppt.replaceWithColumns;
    const isVisible = _resolveIsColumnVisible(columnDetails, columnConfig);

    return columnsToReplaceWith.map((colName) => {
        return {
            name: colName,
            field: colName,
            format: _resolvePptColumnFormat(columnDetails, columnConfig),
            visible: isVisible,
            type: columnConfig.type,
            shouldSplitColumn: false,
            defaultValue: columnConfig.ppt?.defaultValue,
        };
    });
};

const _adaptSplitColumn = (
    columnDetails: ColumnDetails,
    columnConfig: ColumnConfig,
    tableItems: string[],
): IPptTableColumn[] => {
    const format = _resolvePptColumnFormat(columnDetails, columnConfig);
    const isVisible = _resolveIsColumnVisible(columnDetails, columnConfig);

    return [
        {
            name: columnDetails.displayName,
            field: columnDetails.field,
            format: format,
            visible: isVisible,
            type: columnConfig.type,
            shouldSplitColumn: true,
            defaultValue: columnConfig.ppt?.defaultValue,
            childColumns: tableItems.map((item) => {
                return {
                    name: item,
                    field: item,
                    format: format,
                    visible: columnDetails.visible,
                    type: columnConfig.type?.replace("[]", ""),
                    shouldSplitColumn: false,
                    defaultValue: columnConfig.ppt?.defaultValue,
                };
            }),
        },
    ];
};

/**
 * Resolves what should be the current ppt table column format (that is the filter name that
 * should be used when formatting the column values)
 */
const _resolvePptColumnFormat = (
    columnDetails: ColumnDetails,
    columnConfig: ColumnConfig,
): string => {
    // if the column has a specific format for ppt, then we should take it
    const overrideFormat = columnConfig.ppt?.overrideFormat;
    const hasOverrideFormat = overrideFormat && overrideFormat.length > 0;
    if (hasOverrideFormat) return overrideFormat;

    // Otherwise - we try to resolve the format according to the column format.
    // and if no such is present - then we default to None.
    return columnDetails.format || "None";
};

const _resolveIsColumnVisible = (columnDetails: ColumnDetails, columnConfig: ColumnConfig) => {
    const shouldHidePptColumn = !!columnConfig.ppt?.hideColumn;
    if (shouldHidePptColumn) return false;

    return columnDetails.visible;
};
