import { getSelectedTableView } from 'owa-mail-list-store';
import groupHeaderCommandBarStore from 'owa-group-header-store/lib/store/CommandBarStore';
import folderStore from 'owa-folders';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import * as React from 'react';
import { isFeatureEnabled } from 'owa-feature-flags';
import GroupHeaderNavigationButton from 'owa-group-header-store/lib/store/schema/NavigationButton';
import NewMessageButton from 'owa-mail-commandbar/lib/components/NewMessageButton';
import { lazyCreateNewNote } from 'owa-notes-store';
import { lazyOpenCompose } from 'owa-mail-compose-actions';
import { getSelectedPublicFolderId } from 'owa-publicfolder-utils';
import checkAndCreateNewMessage from 'owa-mail-message-actions/lib/actions/checkAndCreateNewMessage';
import { getSelectedGroupId } from 'owa-group-utils';
import { observer } from 'mobx-react-lite';

import styles from '../components/MailModule.scss';

export interface MailNewMessageButtonProps {
    isInGroupsView?: boolean;
    shouldShowPublicFolderView: boolean;
    newMsgBtnRef?: (ref: HTMLDivElement) => void;
}

export default observer(function MailNewMessageButton(props: MailNewMessageButtonProps) {
    const { isInGroupsView, shouldShowPublicFolderView, newMsgBtnRef } = props;
    const currentView = groupHeaderCommandBarStore.navigationButtonSelected;
    const inGroupFiles = isInGroupsView && currentView == GroupHeaderNavigationButton.Files;
    const tableView = getSelectedTableView();
    const sourceFolder = folderStore.folderTable.get(tableView.tableQuery.folderId);

    // Show 'New Note' instead of 'New Message' when notes is selected
    const shouldShowNewNoteButton =
        !!sourceFolder &&
        folderIdToName(sourceFolder.FolderId.Id) == 'notes' &&
        isFeatureEnabled('notes-folder-view');

    const onNewMessageButtonClicked = () => {
        const targetId = shouldShowPublicFolderView
            ? getSelectedPublicFolderId()
            : !isFeatureEnabled('grp-groupHeaderV2')
            ? getSelectedGroupId()
            : null;
        checkAndCreateNewMessage('CommandBar', targetId);
    };

    return (
        <div className={styles.newMessageButtonWrapper}>
            {shouldShowNewNoteButton ? (
                <NewMessageButton
                    elementRef={newMsgBtnRef}
                    scenario={'notes'}
                    onClick={onNewNoteButtonClicked}
                />
            ) : inGroupFiles ? null : (
                <NewMessageButton
                    elementRef={newMsgBtnRef}
                    scenario={shouldShowPublicFolderView ? 'publicFolder' : 'default'}
                    onClick={onNewMessageButtonClicked}
                    onMouseOver={lazyOpenCompose.import}
                />
            )}
        </div>
    );
});

function onNewNoteButtonClicked() {
    lazyCreateNewNote.importAndExecute('NotesFolder');
}
