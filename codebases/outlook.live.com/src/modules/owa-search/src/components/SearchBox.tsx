import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Icon, IIconProps } from '@fluentui/react/lib/Icon';
import { elementContains, KeyCodes } from '@fluentui/react/lib/Utilities';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { ErrorBoundary, ErrorComponentType } from 'owa-error-boundary';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import { SearchPlaceholder } from 'owa-locstrings/lib/strings/searchplaceholder.locstring.json';
import {
    CompactSearchBox,
    lazyIsSearchBoxEmpty,
    SearchBoxPillWell,
    SuggestionsCallout,
} from '../lazyFunctions';
import * as React from 'react';
import {
    clearSearchBox,
    exitSearch,
    lazyRemoveSuggestionPillFromSearchBox,
    searchBoxBlurred,
    setIsSuggestionsDropdownVisible,
    startSearch,
    startSearchSession,
} from 'owa-search-actions';
import {
    SEARCH_SCOPE_SWITCHER_ID,
    SEARCH_SCOPE_SWITCHER_ID_OPTION,
    SEARCH_SCOPE_SWITCHER_ID_LIST,
    SEARCH_SCOPE_SWITCHER_WRAPPER_ID,
    SEARCHBOX_ANCHOR_ID,
    SEARCHBOX_ID,
    SEARCHBOX_COLUMN_CONTAINER_ID,
} from 'owa-search-constants';
import hasSuggestionPills from '../selectors/hasSuggestionPills';
import isSearchBoxEmpty from '../selectors/isSearchBoxEmpty';
import { SearchScenarioId, initializeScenarioStore, getScenarioStore } from 'owa-search-store';
import getSearchBoxIdByScenarioId from '../utils/getSearchBoxIdByScenarioId';
import getSearchBoxMaxWidth from '../utils/getSearchBoxMaxWidth';
import {
    clearSearchLabel,
    exitSearchTitle,
    suggestionsAnnouncement,
} from './SearchBox.locstring.json';
import SearchInput, { SearchInputHandle } from './SearchInput';
import { LazyAnnounced } from 'owa-controls-announced';

import classNames from 'classnames';
import styles from './SearchBox.scss';
const LPC_CARD_ID = 'LPCPseudoTabbableElement';

export interface SearchBoxProps {
    scenarioId: SearchScenarioId; // ID representing the search scenario (unique per scenario)
    customCollapsedMaxWidth?: number; // The max width when the control is collapsed
    isUsing3S?: boolean; // Is using 3S for search suggestions (for instrumentation)
    renderRefiners?: () => JSX.Element; // Render prop for search refiners button and menu
    searchPlaceHolderText?: string; // Placeholder string to be displayed in search input
    isDisabled?: boolean; // Boolean indicating if search box is disabled (default is false)
    showCompactSearchBox?: boolean; // Flag indicating if search box should be rendered in compact mode
    isSuggestCalloutDisabled?: boolean; // Boolean indicating if suggestion callout disabled (default is false)
    disableAutoFocusWhenActivated?: boolean; // Boolean indicating whether to disable automatically focusing when search session activates (default is false)
}

interface SearchBoxButtonProps {
    ariaLabel: string;
    iconProps: IIconProps;
    onClick: (evt?: any) => void;
    title: string;
}

@observer
export default class SearchBox extends React.Component<SearchBoxProps, {}> {
    private searchBoxContainer: HTMLDivElement;
    private searchInput: SearchInputHandle;
    private previousSearchActiveValue;

    constructor(props: SearchBoxProps) {
        super(props);

        const { isUsing3S = true } = props;

        // Initialize store for scenario.
        initializeScenarioStore(props.scenarioId, isUsing3S);
    }

    componentDidUpdate(prevProps: SearchBoxProps) {
        /**
         * Focus on search input if the component is transitioning from inactive to
         * active mode while in the compact mode as search input is not present in the DOM
         * when use clicks on the compact search icon so synchronously putting focus on
         * the search input right after the click does not work
         */
        const isSearchActive = this.isInActiveSearchSession();
        if (
            this.props.showCompactSearchBox == prevProps.showCompactSearchBox &&
            isSearchActive &&
            !this.previousSearchActiveValue &&
            !this.props.disableAutoFocusWhenActivated
        ) {
            this.focusSearchInput();
        }

        this.previousSearchActiveValue = isSearchActive;
    }

