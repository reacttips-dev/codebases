import { orchestrator } from 'satcheljs';
import selectCategoriesOptionsAction from 'owa-options-actions/lib/selectCategoriesOptions';
import loadMailFolders from '../actions/loadMailFolders';

export default orchestrator(selectCategoriesOptionsAction, actionMessage => {
    loadMailFolders();
});
