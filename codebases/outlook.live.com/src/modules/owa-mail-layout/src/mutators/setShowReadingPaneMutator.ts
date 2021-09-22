import { mutator } from 'satcheljs';
import { getStore } from '../store/Store';
import { setShowReadingPane } from '../actions/setShowReadingPane';

/**
 * Sets showReadingPane value in store to passed in value
 * @param showReadingPane Whether to show reading pane
 */
export default mutator(setShowReadingPane, actionMessage => {
    getStore().showReadingPane = actionMessage.showReadingPane;
});