    /**
     * This computed represents if suggestions callout is shown.
     */
    @computed
    get isSuggestionsCalloutVisible(): boolean {
        const { isSuggestionsDropdownVisible, currentSuggestions } = getScenarioStore(
            this.props.scenarioId
        );

        return (
            !this.props.isSuggestCalloutDisabled &&
            currentSuggestions?.Suggestions?.length > 0 &&
            isSuggestionsDropdownVisible
        );
    }

    /**
     * Gets properties for the search box button. When the search box has focus,
     * the button is for executing a search. Otherwise, it's for exiting search.
     */
    @computed
    get searchBoxButtonProps(): SearchBoxButtonProps {
        if (getScenarioStore(this.props.scenarioId).searchBoxHasFocus) {
            return {
                ariaLabel: loc(SearchPlaceholder),
                iconProps: {
                    iconName: ControlIcons.Forward,
                },
                onClick: this.onSearchButtonClicked(),
                title: loc(SearchPlaceholder),
            };
        }

        return {
            ariaLabel: loc(exitSearchTitle),
            iconProps: {
                iconName: ControlIcons.Clear,
            },
            onClick: () => this.onExit('SearchBoxXButton'),
            title: loc(exitSearchTitle),
        };
    }

    @computed
    get searchGlyphClasses() {
        if (!isFeatureEnabled('sea-nextSearchBoxInteractions')) {
            return classNames(styles.searchIcon, this.props.isDisabled && styles.isDisabled);
        }

        return classNames(
            getScenarioStore(this.props.scenarioId).searchSessionGuid
                ? styles.searchIconFocused
                : styles.searchIconRest,
            this.props.isDisabled && styles.isDisabled
        );
    }

    @computed
    get isClearSearchBoxButtonVisible(): boolean {
        if (!isFeatureEnabled('sea-searchBoxInteractionsClear')) {
            return false;
        }

        // Visible if search box isn't empty.
        return !isSearchBoxEmpty(this.props.scenarioId);
    }

    private onExitClick = () => {
        this.onExit('SearchBoxBackArrow');
    };

