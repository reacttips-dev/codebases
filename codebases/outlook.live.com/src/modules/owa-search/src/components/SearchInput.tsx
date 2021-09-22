import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import * as React from 'react';
import getPlaceholderAndAriaLabel from '../selectors/getPlaceholderAndAriaLabel';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SUGGESTION_ID_PREFIX, SUGGESTIONS_CALLOUT_ID } from 'owa-search-constants';
import {
    getSuggestions,
    lazyOnBackspacePressedSearchInput,
    lazyOnDownArrowPressedSearchInput,
    lazyOnLeftArrowPressedSearchInput,
    lazyOnUpArrowPressedSearchInput,
    onEnterPressedSearchInput,
    onEscapePressedSearchInput,
    onKeyDownSearchInput,
    onSearchTextChanged,
    onSearchInputFocused,
    setIsSuggestionsDropdownVisible,
    setSearchTextForSuggestion,
} from 'owa-search-actions';

import classNames from 'classnames';
import styles from './SearchInput.scss';

export interface SearchInputProps {
    searchPlaceHolderText?: string;
    isDisabled?: boolean; // Boolean indicating if search box is disabled (default is false)
    scenarioId: SearchScenarioId;
    isSuggestionsCalloutVisible: boolean;
}

export interface SearchInputHandle {
    setFocus(): void;
}

