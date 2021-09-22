import { observer } from 'mobx-react-lite';
import {
    advancedSearchFoldersLabel,
    searchScopesAriaLabel,
} from './FoldersDropdown.locstring.json';
import loc, { format } from 'owa-localize';
import { onFolderDropdownOptionSelected } from '../../actions/internalActions';
import { getStore } from '../../store/store';
import getSearchScopeDisplayName from '../../utils/getSearchScopeDisplayName';
import getFolderMenuOptions from '../../utils/getFolderMenuOptions';
import { Label } from '@fluentui/react/lib/Label';
import { logUsage } from 'owa-analytics';
import { getKey, SearchScope, SearchScopeKind } from 'owa-search-service';

import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdown } from '@fluentui/react/lib/Dropdown';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { SearchScenarioId } from 'owa-search-store';
import KeyboardCharCodes from 'owa-hotkeys/lib/utils/keyboardCharCodes';

import styles from './AdvancedSearch.scss';

export interface FoldersDropdownProps {
    useLeftLabel: boolean;
    onFocusChange: (isFowardNavigation: boolean) => void;
}

export interface FoldersDropdownHandle {
    focusElement(): void;
}

export default observer(
    function FoldersDropdown(props: FoldersDropdownProps, ref: React.Ref<FoldersDropdownHandle>) {
        const dropdown = React.useRef<IDropdown>();
        React.useImperativeHandle(
            ref,
            () => ({
                focusElement() {
                    dropdown.current.focus();
                },
            }),
            []
        );
        const onKeyDown = (evt: React.KeyboardEvent<unknown>) => {
            if (evt.shiftKey && evt.keyCode === KeyboardCharCodes.Tab) {
                evt.preventDefault();
                evt.stopPropagation();
                props.onFocusChange(false);
            }
        };
        const { useLeftLabel } = props;
        const fieldContainerLabel = useLeftLabel
            ? styles.formFieldContainerLeft
            : styles.formFieldContainerAbove;
        const selectedSearchScope = getSelectedOption();
        const dropdownItems: IDropdownOption[] = [];

        return (
            <div className={fieldContainerLabel} onKeyDown={onKeyDown}>
                <Label
                    styles={{ root: styles.formFieldLabel }}
                    title={loc(advancedSearchFoldersLabel)}>
                    {loc(advancedSearchFoldersLabel)}
                </Label>
                <Dropdown
                    ariaLabel={format(
                        loc(searchScopesAriaLabel),
                        getSearchScopeDisplayName(selectedSearchScope)
                    )}
                    className={styles.foldersDropdown}
                    onChange={onChange}
                    options={getFolderMenuOptions(dropdownItems)}
                    selectedKey={getKey(selectedSearchScope)}
                    styles={{
                        dropdownItemsWrapper: styles.foldersDropdownItemsWrapper,
                        title: styles.foldersDropdownTitle,
                        root: styles.foldersDropdownRoot,
                    }}
                    componentRef={dropdown}
                />
            </div>
        );
    },
    { forwardRef: true }
);

/**
 * Determines the selected option in the dropdown. If the user hasn't yet
 * selected an option, the default selected option will be used. Otherwise,
 * whatever the user manually selected will be respected.
 */
function getSelectedOption(): SearchScope {
    const { staticSearchScope: selectedSearchScope, advancedSearchViewState } = getStore();
    return advancedSearchViewState.selectedSearchScope || selectedSearchScope;
}

/**
 * Gets the corresponding search scope based on the key of the selected
 * dropdown option and dispatches an action to update the store.
 *
 * @param event The onChange event (unused)
 * @param option The option that was selected by the user
 */
function onChange(event: any, option: IDropdownOption) {
    const {
        staticSearchScopeList: searchScopes,
        staticSearchScope: previousScope,
        initialSearchScope,
    } = getStore();
    const { key } = option;
    let selectedScope = searchScopes.filter((scope: SearchScope) => {
        return getKey(scope) === key;
    })[0];
    // In case of searching from subfolders and groups and changing scope from folder scope or advanced search filter, fall back on initialSearchScope
    if (!selectedScope) {
        selectedScope = initialSearchScope;
    }
    // Log folder scope change (if within primary or archive mailbox).
    if (
        (previousScope.kind === SearchScopeKind.PrimaryMailbox &&
            selectedScope.kind === SearchScopeKind.PrimaryMailbox) ||
        (previousScope.kind === SearchScopeKind.ArchiveMailbox &&
            selectedScope.kind === SearchScopeKind.ArchiveMailbox)
    ) {
        logUsage('Search_AdvancedSearchScopeChanged', [
            folderIdToName(previousScope.folderId),
            folderIdToName(selectedScope.folderId),
            selectedScope.kind,
            SearchScenarioId.Mail,
        ]);
    }
    onFolderDropdownOptionSelected({
        key: getKey(selectedScope),
        text: getSearchScopeDisplayName(selectedScope),
        searchScope: selectedScope,
    });
}
