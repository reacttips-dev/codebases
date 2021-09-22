import shouldShowMeetingFeed from '../utils/shouldShowMeetingFeed';
import { observer } from 'mobx-react-lite';
import { SenderPersonaWrapper } from 'owa-mail-sender-persona-view';
import type { ClientMessage } from 'owa-mail-store';
import { SenderSummary } from 'owa-meeting-message';
import * as React from 'react';

import styles from './ConversationReadingPane.scss';

export interface CollapsedSenderProps {
    message: ClientMessage;
    treatAsDraft: boolean;
    isNodePending: boolean;
}

const CollapsedSender = observer(function CollapsedSender(props: CollapsedSenderProps) {
    const { message, treatAsDraft, isNodePending } = props;

    if (shouldShowMeetingFeed(message)) {
        return (
            <SenderSummary
                message={message}
                senderPersona={
                    <SenderPersonaWrapper
                        message={message}
                        treatAsDraft={treatAsDraft}
                        isNodePending={isNodePending}
                        hideSMTP={true}
                        displayYouForSelf={true}
                        senderPersonaClassName={styles.senderSummaryStyle}
                        className={styles.senderSummaryStyle}
                    />
                }
            />
        );
    } else {
        return (
            <SenderPersonaWrapper
                message={message}
                treatAsDraft={treatAsDraft}
                isNodePending={isNodePending}
                hideSMTP={true}
                showPlainText={true}
            />
        );
    }
});

export default CollapsedSender;
