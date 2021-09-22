import {
    Item,
    SelectedIdsState,
} from "pages/workspace/sales/components/multi-select-dropdown/types";

export const isAllItemsSelected = <T extends { id: number }, K>(
    source: T[],
    checked: K,
): boolean => {
    return source.every((element) => checked[element.id]);
};

export const findElement = (items: Item[], source: SelectedIdsState, defaultValue: Item) => {
    return items.find(({ id }) => source[id]) || defaultValue;
};
