import { Action } from "redux";
import { CLEAR_SELECTION, TOGGLE_TABLE_ROWS } from "../action_types/table_actions";

export interface ITableAction extends Action {
    stateKey: string;
    comparisonField?: string;
    records?: any[];
    removeExists?: boolean;
    removeList?: boolean;
}

export const tableActionsCreator = (stateKey, comparisonField) => {
    return {
        toggleRows(records): ITableAction {
            return {
                type: TOGGLE_TABLE_ROWS,
                stateKey,
                comparisonField,
                records,
            };
        },
        selectRows(records): ITableAction {
            return {
                type: TOGGLE_TABLE_ROWS,
                stateKey,
                comparisonField,
                records,
                removeExists: false,
            };
        },
        clearAllSelectedRows(removeList = false): ITableAction {
            return {
                type: CLEAR_SELECTION,
                stateKey,
                comparisonField,
                removeList,
            };
        },
    };
};
