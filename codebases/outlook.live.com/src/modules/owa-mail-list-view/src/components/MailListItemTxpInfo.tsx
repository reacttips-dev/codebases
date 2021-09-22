import { observer } from 'mobx-react-lite';
import { TxpListViewButton } from 'owa-listview-txp';
import * as React from 'react';
import { getStore as getListViewStore, isConversationView } from 'owa-mail-list-store';

import styles from './MailListItemMeetingInfo.scss';

export interface MailListItemTxpInfoProps {
    latestItemId: string;
    tableViewId: string;
    isSingleLineView: boolean;
}

export default observer(function MailListItemTxpInfo(props: MailListItemTxpInfoProps) {
    const { latestItemId, tableViewId, isSingleLineView } = props;
    const txpActionButtonDataForItem = getListViewStore().txpActionButtonData.get(latestItemId);

    // The item is not on store yet.
    if (!txpActionButtonDataForItem) {
        return null;
    }

    return (
        // Intentionally using the same style as RSVP button, as we want to keep the style consistent for now
        // for all the buttons.
        <div
            className={isSingleLineView ? styles.meetingInfoSingleLine : styles.meetingInfo3Column}>
            <div
                className={
                    isSingleLineView ? styles.meetingMessageButtonSLV : styles.meetingMessageButton
                }>
                <TxpListViewButton
                    txpActionButtonDataForItem={txpActionButtonDataForItem}
                    entrySource={isConversationView(getListViewStore().tableViews.get(tableViewId))}
                />
            </div>
        </div>
    );
});