    render() {
        const { isDisabled, scenarioId } = this.props;
        const showCompactSearchBox = getScenarioStore(scenarioId).showSearchBoxInCompactMode;
        const isSearchBoxExpanded = this.isInActiveSearchSession();

        const searchBoxContainerStyle = {
            maxWidth: `${getSearchBoxMaxWidth(
                isSearchBoxExpanded,
                this.props.customCollapsedMaxWidth
            )}px`,
            width: '100%',
        };

        const searchBoxCommonContainerClassNames = classNames(
            styles.searchBoxCommonContainer,
            showCompactSearchBox && styles.isInCompactMode,
            isSearchBoxExpanded && styles.searchBoxContainerInSearch
        );

        const searchBoxContainerClassNames = classNames(
            styles.searchBoxContainer,
            isSearchBoxExpanded && styles.searchBoxContainerNoBorderRadius,
            isSearchBoxExpanded && styles.searchBoxContainerInSearch,
            showCompactSearchBox && styles.isInCompactMode
        );

        if (showCompactSearchBox && !isSearchBoxExpanded) {
            return (
                <div
                    role={'search'}
                    className={searchBoxContainerClassNames}
                    ref={ref => (this.searchBoxContainer = ref)}>
                    <CompactSearchBox onClick={this.onCompactSearchButtonClick} />
                </div>
            );
        }

        const searchBoxClassNames = classNames(styles.searchBox, isDisabled && styles.isDisabled);

        const searchGlyphClassNames = this.searchGlyphClasses;

        const suggestionsComponent = this.isSuggestionsCalloutVisible ? (
            <SuggestionsCallout scenarioId={scenarioId} focusSearchInput={this.focusSearchInput} />
        ) : null;

        const clearSearchBoxButtonAriaProperties: AriaProperties = {
            role: AriaRoles.button,
            label: loc(clearSearchLabel),
        };

        const searchBoxColumnClassNames = classNames(
            styles.searchBoxColumnContainer,
            showCompactSearchBox && styles.isInCompactMode
        );

        // Announce when suggestions are available and visible
        const announcement = this.isSuggestionsCalloutVisible && loc(suggestionsAnnouncement);

        return (
            /**
             * Outer div is necessary to make this component have a single root element.
             */
            <div style={searchBoxContainerStyle} className={searchBoxCommonContainerClassNames}>
                {/**
                 * Flex column container div is necessary so that the filters anchor div gets proper width
                 */}
                {/* id is used by one-outlook-suite-header to track this div for hit testing */}
                <div className={searchBoxColumnClassNames} id={SEARCHBOX_COLUMN_CONTAINER_ID}>
                    <div
                        role={'search'}
                        tabIndex={-1}
                        className={searchBoxContainerClassNames}
                        ref={ref => (this.searchBoxContainer = ref)}
                        aria-expanded={this.isSuggestionsCalloutVisible}
                        onBlur={this.onSearchBoxBlur}>
                        {/* Search box */}
                        <div
                            id={getSearchBoxIdByScenarioId(scenarioId)}
                            className={searchBoxClassNames}>
                            {
                                /* Suggestions UI */
                                <ErrorBoundary type={ErrorComponentType.None}>
                                    {suggestionsComponent}
                                    <LazyAnnounced message={announcement} />
                                </ErrorBoundary>
                            }

                            {/* Left side (back button or search icon) */}
                            {isSearchBoxExpanded &&
                            !isFeatureEnabled('sea-nextSearchBoxInteractions') ? (
                                <IconButton
                                    className={classNames(styles.backButton, 'flipForRtl')}
                                    iconProps={{ iconName: ControlIcons.Back }}
                                    onClick={this.onExitClick}
                                    ariaLabel={loc(exitSearchTitle)}
                                />
                            ) : (
                                <div
                                    aria-hidden={true}
                                    className={searchGlyphClassNames}
                                    onClick={this.onSearchBoxClick}>
                                    <Icon iconName={ControlIcons.Search} />
                                </div>
                            )}

                            {/* Search input (pills and input) */}
                            <div
                                className={styles.searchQueryContainer}
                                onClick={this.onSearchBoxClick}>
                                {hasSuggestionPills(this.props.scenarioId) && (
                                    <SearchBoxPillWell
                                        focusSearchInput={this.focusSearchInput}
                                        onRemovePill={this.onRemovePill}
                                        scenarioId={this.props.scenarioId}
                                    />
                                )}
                                <SearchInput
                                    ref={ref => (this.searchInput = ref)}
                                    searchPlaceHolderText={this.props.searchPlaceHolderText}
                                    isDisabled={this.props.isDisabled}
                                    scenarioId={this.props.scenarioId}
                                    isSuggestionsCalloutVisible={this.isSuggestionsCalloutVisible}
                                />
                            </div>

                            {/* Clear search box button */}
                            {this.isClearSearchBoxButtonVisible && (
                                <div
                                    className={styles.clearBoxButton}
                                    onClick={this.onClearSearchBoxClicked}
                                    onKeyDown={this.onClearSearchBoxClickedKeyDown}
                                    tabIndex={0}
                                    title={loc(clearSearchLabel)}
                                    {...generateDomPropertiesForAria(
                                        clearSearchBoxButtonAriaProperties
                                    )}>
                                    <Icon
                                        iconName={ControlIcons.Clear}
                                        styles={{
                                            root: {
                                                fontSize: '8px',
                                            },
                                        }}
                                    />
                                </div>
                            )}

                            {/* Search refiners */}
                            {isSearchBoxExpanded && this.props.renderRefiners && (
                                /**
                                 * This wrapper div with tabindex of -1 is required
                                 * for focus events to have relatedTarget property
                                 * be non-null (because element receiving focus
                                 * needs to be able to receive focus, which divs
                                 * cannot unless given a tabindex value) in Safari.
                                 */
                                <div tabIndex={-1}>{this.props.renderRefiners()}</div>
                            )}

                            {/* "Search" / "Exit Search" button in interactions update */}
                            {isSearchBoxExpanded &&
                                isFeatureEnabled('sea-nextSearchBoxInteractions') && (
                                    <DefaultButton
                                        className={styles.searchBoxButton}
                                        styles={{ icon: { fontSize: '16px' } }}
                                        {...this.searchBoxButtonProps}
                                    />
                                )}
                        </div>

                        {/* Search button */}
                        {isSearchBoxExpanded && !isFeatureEnabled('sea-nextSearchBoxInteractions') && (
                            <IconButton
                                className={styles.searchButton}
                                iconProps={{
                                    iconName: ControlIcons.Search,
                                }}
                                onClick={this.onSearchButtonClicked()}
                                ariaLabel={loc(SearchPlaceholder)}
                            />
                        )}
                    </div>
                    {/* Anchor div required for search filters. */}
                    <div id={SEARCHBOX_ANCHOR_ID} />
                </div>
            </div>
        );
    }

