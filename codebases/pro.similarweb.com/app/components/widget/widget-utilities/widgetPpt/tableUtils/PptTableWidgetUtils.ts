import { IPptTableColumn, PptTableRow } from "services/PptExportService/PptExportServiceTypes";
import {
    ColumnConfig,
    ColumnDetails,
    DataAdaptOptions,
    TableRow,
} from "./PptTableWidgetUtilsTypes";
import { adaptTableRowToPpt } from "./helpers/PptTableRowAdapter";
import { adaptTableColumnToPpt } from "components/widget/widget-utilities/widgetPpt/tableUtils/helpers/PptTableColumnAdapter";

/**
 * Converts a tableWidget's columns data and config into a table column definitions for the PPT export service
 * @param columnsDetails Array of basic column details, such as field, format and type
 * @param columnsConfig Array of columns config, as provided by the TableWidget
 * @param tableEntities The sites/apps/categories that this table measures their data (such as "ynet.co.il"/"all industries"/"whatsapp" etc.)
 */
export const adaptTableColumnsToPpt = (
    columnsDetails: ColumnDetails[],
    columnsConfig: ColumnConfig[],
    tableEntities?: string[],
): IPptTableColumn[] => {
    return columnsDetails.reduce((res, column) => {
        const columnConfig = columnsConfig.find((colConfig) => colConfig.name === column.field);
        const adaptedColumns = adaptTableColumnToPpt(column, columnConfig, tableEntities);
        return [...res, ...adaptedColumns];
    }, []);
};

/**
 * Formats a table's records using the relevant ngFilters,
 * the relevant ngFilter is chosen according to the value column name.
 */
export const adaptTableDataToPpt = (
    data: TableRow[],
    columns: IPptTableColumn[],
    columnsConfig: ColumnConfig[],
): PptTableRow[] => {
    return data.map((row) => adaptTableRowToPpt(row, columns, columnsConfig));
};
