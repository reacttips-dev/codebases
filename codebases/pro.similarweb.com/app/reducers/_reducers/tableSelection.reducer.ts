import { combineReducers, Reducer } from "redux";
import {
    CLEAR_SELECTION,
    SELECT_TABLE_ROWS,
    TOGGLE_TABLE_ROWS,
} from "../../action_types/table_actions";
import { ITableAction } from "../../actions/tableActions";

const addRow = (collection, row) => [...collection, row];
const removeRowByField = (collection, field, value) =>
    collection.filter((record) => record[field] !== value);

const rowExists = (record, selectedRows = [], comparisonField) => {
    return selectedRows.some((row) => row[comparisonField] === record[comparisonField]);
};

export const tableSelection: (any, ITableAction) => any = (
    state = {},
    { type, stateKey, comparisonField, records, removeExists = true, removeList },
) => {
    let { [stateKey]: selectedRowsForTable = [] } = state;
    switch (type) {
        case TOGGLE_TABLE_ROWS:
            records.forEach((record) => {
                const rowExist = rowExists(record, selectedRowsForTable, comparisonField);
                record.selectable = !(
                    record.hasOwnProperty("HasGraphData") && record.HasGraphData === false
                );
                if (rowExist || !record.selectable) {
                    if (removeExists) {
                        selectedRowsForTable = removeRowByField(
                            selectedRowsForTable,
                            comparisonField,
                            record[comparisonField],
                        );
                    }
                } else {
                    selectedRowsForTable = addRow(selectedRowsForTable, record);
                }
            });
            return {
                ...state,
                [stateKey]: selectedRowsForTable || [],
            };
        case SELECT_TABLE_ROWS:
            return {
                ...state,
                [stateKey]: [...records],
            };
        case CLEAR_SELECTION:
            const newSelection = removeList ? undefined : [];
            return {
                ...state,
                [stateKey]: newSelection,
            };
        default:
            return state;
    }
};
