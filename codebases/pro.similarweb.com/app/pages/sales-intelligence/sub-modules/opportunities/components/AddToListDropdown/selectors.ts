import { selectSortedOpportunityLists } from "../../store/selectors";
import { createSelector } from "reselect";
import { AddToListProps } from "./AddToListDropdownContainer";
import { RootState } from "store/types";
import { selectLegacyOpportunityLists } from "pages/workspace/sales/store/selectors";

// Custom selector for creating new lists with disabled prop
export const selectListsWithDisabledProp = createSelector(
    selectSortedOpportunityLists,
    selectLegacyOpportunityLists,
    (_state: RootState, props: AddToListProps) => props.disabledLists,
    (newSalesLists, legacySalesLists, disabledLists = []) => {
        const createDisabled = (list) => {
            const disabled = !!disabledLists.find((id) => id === list.opportunityListId);
            const newList = {
                ...list,
                disabled,
            };

            return newList;
        };

        if (newSalesLists.length) {
            return newSalesLists.map(createDisabled);
        }

        return legacySalesLists.map(createDisabled);
    },
);
