import {
    onSuggestionsCalloutPositioned,
    onSuggestionsCalloutWillUnmount,
} from 'owa-search-actions';
import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';

mutator(onSuggestionsCalloutPositioned, actionMessage => {
    /**
     * Set value in store to make suggestions callout clickable after current
     * render is complete. This will ensure that a click doesn't accidentally
     * happen on the first suggestion in the suggestions dropdown.
     */
    setTimeout(() => {
        getScenarioStore(actionMessage.scenarioId).isSuggestionsCalloutClickable = true;
    }, 0);
});

mutator(onSuggestionsCalloutWillUnmount, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).isSuggestionsCalloutClickable = false;
});
