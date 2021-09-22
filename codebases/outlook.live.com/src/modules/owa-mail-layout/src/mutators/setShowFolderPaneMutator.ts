import { mutator } from 'satcheljs';
import { getStore } from '../store/Store';
import { setShowFolderPane } from '../actions/setShowFolderPane';

/**
 * Sets showFolderPane value in store to passed in value
 * @param showFolderPane Whether to show folder pane
 */
export default mutator(setShowFolderPane, actionMessage => {
    getStore().showFolderPane = actionMessage.showFolderPane;
});
