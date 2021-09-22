import { setShouldShowAdvancedSearch } from '../actions/publicActions';
import { getStore } from '../store/store';
import { logFilterClientEvent } from '../utils/filterInstrumentationUtils';
import { logUsage } from 'owa-analytics';
import { searchSessionEnded } from 'owa-search-actions';
import { mutator, mutatorAction } from 'satcheljs';
import {
    setFromDate,
    setToDate,
    setIncludeAttachments,
    onAdvancedSearchUiDismissed,
    toggleHasAttachments,
    toggleIsUnread,
    toggleIsToMe,
    toggleIsFlagged,
    toggleIsMentioned,
    onClearFiltersButtonClicked,
} from '../actions/internalActions';

mutator(setFromDate, actionMessage => {
    getStore().fromDate = actionMessage.fromDate;
});

mutator(setToDate, actionMessage => {
    getStore().toDate = actionMessage.toDate;
});

mutator(setIncludeAttachments, actionMessage => {
    getStore().includeAttachments = actionMessage.includeAttachments;
});

mutator(setShouldShowAdvancedSearch, actionMessage => {
    getStore().shouldShowAdvancedSearch = actionMessage.isVisible;
});

mutator(onAdvancedSearchUiDismissed, () => {
    getStore().shouldShowAdvancedSearch = false;
});

mutator(toggleHasAttachments, () => {
    const newValue = !getStore().includeAttachments;
    getStore().includeAttachments = newValue;
    logUsage('SearchFilter_ToggleHasAttachments', { newValue });
    logFilterClientEvent('HasAttachments', newValue);
});

mutator(toggleIsUnread, () => {
    const newValue = !getStore().isUnread;
    getStore().isUnread = newValue;
    logUsage('SearchFilter_ToggleIsUnread', { newValue });
    logFilterClientEvent('Unread', newValue);
});

mutator(toggleIsToMe, () => {
    const newValue = !getStore().isToMe;
    getStore().isToMe = newValue;
    logUsage('SearchFilter_ToggleIsToMe', { newValue });
    logFilterClientEvent('ToMe', newValue);
});

mutator(toggleIsFlagged, () => {
    const newValue = !getStore().isFlagged;
    getStore().isFlagged = newValue;
    logUsage('SearchFilter_ToggleIsFlagged', { newValue });
    logFilterClientEvent('Flagged', newValue);
});

mutator(toggleIsMentioned, () => {
    const newValue = !getStore().isMentioned;
    getStore().isMentioned = newValue;
    logUsage('SearchFilter_ToggleIsMentioned', { newValue });
    logFilterClientEvent('Mentioned', newValue);
});

mutator(searchSessionEnded, () => {
    clearInteractiveFilters();
});

mutator(onClearFiltersButtonClicked, () => {
    clearInteractiveFilters();
});

export const clearSearchFiltersForRequery = mutatorAction('clearSearchFiltersForRequery', () => {
    clearInteractiveFilters();
});

function clearInteractiveFilters() {
    const mailSearchStore = getStore();
    mailSearchStore.isUnread = false;
    mailSearchStore.isToMe = false;
    mailSearchStore.isFlagged = false;
    mailSearchStore.isMentioned = false;
    mailSearchStore.fromDate = null;
    mailSearchStore.toDate = null;
    mailSearchStore.includeAttachments = false;
}
