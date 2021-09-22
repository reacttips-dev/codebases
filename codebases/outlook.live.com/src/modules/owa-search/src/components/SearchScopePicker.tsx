import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { onSearchScopeButtonClicked } from 'owa-search-actions/lib/actions/onSearchScopeButtonClicked';
import { onSearchScopeOptionSelected } from 'owa-search-actions/lib/actions/onSearchScopeOptionSelected';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { SearchScopeMenuLabel } from './SearchScopePicker.locstring.json';
import loc, { format } from 'owa-localize';
import { SEARCH_SCOPE_SWITCHER_ID, SEARCH_SCOPE_SWITCHER_WRAPPER_ID } from 'owa-search-constants';
import { getKey } from 'owa-search-service/lib/helpers/searchScope/SearchScenario';
import type { SearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import styles from './SearchScopePicker.scss';

export interface SearchScopePickerProps {
    selectedSearchScope?: SearchScope;
    selectedSearchScopeDisplayName: string;
    searchScopes: () => IDropdownOption[];
    onSearchScopeSelected: () => void;
    scenarioId: SearchScenarioId;
}

export default observer(function SearchScopePicker(props: SearchScopePickerProps) {
    const store = getScenarioStore(props.scenarioId);
    const isScopePickerVisible = store.isScopePickerVisible;
    const newIsScopePickerVisible = !isScopePickerVisible;

    const onScopeButtonClick = React.useCallback(() => {
        onSearchScopeButtonClicked(newIsScopePickerVisible, props.scenarioId);
    }, [newIsScopePickerVisible]);

    const onSearchScopeChange = (
        event: React.FormEvent<HTMLDivElement>,
        option: IDropdownOption
    ) => {
        const { key } = option;
        onSearchScopeOptionSelected(key as string, props.scenarioId);
        props.onSearchScopeSelected();
    };

    const selectedSearchScopeDisplayName: string = props.selectedSearchScopeDisplayName;

    const onRenderTitle = () => {
        return <span>{selectedSearchScopeDisplayName}</span>;
    };

    if (!selectedSearchScopeDisplayName) {
        return null;
    }

    return (
        <div
            tabIndex={-1}
            id={SEARCH_SCOPE_SWITCHER_WRAPPER_ID}
            className={styles.searchScopeWrapper}>
            <Dropdown
                id={SEARCH_SCOPE_SWITCHER_ID}
                ariaLabel={format(loc(SearchScopeMenuLabel), props.selectedSearchScopeDisplayName)}
                options={props.searchScopes()}
                selectedKey={getKey(props.selectedSearchScope)}
                className={styles.searchScopeNeutral}
                styles={{
                    title: styles.foldersDropdownTitle,
                    dropdownItem: styles.foldersDropdownItem,
                    dropdownItemSelected: styles.foldersDropdownItemSelected,
                }}
                calloutProps={{
                    className: styles.calloutDetails,
                    styles: {
                        // !important is required to override styles that are
                        // being added directly to the Callout wrapper by the
                        // Fluent library.
                        calloutMain: {
                            maxHeight: 'none !important',
                            overflowY: 'hidden !important',
                        },
                    },
                }}
                onClick={onScopeButtonClick}
                onChange={onSearchScopeChange}
                onRenderTitle={onRenderTitle}
            />
        </div>
    );
});