export default observer(
    function SearchInput(props: SearchInputProps, ref: React.Ref<SearchInputHandle>) {
        const searchInput = React.useRef<HTMLInputElement>();
        /**
         * This computed returns the text to be displayed in the actual input
         * element.
         */
        const searchInputText = useComputed((): string => {
            return getScenarioStore(props.scenarioId).searchText;
        });
        const activeDescendant = useComputed((): string => {
            const { isSuggestionsCalloutVisible, scenarioId } = props;
            const { selectedSuggestionIndex } = getScenarioStore(scenarioId);
            /**
             * If search suggestions are visible and the user has a suggestion
             * selected, then return a string to be used for the component's
             * aria-activedescendant attribute.
             */
            if (isSuggestionsCalloutVisible && selectedSuggestionIndex >= 0) {
                return `${SUGGESTION_ID_PREFIX}${selectedSuggestionIndex}`;
            }
            return '';
        });
        /**
         * Sets focus on the search input. This is exposed publicly so parent component
         * (SearchBox) can set focus on the input element as a result of clicks on other
         * parts of the search box.
         */
        React.useImperativeHandle(
            ref,
            () => ({
                setFocus() {
                    if (searchInput.current) {
                        searchInput.current.focus();
                    }
                },
            }),
            []
        );
        /**
         * Key handler for special key input into the input element.
         */
        const onKeyDown = async (evt: React.KeyboardEvent<unknown>) => {
            evt.stopPropagation();
            const evtKeyCode = evt.keyCode;
            const scenarioId = props.scenarioId;
            const { selectedSuggestionIndex } = getScenarioStore(scenarioId);
            // Dispatch action to modify store based on key down.
            onKeyDownSearchInput(evtKeyCode, props.scenarioId);
            switch (evtKeyCode) {
                case KeyboardCharCodes.Enter: {
                    // Clear selection (non-default behavior of IE/Edge).
                    clearSelection();
                    evt.preventDefault();
                    onEnterPressedSearchInput(selectedSuggestionIndex, scenarioId);
                    break;
                }
                case KeyboardCharCodes.Backspace: {
                    const onBackspacePressedSearchInput = await lazyOnBackspacePressedSearchInput.import();
                    onBackspacePressedSearchInput(getCursorPosition(), scenarioId);
                    break;
                }
                case KeyboardCharCodes.Up_arrow:
                    // Prevents cursor from going to beginning of input.
                    evt.preventDefault();
                    const onUpArrowPressedSearchInput = await lazyOnUpArrowPressedSearchInput.import();
                    onUpArrowPressedSearchInput(scenarioId);
                    break;
                case KeyboardCharCodes.Down_arrow:
                    const onDownArrowPressedSearchInput = await lazyOnDownArrowPressedSearchInput.import();
                    onDownArrowPressedSearchInput(scenarioId);
                    break;
                case KeyboardCharCodes.Left_arrow: {
                    const onLeftArrowPressedSearchInput = await lazyOnLeftArrowPressedSearchInput.import();
                    onLeftArrowPressedSearchInput(getCursorPosition(), scenarioId);
                    break;
                }
                case KeyboardCharCodes.Esc: {
                    // Prevents IE/Edge behavior of putting last text back into the input.
                    evt.preventDefault();
                    onEscapePressedSearchInput(scenarioId);
                    break;
                }
                default:
                    break;
            }
        };
        /**
         * Click handler when user clicks in input.
         */
        const onClick = (evt: React.MouseEvent<unknown>) => {
            evt.stopPropagation();
            setIsSuggestionsDropdownVisible(true, props.scenarioId);
        };

        /**
         * Focus handler for when the SearchInput component receives focus.
         *
         * We want to swallow the focus event if we are coming from
         * a suggestion (child component) within the SearchInput container.
         */
        const onFocus = (e: React.FocusEvent<EventTarget>) => {
            let relatedTargetElement = e.relatedTarget as HTMLElement;

            // Fallback for IE, which doesn't always set relatedTarget.
            if (!relatedTargetElement) {
                relatedTargetElement = document.activeElement as HTMLElement;
            }

            const isTargetElementWithinSearchBox =
                relatedTargetElement.id.indexOf(SUGGESTION_ID_PREFIX) > -1;

            // Truly "focus" only if event is from outside of search box.
            if (!isTargetElementWithinSearchBox) {
                setIsSuggestionsDropdownVisible(true, props.scenarioId);
                onSearchInputFocused(props.scenarioId);
            }
        };
        /**
         * Need to do this synchronously or there'll be rendering issues and the value
         * of the input element will be empty.
         */
        const onSearchTextChange = () => {
            const scenarioId = props.scenarioId;
            const searchText = searchInput.current.value;
            onSearchTextChanged(searchText, scenarioId);
            setSearchTextForSuggestion(searchText, scenarioId);
            getSuggestions(scenarioId);
            // If suggestions dropdown is hidden, show it.
            if (!getScenarioStore(scenarioId).isSuggestionsDropdownVisible) {
                setIsSuggestionsDropdownVisible(true, scenarioId);
            }
        };
        /**
         * Gets cursor position if no text is selected. If text is selected, then
         * -1 is returned.
         */
        const getCursorPosition = () => {
            /**
             * If reference to input is null (component unmounted), return -1
             * indicating that cursor position shouldn't be used.
             */
            if (!searchInput.current) {
                return -1;
            }
            const isTextSelected =
                searchInput.current.selectionStart !== searchInput.current.selectionEnd;
            return isTextSelected ? -1 : searchInput.current.selectionStart;
        };
        /**
         * Clears selected text in the input.
         */
        const clearSelection = () => {
            const searchInputEnd = searchInput.current.value.length;
            searchInput.current.setSelectionRange(searchInputEnd, searchInputEnd);
        };
        const {
            scenarioId,
            searchPlaceHolderText,
            isDisabled,
            isSuggestionsCalloutVisible,
        } = props;
        const { searchSessionGuid } = getScenarioStore(props.scenarioId);
        const isSearchBoxExpanded = !!searchSessionGuid;
        const searchInputClasses = classNames(
            styles.searchBoxInput,
            isDisabled && styles.isDisabled,
            isSearchBoxExpanded ? styles.inSearchinputPlaceholder : styles.inputPlaceholder
        );
        const { ariaLabel, placeholder } = getPlaceholderAndAriaLabel(
            scenarioId,
            searchPlaceHolderText
        );
        return (
            <div className={styles.searchBoxInputContainer}>
                <input
                    aria-activedescendant={activeDescendant.get()}
                    aria-autocomplete="list"
                    aria-label={ariaLabel}
                    aria-owns={isSuggestionsCalloutVisible ? SUGGESTIONS_CALLOUT_ID : ''}
                    autoComplete="off"
                    className={searchInputClasses}
                    disabled={isDisabled}
                    onChange={onSearchTextChange}
                    onClick={onClick}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    ref={ref => (searchInput.current = ref)}
                    value={searchInputText.get()}
                    spellCheck={false}
                    autoCorrect="off"
                />
            </div>
        );
    },
    { forwardRef: true }
);
