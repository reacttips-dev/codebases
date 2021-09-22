import * as React from 'react';
import { getSearchBoxLeftPadding } from 'owa-mail-layout';
import MailSearchBoxContainer from 'owa-mail-search/lib/components/MailSearchBoxContainer';
import { FolderScopePicker } from 'owa-mail-search/lib/lazyFunctions';
import { MailModuleDiagnosticsPanel } from 'owa-mail-diagnostics';
import type { SearchBoxContainerHandle } from 'owa-search/lib/types/SearchBoxContainerHandle';
import { lazySetShowSearchBoxInCompactMode } from 'owa-search-actions/lib/lazyFunctions';
import { SearchScenarioId } from 'owa-search-store';
import { getSelectedGroupId, isGroupSelected, lazyIsPrivateUnjoinedGroup } from 'owa-group-utils';

export default function getMailHeaderProps(
    searchBoxRef: React.RefObject<SearchBoxContainerHandle>
) {
    return {
        props: {
            searchAlignmentWidth: getSearchBoxLeftPadding(),
            renderSearch: () => (
                <MailSearchBoxContainer isDisabled={isSearchDisabled()} ref={searchBoxRef} />
            ),
            searchBoxRespond: searchBoxRespond,
            renderSearchScopePicker: () => <FolderScopePicker searchBoxRef={searchBoxRef} />,
            enableResponsiveLayout: true,
            DiagnosticsPanel: MailModuleDiagnosticsPanel,
        },
        changes: `${isSearchDisabled()}`,
    };
}

/**
 * Let search box respond correctly when it
 * has reached its 0 responsive step OR it reaches
 * to next non-zero responsiveStep defined
 */
async function searchBoxRespond(responsiveStep: number) {
    const setShowSearchBoxInCompactMode = await lazySetShowSearchBoxInCompactMode.import();
    setShowSearchBoxInCompactMode(SearchScenarioId.Mail, responsiveStep === 0);
}

function isSearchDisabled() {
    if (isGroupSelected()) {
        const isPrivateUnjoinedGroup = lazyIsPrivateUnjoinedGroup.tryImportForRender();
        if (isPrivateUnjoinedGroup) {
            return isPrivateUnjoinedGroup(getSelectedGroupId());
        }
    }
    return false;
}
