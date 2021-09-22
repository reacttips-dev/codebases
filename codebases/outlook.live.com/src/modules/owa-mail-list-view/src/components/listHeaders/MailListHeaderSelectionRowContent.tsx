import { observer } from 'mobx-react-lite';
import { clearSelection } from './MailListHeaderSelectionRowContent.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { Link } from '@fluentui/react/lib/Link';
import { resetSelection } from 'owa-mail-actions/lib/mailListSelectionActions';
import { getItemsOrConversationsSelectedText } from 'owa-mail-list-store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { isSingleLineListView } from 'owa-mail-layout';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';

import styles from './MailListHeaderSecondRow.scss';
import headerStyles from '../MailListHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListHeaderSelectionRowContentProps {
    numChecked: number;
    containerCssClass: string;
    tableViewId: string;
    folderId: string;
}

export default observer(function MailListHeaderSelectionRowContent(
    props: MailListHeaderSelectionRowContentProps
) {
    const resetSelection_0 = () => {
        resetSelection(
            listViewStore.tableViews.get(props.tableViewId),
            MailListItemSelectionSource.SingleLineClearSelection
        );
        lazyResetFocus.importAndExecute();
    };
    const isSingleLineView = isSingleLineListView();
    const isSenderImageOff = getIsBitSet(ListViewBitFlagsMasks.HideSenderImage);
    const isJunkMail = folderNameToId('junkemail') === props.folderId;
    const isInboxWithPivots = isFocusedInboxEnabled() && folderNameToId('inbox') === props.folderId;
    return (
        <div
            className={classNames(
                headerStyles.mailListSecondRowCustomContainer,
                isInboxWithPivots && headerStyles.pivotOffset
            )}
            role="heading"
            aria-level={2}>
            <span
                className={
                    isSingleLineView && isSenderImageOff && !isJunkMail
                        ? styles.customSelectionContainerNoSenderImage
                        : styles.customSelectionContainer
                }>
                {getItemsOrConversationsSelectedText(props.tableViewId)}
            </span>
            <Link onClick={resetSelection_0}>{loc(clearSelection)} </Link>
        </div>
    );
});
