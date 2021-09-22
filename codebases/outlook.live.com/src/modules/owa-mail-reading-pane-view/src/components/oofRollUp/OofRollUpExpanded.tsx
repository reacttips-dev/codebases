import MailMessageBody from '../MailMessageBody';
import { observer } from 'mobx-react-lite';
import { ItemActionsMenu } from 'owa-mail-reading-pane-item-actions-view';
import type { ClientItem } from 'owa-mail-store';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import { SenderImageWrapper, SenderPersona } from 'owa-mail-sender-persona-view';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type Message from 'owa-service/lib/contract/Message';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import * as React from 'react';
import { calculatePersonaSize } from 'owa-persona/lib/utils/calculatePersonaSize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './OofRollUp.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

const OofItemActionKeys: string[] = [
    '-',
    'Reply',
    'Forward',
    'Delete',
    'Print',
    'Popout',
    'ToggleDarkMode',
];

export interface OofRollUpExpandedProps {
    conversationId: string;
    oofItems: ClientItem[];
    instrumentationContext: InstrumentationContext;
}
export default observer(function OofRollUpExpanded(props: OofRollUpExpandedProps) {
    const renderOofRecipientCard = (oofItem: ClientItem): JSX.Element => {
        const message: Message = oofItem as Message;
        const nodeId = message.InternetMessageId;
        const oofItemPartViewState = getConversationReadingPaneViewState(
            props.conversationId
        ).itemPartsMap.get(nodeId);
        const undoDarkMode = oofItemPartViewState.undoDarkMode;
        const sender: SingleRecipientType = message.From ? message.From : message.Sender;
        const messageSafetyLevel = message.MessageSafety
            ? message.MessageSafety.MessageSafetyLevel
            : MessageSafetyLevel.None;
        const className = classNames(styles.oofRollUpExpandedView, { undoDarkMode: undoDarkMode });
        return (
            <div key={oofItem.ItemId.Id} className={className}>
                <SenderImageWrapper
                    message={message}
                    displaySelf={false}
                    style={styles.senderImage}
                    size={calculatePersonaSize()}
                />
                <div
                    className={classNames(
                        isFeatureEnabled('mon-densities') && getDensityModeString(),
                        styles.senderActionContainer
                    )}>
                    <div className={styles.senderContainer}>
                        <SenderPersona
                            className={styles.senderPersonaText}
                            sender={sender}
                            isRead={message.IsRead}
                            treatAsDraft={false}
                            displaySelf={false}
                            hideSMTP={true}
                            messageSafetyLevel={messageSafetyLevel}
                        />
                    </div>
                    <div className={styles.actionContainer}>
                        <ItemActionsMenu
                            viewState={oofItemPartViewState}
                            item={oofItem}
                            shouldIncludeFullInfo={false}
                            instrumentationContext={props.instrumentationContext}
                            hideSurfaceButton={true}
                            customizedSubsetActionKeys={OofItemActionKeys}
                            actionSource={'RPOofRollUp'}
                        />
                    </div>
                </div>
                <MailMessageBody
                    className={classNames(
                        isFeatureEnabled('mon-densities') && getDensityModeString(),
                        styles.messageBody
                    )}
                    messageBody={message.UniqueBody.Value}
                    item={oofItem}
                    copyAllowed={true}
                    printAllowed={true}
                    isLoading={false}
                    undoDarkMode={undoDarkMode}
                    actionableMessageCardInItemViewState={null}
                />
            </div>
        );
    };
    const { oofItems } = props;
    return <>{oofItems.map(oofItem => renderOofRecipientCard(oofItem))}</>;
});
