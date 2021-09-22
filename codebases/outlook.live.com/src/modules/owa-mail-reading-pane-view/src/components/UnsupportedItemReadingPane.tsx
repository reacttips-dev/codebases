import { observer } from 'mobx-react-lite';
import { itemMustBeMoved, moveToDefaultFolder } from './UnsupportedItemReadingPane.locstring.json';
import { deleteItem } from 'owa-locstrings/lib/strings/deleteitem.locstring.json';
import loc, { format } from 'owa-localize';
import { CommandButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { getSelectedTableView, TableView } from 'owa-mail-list-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import * as lazyTriageActions from 'owa-mail-triage-action';

import * as trace from 'owa-trace';
import * as React from 'react';
import {
    getDefaultFolderId,
    getFolderName,
} from 'owa-mail-reading-pane-store/lib/utils/unsupportedItemUtils';
import { updateAddinOnItemNavigation } from 'owa-mail-addins';
import { SelectionType } from 'owa-addins-core';

import styles from './UnsupportedItemReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface UnsupportedItemReadingPaneProps {
    itemId: string;
    isItemAttachment?: boolean;
}
export default observer(function UnsupportedItemReadingPane(
    props: UnsupportedItemReadingPaneProps
) {
    React.useEffect(() => {
        updateAddinOnItemNavigation(SelectionType.Empty);
    }, []);
    const { itemId, isItemAttachment } = props;
    const item = mailStore.items.get(itemId);
    if (!item) {
        // VSTS: 25045. If the item has been removed from the mailStore, return null to avoid component errors.
        trace.errorThatWillCauseAlert("UnsupportedItemReadingPane can't find item");
        return null;
    }
    const tableView = getSelectedTableView();
    const destinationFolderId = getDefaultFolderId(item.ItemId.Id);
    const onClickMoveRow = () => {
        moveRow(tableView, destinationFolderId);
    };
    const onClickDeleteRow = () => {
        deleteRow(tableView);
    };
    return (
        <div className={styles.unsupportedContainer}>
            <span className={classNames('o365-Icon--folderClosed', styles.unsupportedIcon)} />
            <div className={styles.mainText}>{item.Subject}</div>
            <div className={styles.subText}>{loc(itemMustBeMoved)}</div>
            {!isItemAttachment && (
                <ul className={styles.actions}>
                    <CommandButton
                        aria-hidden={true}
                        className={styles.triageActionButton}
                        iconProps={{ iconName: ControlIcons.Delete }}
                        onClick={onClickDeleteRow}
                        text={loc(deleteItem)}
                    />
                    <CommandButton
                        aria-hidden={true}
                        className={styles.triageActionButton}
                        iconProps={{ iconName: ControlIcons.FabricMovetoFolder }}
                        onClick={onClickMoveRow}
                        text={format(loc(moveToDefaultFolder), getFolderName(destinationFolderId))}
                    />
                </ul>
            )}
        </div>
    );
});

function deleteRow(tableView: TableView) {
    lazyTriageActions.lazyDeleteMailListRows.importAndExecute(
        [...tableView.selectedRowKeys.keys()] /* rowKeys for conversations */,
        tableView.id,
        false /*isExplicitSoftDelete*/,
        'ReadingPane'
    );
}

function moveRow(tableView: TableView, destinationFolderId: string) {
    lazyTriageActions.lazyMoveMailListRows.importAndExecute(
        [...tableView.selectedRowKeys.keys()],
        destinationFolderId,
        tableView.id,
        'ReadingPane'
    );
}
