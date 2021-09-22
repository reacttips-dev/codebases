import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { observer } from 'mobx-react-lite';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import getSuggestionAriaLabel from '../../utils/getSuggestionAriaLabel';
import * as React from 'react';
import {
    exitSearch,
    lazyOnDownArrowPressedSearchInput,
    lazyOnUpArrowPressedSearchInput,
    onEscapePressedSearchInput,
    onKeyDownSearchInput,
    suggestionSelected,
} from 'owa-search-actions';
import {
    CLICK_ACTION_SOURCE,
    LARGE_SUGGESTION_HEIGHT,
    SUGGESTION_ID_PREFIX,
} from 'owa-search-constants';

import universalSuggestionStyles from './searchSuggestion/SearchSuggestion.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(universalSuggestionStyles);

export interface OpenInNewTabSuggestionProps {
    index: number;
    scenarioId: SearchScenarioId;
    suggestion: Suggestion;
    suggestionSetTraceId: string;
    suggestionContent: JSX.Element;
    urlToNavigateTo: string;
    ariaLabel: string;
    focusSearchInput: () => void;
}

const OpenInNewTabSuggestion = observer(function OpenInNewTabSuggestion(
    props: OpenInNewTabSuggestionProps
) {
    const suggestionButton = React.createRef<HTMLButtonElement>();

    /**
     * Determines whether or not this suggestion is selected.
     */
    const isSelected = useComputed((): boolean => {
        const { scenarioId, index } = props;
        const selectedSuggestionIndex = getScenarioStore(scenarioId).selectedSuggestionIndex;
        return selectedSuggestionIndex === index;
    });

    /**
     * Custom selection handler because open-in-new-tab behavior
     * poses a unique problem.
     *
     * Wrapping the suggestion in an anchor tag would do the trick for inducing
     * the navigation we need, but that would be a large stylistic departure from other suggestion types
     * and wouldn't let us do the logging we also need to do.
     *
     * We also can't put special accommodations in the parent-level Suggestion component and extend
     * it like the other suggestion types do, because an event-handler attempting
     * to hijack navigation from a nested DOM structure will get blocked by popup-blockers.
     *
     * Thus, creating the suggestion's DOM content here in the suggestion component itself and
     * putting a handler on it (at a top-level) affords us a solution to both with minimal changes
     * to existing patterns.
     */
    const handleOnSelect = () => e => {
        const { scenarioId, urlToNavigateTo, suggestionSetTraceId, suggestion, index } = props;
        const { isSuggestionsCalloutClickable } = getScenarioStore(scenarioId);

        e.preventDefault();
        e.stopPropagation();

        /**
         * If a user double-clicks, particularly on a
         * low-end machine or a low-end browser (Edge burn), it's possible for
         * the click to happen while the SuggestionsCallout is rendering
         * because it overlaps the input while animating in.
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

        window.open(urlToNavigateTo, '_blank');
        exitSearch('SearchBoxSuggestionDropDown', scenarioId);
    };

    /**
     * Listen for the suggestion to be selected, then set
     * the focus to the suggestion container so that the
     * keyDown and click events are processed by this
     * component instead of the SearchInput component.
     */
    React.useEffect(() => {
        if (suggestionButton.current && isSelected.get()) {
            suggestionButton.current.focus();
        }
    });

    /**
     * Once focus is shifted to this component (see the useEffect
     * above), the onKeyDown events will be scoped here rather
     * than SearchInput component as is usually the case.
     *
     * Until focus is shifted back to the SearchInput component,
     * we need to listen for and process these events here.
     */
    const handleOnKeyDown = () => async e => {
        e.stopPropagation();
        const keyCode = e.keyCode;
        const { scenarioId, focusSearchInput } = props;
        // Dispatch action to modify store based on key down.
        onKeyDownSearchInput(keyCode, props.scenarioId);
        switch (keyCode) {
            case KeyboardCharCodes.Enter:
                handleOnSelect();
                break;
            case KeyboardCharCodes.Up_arrow:
                const onUpArrowPressedSearchInput = await lazyOnUpArrowPressedSearchInput.import();
                onUpArrowPressedSearchInput(scenarioId);
                //only change focus when not in a suggestion that requires a new tab
                if (!(suggestionButton.current && isSelected.get())) {
                    focusSearchInput();
                }
                break;
            case KeyboardCharCodes.Down_arrow:
                const onDownArrowPressedSearchInput = await lazyOnDownArrowPressedSearchInput.import();
                onDownArrowPressedSearchInput(scenarioId);
                //only change focus when not in a suggestion that requires a new tab
                if (!(suggestionButton.current && isSelected.get())) {
                    focusSearchInput();
                }
                break;
            case KeyboardCharCodes.Esc: {
                onEscapePressedSearchInput(scenarioId);
                break;
            }
            default:
                focusSearchInput();
                break;
        }
    };

    const { index, suggestionContent, ariaLabel, suggestion } = props;
    const classes = classNames(
        universalSuggestionStyles.suggestionContainer,
        isSelected.get() && universalSuggestionStyles.selected,
        universalSuggestionStyles.openInNewTabSuggestionContainer
    );

    const style = {
        height: LARGE_SUGGESTION_HEIGHT,
        display: 'inline',
    };

    const ariaLabelWithKind = getSuggestionAriaLabel(suggestion, ariaLabel);

    return (
        <button
            ref={suggestionButton}
            aria-label={ariaLabelWithKind}
            aria-selected={isSelected.get()}
            className={classes}
            id={`${SUGGESTION_ID_PREFIX}${index}`}
            role="option"
            style={style}
            onKeyDown={handleOnKeyDown()}
            onClick={handleOnSelect()}>
            {suggestionContent}
        </button>
    );
});
export default OpenInNewTabSuggestion;
