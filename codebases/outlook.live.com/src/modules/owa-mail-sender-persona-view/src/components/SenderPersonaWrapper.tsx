import { viaTextFormatString } from './SenderPersonaWrapper.locstring.json';
import { onBehalfOfTextFormatString } from 'owa-locstrings/lib/strings/onbehalfoftextformatstring.locstring.json';
import loc, { formatToArray } from 'owa-localize';
import SenderPersona from './SenderPersona';
import getIsSentOnBehalfOf from '../utils/getIsSentOnBehalfOf';
import { observer } from 'mobx-react-lite';
import type Message from 'owa-service/lib/contract/Message';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';
import isMessageUnauthenticated from '../utils/isMessageUnauthenticated';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './SenderPersona.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface SenderPersonaWrapperProps {
    message: Message;
    treatAsDraft: boolean;
    isNodePending: boolean;
    hideSMTP?: boolean;
    senderPersonaClassName?: string;
    showPlainText?: boolean;
    displaySelf?: boolean;
    displayYouForSelf?: boolean;
    useIsReadStyle?: boolean;
    className?: string;
    showSMTPoverride?: boolean;
}

const SenderPersonaWrapper = observer(function SenderPersonaWrapper(
    props: SenderPersonaWrapperProps
) {
    const {
        message,
        treatAsDraft,
        isNodePending,
        hideSMTP,
        senderPersonaClassName,
        displaySelf,
        displayYouForSelf,
        useIsReadStyle,
        className,
        showSMTPoverride,
    } = props;
    const isSentOnBehalfOf = getIsSentOnBehalfOf(message);
    const messageSafetyLevel = message.MessageSafety
        ? message.MessageSafety.MessageSafetyLevel
        : MessageSafetyLevel.None;
    const treatAsRead = useIsReadStyle || message.IsRead;
    let personaToDisplay: JSX.Element | (string | JSX.Element)[];

    const shouldDisplayUnauthenticatedSender = isMessageUnauthenticated(message);

    const fromPersona = (
        <SenderPersona
            sender={message.From ? message.From : message.Sender}
            isRead={treatAsRead}
            treatAsDraft={treatAsDraft}
            displaySelf={displaySelf || isNodePending}
            hideSMTP={hideSMTP}
            messageSafetyLevel={messageSafetyLevel}
            isUnauthenticatedSender={shouldDisplayUnauthenticatedSender}
            className={senderPersonaClassName}
            showPlainText={props.showPlainText}
            displayYouForSelf={displayYouForSelf && !isSentOnBehalfOf && !message.ViaInFrom}
            showSMTPoverride={showSMTPoverride}
        />
    );

    if (isSentOnBehalfOf) {
        personaToDisplay = formatToArray(
            loc(onBehalfOfTextFormatString),
            <SenderPersona
                sender={message.Sender}
                isRead={treatAsRead}
                treatAsDraft={treatAsDraft}
                displaySelf={false}
                hideSMTP={hideSMTP}
                messageSafetyLevel={messageSafetyLevel}
                isUnauthenticatedSender={shouldDisplayUnauthenticatedSender}
                className={senderPersonaClassName}
                showPlainText={props.showPlainText}
                showSMTPoverride={showSMTPoverride}
            />,
            fromPersona
        );
    } else if (message.ViaInFrom) {
        personaToDisplay = formatToArray(
            loc(viaTextFormatString),
            fromPersona,
            <span>{message.ViaInFrom}</span>
        );
    } else {
        personaToDisplay = fromPersona;
    }

    return (
        <span
            className={classNames(
                styles.senderLineText,
                isFeatureEnabled('mon-densities') && getDensityModeString(),
                isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') && styles.largerSenderName,
                !treatAsRead && styles.isUnread,
                className
            )}>
            {personaToDisplay}
        </span>
    );
});
export default SenderPersonaWrapper;
