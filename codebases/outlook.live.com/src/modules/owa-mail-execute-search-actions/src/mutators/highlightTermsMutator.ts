import { setHighlightTerms } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { getSelectedTableView } from 'owa-mail-list-store';

mutator(setHighlightTerms, actionMessage => {
    const selectedTable = getSelectedTableView();
    if (selectedTable) {
        selectedTable.highlightTerms = actionMessage.highlightTerms;
    }
});
