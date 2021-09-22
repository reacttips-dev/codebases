import type DropViewState from 'owa-dnd/lib/store/schema/DropViewState';
import listViewStore from '../store/Store';
import createFocusedOtherDropViewState from '../actions/createFocusedOtherDropViewState';

export default function getFocusedOtherDropViewState(): DropViewState {
    if (!listViewStore.focusedOtherDropViewState) {
        createFocusedOtherDropViewState();
    }

    return listViewStore.focusedOtherDropViewState;
}
