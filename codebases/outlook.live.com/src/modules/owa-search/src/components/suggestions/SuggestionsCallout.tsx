import { observer } from 'mobx-react-lite';
import {
    lazyLogResponseRendered,
    lazyLogSearchSuggestionsResultsRenderedEvent,
} from 'owa-search-instrumentation';
import type SuggestionSet from 'owa-search-service/lib/data/schema/SuggestionSet';
import * as React from 'react';
import {
    onSuggestionsCalloutPositioned,
    onSuggestionsCalloutWillUnmount,
    setIsSuggestionsDropdownVisible,
} from 'owa-search-actions';
import { SUGGESTIONS_CALLOUT_ID } from 'owa-search-constants';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import getSearchBoxIdByScenarioId from '../../utils/getSearchBoxIdByScenarioId';
import getSubstrateSearchScenarioBySearchScenarioId from '../../utils/getSubstrateSearchScenarioBySearchScenarioId';
import getSuggestionCalloutContent from '../../utils/getSuggestionCalloutContent';
import SearchBoxDropdown from '../SearchBoxDropdown';
import { searchSuggestionsLabel } from './SuggestionAriaLabels.locstring.json';
import loc from 'owa-localize';

export interface SuggestionsCalloutProps {
    scenarioId: SearchScenarioId;
    focusSearchInput: () => void;
}

export default observer(function SuggestionsCallout(props: SuggestionsCalloutProps) {
    React.useEffect(() => {
        return () => {
            onSuggestionsCalloutWillUnmount(props.scenarioId);
        };
    }, []);
    const suggestions = React.useRef<JSX.Element[]>([]);
    /**
     * Helper function to get JSX of suggestion set to be displayed. Also takes
     * care of logging to 3S that the suggestion set was rendered.
     */
    const renderSuggestionCalloutContent = (
        suggestionSet: SuggestionSet,
        scenarioId: SearchScenarioId
    ) => {
        /**
         * Cache existing items (if new suggestions are still in progress) to be
         * returned if new suggestions aren't ready to be displayed.
         */
        let content: JSX.Element[] = suggestions.current;
        /**
         * Get current suggestions from store and see if they're ready to be
         * displayed. If so, create the new callout content using those suggestions.
         * If not, return current set of suggestions being displayed.
         */
        if (suggestionSet.IsComplete) {
            content = getSuggestionCalloutContent(
                suggestionSet,
                scenarioId,
                props.focusSearchInput
            );
            // Log response rendered (if 3S) and we have a trace ID from 3S.
            const suggestionsTraceId = suggestionSet.TraceId;

            const latency = suggestionSet.RequestStart
                ? Date.now() - suggestionSet.RequestStart.getTime()
                : 0;
            if (getScenarioStore(scenarioId).isUsing3S && suggestionsTraceId) {
                if (scenarioId == SearchScenarioId.Mail) {
                    const logicalId = getScenarioStore(scenarioId).traceIdToLogicalIdMap.get(
                        suggestionsTraceId
                    );
                    lazyLogSearchSuggestionsResultsRenderedEvent.importAndExecute(
                        getSubstrateSearchScenarioBySearchScenarioId(scenarioId),
                        logicalId,
                        suggestionsTraceId,
                        latency
                    );
                } else {
                    lazyLogResponseRendered.importAndExecute(
                        suggestionsTraceId,
                        new Date(),
                        getSubstrateSearchScenarioBySearchScenarioId(scenarioId)
                    );
                }
            }
        }
        return (
            <div role="listbox" aria-label={loc(searchSuggestionsLabel)}>
                {content}
            </div>
        );
    };
    /**
     * onDismiss handler for when the callout thinks it should be dismissed.
     */
    const onDismiss = () => {
        setIsSuggestionsDropdownVisible(false, props.scenarioId);
    };
    /**
     * onPositioned handler when the callout gets correctly positioned.
     */
    const onPositioned = () => {
        onSuggestionsCalloutPositioned(props.scenarioId);
    };
    const { scenarioId } = props;
    const { currentSuggestions: suggestionSet } = getScenarioStore(scenarioId);
    // Don't render anything if there aren't any suggestions.
    if ((suggestionSet && suggestionSet.Suggestions.length === 0) || !suggestionSet) {
        return null;
    }
    return (
        <SearchBoxDropdown
            content={renderSuggestionCalloutContent(suggestionSet, scenarioId)}
            id={SUGGESTIONS_CALLOUT_ID}
            onPositioned={onPositioned}
            role="listbox"
            setInitialFocus={false}
            scenarioId={scenarioId}
            onDismiss={onDismiss}
            targetId={getSearchBoxIdByScenarioId(scenarioId)}
        />
    );
});
