import PrintRecipientWell from './PrintRecipientWell';
import SentReceivedSavedTime from './SentReceivedSavedTime';
import { observer } from 'mobx-react-lite';
import { AttachmentWellPrintView } from 'owa-attachment-well-view';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import { SenderPersonaWrapper } from 'owa-mail-sender-persona-view';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import * as React from 'react';

import styles from './PrintPanel.scss';

export interface PrintItemHeaderProps {
    item: Item;
    viewState: ItemReadingPaneViewState;
}

const PrintItemHeader = observer(function PrintItemHeader(props: PrintItemHeaderProps) {
    const message: Message = props.item as Message;
    return (
        <>
            <SenderPersonaWrapper
                message={message}
                treatAsDraft={false}
                isNodePending={false}
                showPlainText={true}
                showSMTPoverride={props.viewState.isPrint}
            />
            <SentReceivedSavedTime
                className={styles.printSentReceivedTimestamp}
                time={message.DateTimeReceived}
            />
            <PrintRecipientWell
                toRecipients={message.ToRecipients}
                ccRecipients={message.CcRecipients}
                bccRecipients={message.BccRecipients}
            />
            {props.viewState.itemViewState.attachmentWell && (
                <AttachmentWellPrintView
                    attachmentWellViewState={props.viewState.itemViewState.attachmentWell}
                />
            )}
        </>
    );
});
export default PrintItemHeader;
