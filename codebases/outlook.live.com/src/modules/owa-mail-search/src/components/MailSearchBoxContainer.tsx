import { observer } from 'mobx-react-lite';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { SearchPlaceholder } from 'owa-locstrings/lib/strings/searchplaceholder.locstring.json';
import {
    SearchDisabledPrivateGroup,
    archiveMailboxFoldersSearchPlaceholder,
} from './MailSearchBoxContainer.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { folderForestStore } from 'owa-mail-folder-forest-store';
import type { SearchBoxContainerHandle } from 'owa-search/lib/types/SearchBoxContainerHandle';
import SearchBox from 'owa-search/lib/components/SearchBox';
import is3SServiceAvailable from 'owa-search/lib/utils/is3SServiceAvailable';
import { SearchScenarioId } from 'owa-search-store';
import { isFolderOrSubFolderOfArchiveRoot } from 'owa-mail-store';
import { getStore as getMailSearchStore } from '../store/store';
import {
    AdvancedSearchWrapper,
    lazyShouldShowInScopeSelector,
    lazyGetNaturalLanguageGhostText,
} from '../lazyFunctions';
import { isReadingPanePositionRight, getSearchBoxWidthFromListView } from 'owa-mail-layout';
import isNaturalLanguageGhostTextEnabled from '../utils/isNaturalLanguageGhostTextEnabled';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface MailSearchBoxContainerProps {
    isDisabled?: boolean; // Boolean indicating if search box is disabled (default is false)
}

export default observer(
    function MailSearchBoxContainer(
        props: MailSearchBoxContainerProps,
        ref: React.Ref<SearchBoxContainerHandle>
    ) {
        const searchBox = React.useRef<SearchBox>();
        /**
         * This computed represents if suggestions is disabled
         */
        const isSuggestionsCalloutDisabled = useComputed((): boolean => {
            const shouldShowInScopeSelector = lazyShouldShowInScopeSelector.tryImportForRender();
            if (shouldShowInScopeSelector) {
                const { initialSearchScope } = getMailSearchStore();
                return !shouldShowInScopeSelector(initialSearchScope);
            } else {
                return false;
            }
        });
        React.useImperativeHandle(
            ref,
            () => ({
                /**
                 * Publicly  exposed function that allows parent to set focus inside of the
                 * search input when search scope is empty on click of search scope item
                 */
                onSearchScopeSelected(searchScenarioId: SearchScenarioId) {
                    searchBox.current.onSearchScopeSelected(searchScenarioId);
                },
                /**
                 * Publicly  exposed function that allows parent to set focus inside of the
                 * search input.
                 */
                setFocus() {
                    searchBox.current.focusSearchInput();
                },
            }),
            []
        );
        /**
         * This function gets the max width of the search box.
         */
        const getCustomCollapsedMaxWidth = (): number => {
            /**
             * If the user is in 3 column view, the max width of the search box should
             * match the width of the message list. Otherwise, it's unbounded.
             */
            return isReadingPanePositionRight() ? getSearchBoxWidthFromListView() : null;
        };
        /**
         * Returns the placeholder text for the search box.
         */
        const getSearchPlaceholderText = (): string => {
            /**
             * Currently, there's only 1 scenario (user viewing a private group that
             * they are not a member of) where the search box is disabled, so checking
             * isDisabled prop is sufficient.
             */
            if (props.isDisabled) {
                return loc(SearchDisabledPrivateGroup);
            }
            /**
             * If search box is not disabled, return the appropriate string depending
             * on if the user is in their primary or archive mailbox.
             */
            if (
                folderForestStore.selectedNode &&
                isFolderOrSubFolderOfArchiveRoot(folderForestStore.selectedNode.id)
            ) {
                return loc(archiveMailboxFoldersSearchPlaceholder);
            }

            let naturalLanguageGhostText;
            if (isNaturalLanguageGhostTextEnabled()) {
                const getNaturalLanguageGhostText = lazyGetNaturalLanguageGhostText.tryImportForRender();
                // if the function is ready to be used
                if (getNaturalLanguageGhostText) {
                    naturalLanguageGhostText = getNaturalLanguageGhostText();
                }
            }
            return naturalLanguageGhostText || loc(SearchPlaceholder);
        };

        /**
         * We always use 3S for suggestions if we're not
         * in explicit logon.
         */
        const isUsing3S =
            is3SServiceAvailable() &&
            (!getUserConfiguration().SessionSettings.IsExplicitLogon ||
                isFeatureEnabled('sea-3s-explicitLogon'));
        return (
            <SearchBox
                customCollapsedMaxWidth={getCustomCollapsedMaxWidth()}
                isUsing3S={isUsing3S}
                ref={searchBox}
                renderRefiners={
                    isSuggestionsCalloutDisabled.get() ? undefined : () => <AdvancedSearchWrapper />
                }
                searchPlaceHolderText={getSearchPlaceholderText()}
                isDisabled={props.isDisabled}
                scenarioId={SearchScenarioId.Mail}
                isSuggestCalloutDisabled={isSuggestionsCalloutDisabled.get()}
            />
        );
    },
    { forwardRef: true }
);
