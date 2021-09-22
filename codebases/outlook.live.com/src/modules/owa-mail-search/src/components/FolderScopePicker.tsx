import { observer } from 'mobx-react-lite';
import { SearchScopePicker } from 'owa-search/lib/lazyFunctions';
import type { SearchBoxContainerHandle } from 'owa-search/lib/types/SearchBoxContainerHandle';
import { SearchScenarioId } from 'owa-search-store';
import getFolderMenuOptions from '../utils/getFolderMenuOptions';
import getSelectedSearchScopeDisplayName from '../utils/getSelectedSearchScopeDisplayName';
import * as React from 'react';
import type { SearchScope } from 'owa-search-service';
import { getStore } from '../store/store';
import type { IDropdownOption } from '@fluentui/react/lib/Dropdown';

export interface FolderScopePickerProps {
    searchBoxRef: React.RefObject<SearchBoxContainerHandle>;
}

export default observer(function FolderScopePicker(props: FolderScopePickerProps) {
    const onSearchScopeSelected = React.useCallback(() => {
        props.searchBoxRef.current.onSearchScopeSelected(SearchScenarioId.Mail);
    }, []);

    /* Function wrapper required to reduce likelihood of null data in store.
     * SearchScopePicker calls the function at a time when required data is available.
     */
    const searchScopes = (): IDropdownOption[] => {
        return getFolderMenuOptions([]);
    };

    const selectedSearchScopeDisplayName = getSelectedSearchScopeDisplayName();

    const { staticSearchScope: selectedSearchScope, advancedSearchViewState } = getStore();
    const currentSearchScope: SearchScope =
        advancedSearchViewState.selectedSearchScope || selectedSearchScope;

    return (
        <SearchScopePicker
            selectedSearchScope={currentSearchScope}
            onSearchScopeSelected={onSearchScopeSelected}
            selectedSearchScopeDisplayName={selectedSearchScopeDisplayName}
            scenarioId={SearchScenarioId.Mail}
            searchScopes={searchScopes}
        />
    );
});
