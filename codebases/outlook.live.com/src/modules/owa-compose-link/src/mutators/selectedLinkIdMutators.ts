import { onLinkSelectionChange } from '../actions/publicActions';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(onLinkSelectionChange, actionMessage => {
    const store = getStore();
    const { selectedLinkId, isSelectedLinkReadOnly } = actionMessage;
    store.selectedLinkId = selectedLinkId;
    store.isSelectedLinkReadOnly = isSelectedLinkReadOnly;
});
