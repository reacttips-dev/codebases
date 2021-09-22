import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import * as React from 'react';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import getSuggestionAriaLabel from '../../../utils/getSuggestionAriaLabel';
import { SuggestionKind, Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { suggestionSelected } from 'owa-search-actions';
import {
    LARGE_SUGGESTION_HEIGHT,
    SMALL_SUGGESTION_HEIGHT,
    SUGGESTION_ID_PREFIX,
    CLICK_ACTION_SOURCE,
} from 'owa-search-constants';
import getAdditionalQuickActions from '../../../selectors/getAdditionalQuickActions';

import styles from './SearchSuggestion.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface SearchSuggestionProps {
    ariaLabel: string;
    content: JSX.Element;
    index: number;
    quickActions?: JSX.Element[];
    scenarioId: SearchScenarioId;
    suggestion: Suggestion;
    suggestionSetTraceId: string;
}

export default observer(function SearchSuggestion(props: SearchSuggestionProps) {
    /**
     * Determines whether or not this suggestion is selected.
     */
    const isSelected = useComputed((): boolean => {
        const { scenarioId, index } = props;
        const selectedSuggestionIndex = getScenarioStore(scenarioId).selectedSuggestionIndex;
        return selectedSuggestionIndex === index;
    });
    /**
     * Determines the height of the suggestion item based on the suggestion's
     * kind.
     */
    const getHeight = (): number => {
        const { suggestion } = props;
        switch (suggestion?.kind) {
            case SuggestionKind.Keywords:
            case SuggestionKind.Category:
            case SuggestionKind.TrySuggestion:
                return SMALL_SUGGESTION_HEIGHT;
            case SuggestionKind.People:
            case SuggestionKind.File:
            case SuggestionKind.Message:
            default:
                return LARGE_SUGGESTION_HEIGHT;
        }
    };
    const onMouseDown = () => {
        const { scenarioId, suggestionSetTraceId, suggestion, index } = props;
        const { isSuggestionsCalloutClickable } = getScenarioStore(scenarioId);
        /**
         * We rely on a store value to decide if we should actually allow an
         * event to be processed. If a user double-clicks, particularly on a
         * low-end machine or a low-end browser (Edge burn), it's possible for
         * a click to happen while the SuggestionsCallout component renders
         * because it animates in slightly overlapping the input.
         */
        if (!isSuggestionsCalloutClickable) {
            return;
        }
        suggestionSelected(
            suggestion,
            CLICK_ACTION_SOURCE,
            scenarioId,
            suggestionSetTraceId,
            index
        );
    };
    const { content, index, ariaLabel, scenarioId, quickActions, suggestion } = props;
    const classes = classNames(styles.suggestionContainer, isSelected.get() && styles.selected);
    const style = {
        height: getHeight(),
    };
    const registerAdditionalQuickActionsFunction = getAdditionalQuickActions(scenarioId);
    let extendedQuickActions = quickActions ? quickActions.slice() : [];

    if (registerAdditionalQuickActionsFunction) {
        extendedQuickActions.unshift(...registerAdditionalQuickActionsFunction(suggestion));
    }

    const ariaLabelWithKind = getSuggestionAriaLabel(suggestion, ariaLabel);

    return (
        <div
            aria-label={ariaLabelWithKind}
            aria-selected={isSelected.get()}
            className={classes}
            id={`${SUGGESTION_ID_PREFIX}${index}`}
            role="option"
            style={style}>
            <div className={styles.contentContainer} onMouseDown={onMouseDown}>
                {content}
            </div>
            {extendedQuickActions && extendedQuickActions.length > 0 && (
                <div className={styles.quickActionsContainer}>{extendedQuickActions}</div>
            )}
        </div>
    );
});
