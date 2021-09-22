import { MOVETO_WIDTH } from '../utils/constants';
import type { ActionSource } from 'owa-analytics-types';
import { getCustomIcon } from 'owa-folders-common';
import { listViewStore } from 'owa-mail-list-store';
import * as lazyTriageActions from 'owa-mail-triage-action';
import { getMoveToMenuProps } from 'owa-mail-moveto-control';
import { IContextualMenuProps, DirectionalHint } from '@fluentui/react/lib/ContextualMenu';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { copyToADifferentFolder } from 'owa-locstrings/lib/strings/copytoadifferentfolder.locstring.json';
import loc from 'owa-localize';
import type { MailboxType } from 'owa-graph-schema';
import { createNewFolder } from './createNewFolderUtil';

/**
 * Gets the copy to folder menu items for context menu
 * @param tableViewId the tableView id
 * @param dismissMenu the callback to be called to dismiss of menu
 * @param actionSource the actionSource
 * @return returns the contextual menu items
 */
export function getCopyToProperties(
    tableViewId: string,
    dismissMenu: (ev?: any) => void,
    actionSource: ActionSource
): IContextualMenuProps {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const supportedMailboxTypes: MailboxType[] = ['UserMailbox'];
    if (!isConsumer()) {
        supportedMailboxTypes.push('ArchiveMailbox', 'SharedMailbox');
    }

    const copyToMenuProps = getMoveToMenuProps({
        supportedMailboxTypes,
        shouldShowSearchBox: false,
        actionSource: actionSource,
        createNewFolder: createNewFolder,
        dismissMenu: dismissMenu,
        onFolderClick: folderId => {
            lazyTriageActions.lazyCopyMailListRows.importAndExecute(
                [...tableView.selectedRowKeys.keys()],
                tableView,
                folderId,
                tableView.tableQuery.folderId,
                actionSource
            );
        },
        getCustomIcon: getCustomIcon,
        directionalHint: DirectionalHint.rightTopEdge,
        directionalHintFixed: true,
        width: MOVETO_WIDTH,
        viewAllFoldersDisplayText: loc(copyToADifferentFolder),
    });

    return copyToMenuProps;
}
