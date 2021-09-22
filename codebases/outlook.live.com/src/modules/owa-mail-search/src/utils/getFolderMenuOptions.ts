import { compareSearchScope, getKey, SearchScope, SearchScopeKind } from 'owa-search-service';
import folderStore from 'owa-folders';
import getSearchScopeDisplayName from './getSearchScopeDisplayName';
import { DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { getStore } from '../store/store';
import shouldShowInScopeSelector from './shouldShowInScopeSelector';

/**
 * Returns array of dropdown options for folders dropdown.
 */
export default function getFolderMenuOptions(dropdownItems: IDropdownOption[]) {
    const { staticSearchScopeList: searchScopes, initialSearchScope } = getStore();

    // Add the initial folder scope (if not there already).
    const initialSearchScopePresent =
        searchScopes.filter(searchScope => compareSearchScope(searchScope, initialSearchScope))
            .length === 1;

    if (!initialSearchScopePresent) {
        dropdownItems.push({
            key: getKey(initialSearchScope),
            text: getSearchScopeDisplayName(initialSearchScope),
        });
    }

    // Add distinguished folder items first.
    dropdownItems.push(...getFolderOptions(true /* isDistinguished */));

    // Add divider (if any distinguished folders were added).
    if (dropdownItems.length > 0) {
        dropdownItems.push({
            key: 'foldersDropdownDivider',
            text: '-',
            itemType: DropdownMenuItemType.Divider,
        });
    }

    // Add user folder items.
    dropdownItems.push(...getFolderOptions(false /* isDistinguished */));

    return dropdownItems;
}

/**
 * Helper function to get folders (distinguished or not) and convert them
 * to an array of IDropdownOption objects to get rendered.
 *
 * @param isDistinguished Indicates whether or not distinguished folders should
 * be returned.
 */
function getFolderOptions(isDistinguished: boolean): IDropdownOption[] {
    const { staticSearchScopeList: searchScopes } = getStore();
    const dropdownItems: IDropdownOption[] = [];

    searchScopes
        .filter((scope: SearchScope) => {
            switch (scope.kind) {
                case SearchScopeKind.PrimaryMailbox:
                    return (
                        !!folderStore.folderTable.get(scope.folderId).DistinguishedFolderId ===
                        isDistinguished
                    );
                default:
                    return !isDistinguished;
            }
        })
        .map((scope: SearchScope) => {
            if (shouldShowInScopeSelector(scope)) {
                dropdownItems.push({
                    key: getKey(scope),
                    text: getSearchScopeDisplayName(scope),
                });
            }
        });

    return dropdownItems;
}