    private isInActiveSearchSession = () => {
        // If searchSessionGuid has a value, user is in a search session.
        const store = getScenarioStore(this.props.scenarioId);
        return !!store.searchSessionGuid;
    };
    /**
     * Start search session when compact search button is clicked
     */
    private onCompactSearchButtonClick = () => {
        startSearchSession(
            'SearchCollapsedButton',
            false /* shouldStartSearch */,
            this.props.scenarioId
        );
    };

    /**
     * On clicking search scope picker, sets focus on SearchInput component if the Search box is empty.
     */
    public onSearchScopeSelected = async (scenarioId: SearchScenarioId) => {
        if (this.searchInput) {
            const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();
            if (isSearchBoxEmpty(scenarioId)) {
                this.searchInput.setFocus();
            }
        }
    };

    /**
     * Sets focus on SearchInput component.
     */
    public focusSearchInput = () => {
        /**
         * When trying to set focus on search input while search box is
         * in compact mode, simply start a search session. The focus will get
         * put in search input on component update for expanded search box
         */
        if (
            getScenarioStore(this.props.scenarioId).showSearchBoxInCompactMode &&
            !this.isInActiveSearchSession()
        ) {
            startSearchSession('Keyboard', false /* shouldStartSearch */, this.props.scenarioId);
        } else {
            this.searchInput.setFocus();
        }
    };

    /**
     * Click handler for the search button.
     */
    private onSearchButtonClicked() {
        return async (evt: React.MouseEvent<unknown>) => {
            evt.stopPropagation();

            const { scenarioId } = this.props;

            /**
             * If search box isn't empty, take action depending on whether
             * or not the user is in command mode. Otherwise, just focus the
             * search input.
             */
            const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();
            if (!isSearchBoxEmpty(scenarioId)) {
                // Hide suggestions dropdown.
                setIsSuggestionsDropdownVisible(false, this.props.scenarioId);
                startSearch('SearchButton', scenarioId, true /* explicitSearch */);
            } else {
                this.focusSearchInput();
            }
        };
    }

