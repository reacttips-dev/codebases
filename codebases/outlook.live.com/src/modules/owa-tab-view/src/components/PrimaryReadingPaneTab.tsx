import { loadingWithThreeDots as loadingFolder } from 'owa-locstrings/lib/strings/loading.locstring.json';
import { searchResults } from 'owa-locstrings/lib/strings/searchresults.locstring.json';
import { mailListErrorMessage } from 'owa-locstrings/lib/strings/maillisterrormessage.locstring.json';
import { folderIsEmpty } from 'owa-locstrings/lib/strings/folderisempty.locstring.json';
import { emptyStateMessageSelectAnItemToRead } from 'owa-locstrings/lib/strings/emptystatemessageselectanitemtoread.locstring.json';
import { folderIsBeingEmptied } from 'owa-locstrings/lib/strings/folderisbeingemptied.locstring.json';
import { someItemsSelected } from 'owa-locstrings/lib/strings/someitemsselected.locstring.json';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';
import { getMailListLoadState } from 'owa-mail-list-store/lib/utils/getMailListLoadState';
import readingPaneStore from 'owa-mail-reading-pane-store/lib/store/Store';

import { ControlIcons } from 'owa-control-icons';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';

import {
    getIsEverythingSelectedInTable,
    getFocusedFilterForTable,
    getSelectedTableView,
    MailRowDataPropertyGetter,
    TableQueryType,
    isInVirtualSelectionExclusionMode,
    isConversationView,
    getRowSelectionStringForSelectAll,
} from 'owa-mail-list-store';
import { Icon } from '@fluentui/react/lib/Icon';
import { isBulkActionInState, BulkActionStateEnum } from 'owa-bulk-action-store';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';
import { observer } from 'mobx-react-lite';
import type { PrimaryReadingPaneTabViewState } from 'owa-tab-store/lib/store/schema/TabViewState';
import { someConversationsSelected } from 'owa-mail-list-store/lib/selectors/getItemsOrConversationsSelectedText.locstring.json';
import styles from './ReadingPaneTab.scss';

interface PrimaryReadingPaneTabProps {
    className: string;
    subjectClassName: string;
    viewState: PrimaryReadingPaneTabViewState;
}

const PrimaryReadingPaneTab = observer(function PrimaryReadingPaneTab(
    props: PrimaryReadingPaneTabProps
) {
    const tableView = getSelectedTableView();

    if (!tableView) {
        return null;
    }

    const { className, subjectClassName } = props;
    const focusedFilter = getFocusedFilterForTable(tableView);
    let inlineCompose = null;
    const { tableQuery } = tableView;
    const mailListLoadState = getMailListLoadState();
    let text = '';
    const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
    const { folderId, type } = tableQuery;
    const isEverythingSelectedInTable = getIsEverythingSelectedInTable(tableView);

    // User is in select all mode or virtual select all with some deselected rows
    if (isEverythingSelectedInTable || isInVirtualSelectionExclusionMode(tableView)) {
        text = getRowSelectionStringForSelectAll(
            isEverythingSelectedInTable,
            tableView,
            focusedFilter
        );
    } else if (selectedRowKeys.length > 1) {
        // Multiple items selected or all items are selected
        text = isConversationView(tableView)
            ? format(loc(someConversationsSelected), selectedRowKeys.length)
            : format(loc(someItemsSelected), selectedRowKeys.length);
    } else if (selectedRowKeys.length == 1) {
        // 1 item selected: display reading pane
        const subjectOfSelectedRow = MailRowDataPropertyGetter.getSubject(
            selectedRowKeys[0],
            tableView
        );
        text = subjectOfSelectedRow || '';
        if (text.trim() == '') {
            text = loc(noSubject);
        }

        inlineCompose =
            isConversationView(tableView) &&
            findInlineComposeViewState(
                MailRowDataPropertyGetter.getRowIdString(selectedRowKeys[0], tableView)
            );
    } else if (
        mailListLoadState == MailListViewState.Loaded ||
        readingPaneStore.shouldShowEmptyReadingPane
    ) {
        // Empty state.
        text = loc(emptyStateMessageSelectAnItemToRead);
    } else if (mailListLoadState == MailListViewState.Empty) {
        // Folder is empty
        text =
            isBulkActionInState(folderId, BulkActionStateEnum.Uninitialized) ||
            isBulkActionInState(folderId, BulkActionStateEnum.Running)
                ? loc(folderIsBeingEmptied)
                : loc(folderIsEmpty);
    } else if (mailListLoadState == MailListViewState.Error) {
        // Load folder failed
        text = loc(mailListErrorMessage);
    } else if (type == TableQueryType.Search) {
        // Showing search result
        text = loc(searchResults);
    } else {
        // Folder is still loading
        text = loc(loadingFolder);
    }

    return (
        <div className={className} title={text}>
            {inlineCompose && <Icon iconName={ControlIcons.Edit} className={styles.leftIcon} />}
            <div className={subjectClassName}>{text}</div>
        </div>
    );
});
export default PrimaryReadingPaneTab;
