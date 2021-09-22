import { fromOnBehalfOfTextFormatString } from './MeetingForwardSenderPersona.locstring.json';
import { fromTextFormatString } from 'owa-locstrings/lib/strings/fromTextFormatString.locstring.json';
import loc, { formatToArray } from 'owa-localize';
import SenderPersona from './SenderPersona';
import { observer } from 'mobx-react-lite';
import type Message from 'owa-service/lib/contract/Message';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';

import * as React from 'react';

export interface MeetingForwardSenderPersonaProps {
    message: Message;
    senderPersonaClassName?: string;
}

const MeetingForwardSenderPersona = observer(function MeetingForwardSenderPersona(
    props: MeetingForwardSenderPersonaProps
) {
    const { message, senderPersonaClassName } = props;
    const messageSafetyLevel = message.MessageSafety
        ? message.MessageSafety.MessageSafetyLevel
        : MessageSafetyLevel.None;
    const isSentOnBehalfOf =
        message?.From?.Mailbox?.EmailAddress?.toLowerCase() !=
        message?.Sender?.Mailbox?.EmailAddress?.toLowerCase();
    let personaToDisplay: JSX.Element | (string | JSX.Element)[];

    const fromPersona = (
        <SenderPersona
            sender={message.From}
            isRead={true}
            treatAsDraft={false}
            displaySelf={false}
            hideSMTP={false}
            messageSafetyLevel={messageSafetyLevel}
            isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
            className={senderPersonaClassName}
        />
    );

    if (isSentOnBehalfOf) {
        const senderPersona = (
            <SenderPersona
                sender={null}
                isRead={true}
                treatAsDraft={false}
                displaySelf={true}
                hideSMTP={false}
                messageSafetyLevel={messageSafetyLevel}
                isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
                className={senderPersonaClassName}
            />
        );

        personaToDisplay = formatToArray(
            loc(fromOnBehalfOfTextFormatString),
            senderPersona,
            fromPersona
        );
    } else {
        personaToDisplay = formatToArray(loc(fromTextFormatString), fromPersona);
    }

    return <span>{personaToDisplay}</span>;
});
export default MeetingForwardSenderPersona;
