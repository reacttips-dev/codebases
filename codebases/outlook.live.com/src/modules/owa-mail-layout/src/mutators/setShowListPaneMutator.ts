import { mutator } from 'satcheljs';
import { getStore } from '../store/Store';
import { setShowListPane } from '../actions/setShowListPane';

/**
 * Sets showListPane value in store to passed in value
 * @param showListPane Whether to show list view
 */
export default mutator(setShowListPane, actionMessage => {
    getStore().showListPane = actionMessage.showListPane;
});
