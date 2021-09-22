import { SELECTED_ALL_ID } from "pages/workspace/sales/constants/constants";
import { SelectedIdsState } from "pages/workspace/sales/components/multi-select-dropdown/types";

export const isUpdateSelection = (
    newSelectedIds: SelectedIdsState,
    selected: SelectedIdsState,
): boolean => {
    const updatedIds = { ...newSelectedIds };
    delete updatedIds[SELECTED_ALL_ID];

    const updatedIdsKeys = Object.keys(updatedIds);
    const selectedKeys = Object.keys(selected);

    if (updatedIdsKeys.length !== selectedKeys.length) {
        return true;
    }

    return !selectedKeys.every((key) => updatedIds[key]);
};

export const extractValidItems = (selectedIds: SelectedIdsState): SelectedIdsState => {
    const lastSelectedIds = { ...selectedIds };
    delete lastSelectedIds[SELECTED_ALL_ID];
    return lastSelectedIds;
};

export const newStateWithStatusForAllItems = <T extends { id: number | string }>(
    source: T[],
    status: boolean,
): SelectedIdsState => {
    return source.reduce((state, { id }) => {
        state[id] = status;
        return state;
    }, {});
};