    /**
     * Click handler to set focus on the SearchInput component.
     */
    private onSearchBoxClick = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
        this.focusSearchInput();
    };

    /**
     * Dispatches the exitSearch action to notify consumer that user wants to exit
     * the search experience.
     */
    private onExit = (actionSource: string) => {
        exitSearch(
            actionSource,
            this.props.scenarioId,
            isFeatureEnabled('sea-nextSearchBoxInteractions') /* forceExit */
        );
    };

    /**
     * Focus handler for when an element within the SearchBox component loses focus.
     * We check if the element receiving focus is within the SearchBox component,
     * and only dispatch the blur action if it is not.
     */
    private onSearchBoxBlur = (evt: React.FocusEvent<EventTarget>) => {
        let relatedTargetElement = evt.relatedTarget as HTMLElement;

        // Fallback for IE, which doesn't always set relatedTarget.
        if (!relatedTargetElement) {
            relatedTargetElement = document.activeElement as HTMLElement;
        }

        /**
         * A way of determining if element that caused JavaScript event is from
         * within search box.
         *
         * In case of IE, as relatedTarget is undefined we fallback to
         * activeElement.
         *
         * When user clicks on the persona card, the activeElement is the
         * LPC card's container div whose id is 'LPCPseudoTabbableElement'. The elementContains
         * function fails for this element and hence we are falling back to comparing the ID of this
         * div when determining whether the search box entirely lost focus.
         * VSO: 32596 - Search input grabs focus upon dismissing the suggestion dropdown while the
         * LPC card was open for any people suggestion
         *
         * For Safari, the relatedTargetElement is the div that the target is
         * contained within, so in the case of the search box interactions
         * execute search button, the elementContains check fails, so just check
         * if that element IS the search box container itself.
         *
         * Firefox on Mac does not focus the SEARCH_SCOPE_SWITCHER_ID button. Adding a outer div with a tabindex fixes it.
         * Hence there needs to be additional check for SEARCH_SCOPE_SWITCHER_WRAPPER_ID
         *
         * With IE, when the dropdown is clicked, the relatedTargetElement.id takes the value of SEARCH_SCOPE_SWITCHER_ID_OPTION.
         * Thus, it was added to prevent the search box from being blurred.
         */

        const searchScopeButton = document.getElementById(SEARCH_SCOPE_SWITCHER_ID);

        const isTargetElementWithinSearchBox =
            elementContains(this.searchBoxContainer, relatedTargetElement) ||
            elementContains(searchScopeButton, relatedTargetElement) ||
            relatedTargetElement.id == LPC_CARD_ID ||
            relatedTargetElement.id == SEARCH_SCOPE_SWITCHER_ID_OPTION ||
            relatedTargetElement.id == SEARCH_SCOPE_SWITCHER_ID_LIST ||
            relatedTargetElement.id === SEARCH_SCOPE_SWITCHER_ID ||
            relatedTargetElement.id === SEARCH_SCOPE_SWITCHER_WRAPPER_ID ||
            (relatedTargetElement.firstElementChild &&
                relatedTargetElement.firstElementChild.id === SEARCHBOX_ID);

        // Truly "blur" only if event is from outside of search box.
        if (!isTargetElementWithinSearchBox) {
            setIsSuggestionsDropdownVisible(false, this.props.scenarioId);
            searchBoxBlurred(this.props.scenarioId);
        }
    };

    /**
     * Click handler when user chooses to click the "X" on a pill to remove it
     * from the search box.
     */
    private onRemovePill = async (suggestionPillId: string) => {
        // Dispatch action for to remove suggestion pill from store.
        const removeSuggestionPillFromSearchBox = await lazyRemoveSuggestionPillFromSearchBox.import();
        removeSuggestionPillFromSearchBox(suggestionPillId, this.props.scenarioId, 'Click');
    };

    private onClearSearchBoxClicked = (
        evt: React.MouseEvent<unknown> | React.KeyboardEvent<unknown>
    ) => {
        const scenarioId = this.props.scenarioId;
        evt.stopPropagation();

        // Clear text and pills in the search box.
        clearSearchBox(scenarioId);

        // Put focus back into the search input.
        this.focusSearchInput();

        // Log datapoint that button was clicked.
        logUsage('Search_ClearSearchBoxButtonClicked', [SearchScenarioId[scenarioId]]);
    };

    /**
     * Because we have to use a div instead of a button to get the proper padding,
     * we have to manually handle the keyboard interactions. If user interacts
     * with the "clear search box" button via the keyboard (Enter or Space), then
     * call the click handler.
     */
    private onClearSearchBoxClickedKeyDown = (evt: React.KeyboardEvent<unknown>) => {
        if (evt.keyCode === KeyCodes.enter || evt.keyCode === KeyCodes.space) {
            this.onClearSearchBoxClicked(evt);
        }
    };
}
