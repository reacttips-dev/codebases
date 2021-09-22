import { observer } from 'mobx-react-lite';
import FocusedInboxPivot from './FocusedInboxPivot';
import type { DragData } from 'owa-dnd/lib/utils/dragDataUtil';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import { selectFocusedViewFilter } from 'owa-mail-triage-table-utils';
import { mailStore } from 'owa-mail-store';
import * as lazyTriageActions from 'owa-mail-triage-action';
import type { MailListRowDragData } from 'owa-mail-types/lib/types/MailListRowDragData';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import * as React from 'react';
import {
    getFocusedOtherDropViewState,
    getFocusedFilterForTable,
    listViewStore,
    getSelectedTableView,
} from 'owa-mail-list-store';

export interface FocusedInboxHeaderProps {
    tableViewId: string;
    mailListHeaderStylesAsPerUserSettings: string;
}

export default observer(function FocusedInboxHeader(props: FocusedInboxHeaderProps) {
    const onDropPill = (dragInfo: DragData, viewFilter: FocusedViewFilter) => {
        const selectedTableView = listViewStore.tableViews.get(getSelectedTableView().id);
        if (
            isSupportedItemTypeForDragDrop(dragInfo.itemType) &&
            getFocusedFilterForTable(selectedTableView) !== viewFilter
        ) {
            const mailListRowDragData = dragInfo as MailListRowDragData;
            lazyTriageActions.lazyMoveMailListRowsToFocusedOrOther.importAndExecute(
                mailListRowDragData.rowKeys,
                mailListRowDragData.tableViewId,
                viewFilter,
                'Drag'
            );
        }
    };
    const onDropFocusedPill = (dragInfo: DragData) => {
        onDropPill(dragInfo, FocusedViewFilter.Focused);
    };
    const onDropOtherPill = (dragInfo: DragData) => {
        onDropPill(dragInfo, FocusedViewFilter.Other);
    };
    /**
     * Called when user presses keyboard on the focused other button in listview
     */
    const onKeyDownOnFocusedOther = (ev: React.KeyboardEvent<HTMLElement>) => {
        const tableView = listViewStore.tableViews.get(props.tableViewId);
        const isFocusedSelected = getFocusedFilterForTable(tableView) == FocusedViewFilter.Focused;
        switch (ev.keyCode) {
            case KeyboardCharCodes.Enter:
            case KeyboardCharCodes.Space:
                ev.stopPropagation();
                ev.preventDefault();
                selectFocusedViewFilter(
                    isFocusedSelected ? FocusedViewFilter.Other : FocusedViewFilter.Focused,
                    'Keyboard'
                );
                break;
        }
    };
    const isSupportedItemTypeForDragDrop = (itemType: string): boolean => {
        return (
            itemType == DraggableItemTypes.MailListRow ||
            itemType == DraggableItemTypes.MultiMailListConversationRows ||
            itemType == DraggableItemTypes.MultiMailListMessageRows
        );
    };
    return (
        <FocusedInboxPivot
            tableViewId={props.tableViewId}
            onDropFocused={onDropFocusedPill}
            onDropOther={onDropOtherPill}
            onKeyDown={onKeyDownOnFocusedOther}
            isSupportedItemTypeForDragDrop={isSupportedItemTypeForDragDrop(
                mailStore.typeOfItemBeingDragged
            )}
            shouldShowOnDropHoverTreatment={getFocusedOtherDropViewState().isDragOver}
            mailListHeaderStylesAsPerUserSettings={props.mailListHeaderStylesAsPerUserSettings}
        />
    );
});
