import { ItemPartSelectionRestrictionType } from '../Behaviors.types';
import { getSelectedTableView, getStore as getListViewStore } from 'owa-mail-list-store';
import { assertNever } from 'owa-assert';

export const itemPartSelectionRestrictionType = (
    itemPartSelectionRestrictionType: ItemPartSelectionRestrictionType
) => () => {
    const { isInCheckedMode } = getSelectedTableView();
    const numItemPartsSelected = getListViewStore().expandedConversationViewState.selectedNodeIds
        .length;
    const hasItemPartsSelected = !isInCheckedMode && numItemPartsSelected > 1;

    switch (itemPartSelectionRestrictionType) {
        case ItemPartSelectionRestrictionType.NoSelection:
            return !hasItemPartsSelected;
        case ItemPartSelectionRestrictionType.HasSelection:
            return hasItemPartsSelected;
        case ItemPartSelectionRestrictionType.SingleSelection:
            return !isInCheckedMode && numItemPartsSelected == 1;
        case ItemPartSelectionRestrictionType.MultipleSelection:
            return !isInCheckedMode && numItemPartsSelected > 1;
        default:
            throw assertNever(itemPartSelectionRestrictionType);
    }
};
