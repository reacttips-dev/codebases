import { onFolderScopeUpdate } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

mutator(onFolderScopeUpdate, actionMessage => {
    getStore().advancedSearchViewState.selectedSearchScope = actionMessage.selectedSearchScope;
    getStore().staticSearchScope = actionMessage.selectedSearchScope;
});
