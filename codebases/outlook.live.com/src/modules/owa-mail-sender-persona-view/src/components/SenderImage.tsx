import { observer } from 'mobx-react-lite';
import type { PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { isFeatureEnabled } from 'owa-feature-flags';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyTryRegisterForPresenceUpdates } from 'owa-skype-for-business';
import getPresenceFromStore from 'owa-skype-for-business/lib/presenceManager/getPresenceFromStore';
import * as React from 'react';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';
import { calculatePersonaSize } from 'owa-persona/lib/utils/calculatePersonaSize';

export interface SenderImageProps {
    sender: SingleRecipientType;
    displaySelf: boolean;
    style?: string;
    isUnauthenticatedSender?: boolean;
    size?: PersonaSize;
    showPresence?: boolean;
    displayPersonaHighlightRing?: boolean;
    disablePersonaCardBehavior?: boolean;
}

const SenderImage = (props: SenderImageProps) => {
    const { sender, displaySelf, showPresence, style } = props;
    let name = sender?.Mailbox ? sender.Mailbox.Name : null;
    const mailBoxType = sender?.Mailbox ? sender.Mailbox.MailboxType : null;
    let emailAddress = sender?.Mailbox ? sender.Mailbox.EmailAddress : null;
    let personaType = undefined;
    if (displaySelf) {
        const userConfiguration = getUserConfiguration();
        name = userConfiguration.SessionSettings.UserDisplayName;
        emailAddress = userConfiguration.SessionSettings.UserEmailAddress;
        personaType = 'User';
    }

    React.useEffect(() => {
        if (isFeatureEnabled('fwk-skypeBusinessV2') && showPresence) {
            lazyTryRegisterForPresenceUpdates.import().then(tryRegisterForPresenceUpdates => {
                tryRegisterForPresenceUpdates(emailAddress);
            });
        }
    }, []);

    const presence = showPresence ? getPresenceFromStore(emailAddress) : undefined;
    return props.disablePersonaCardBehavior ? (
        <div className={style}>
            <PersonaControl
                name={name}
                emailAddress={emailAddress}
                size={props.size || calculatePersonaSize()}
                showUnknownPersonaCoin={props.isUnauthenticatedSender}
                presence={presence}
                mailboxType={mailBoxType}
            />
        </div>
    ) : (
        <SenderImageDiv
            name={name}
            emailAddress={emailAddress}
            style={style}
            personaType={personaType}
            mailBoxType={mailBoxType}
            isUnauthenticatedSender={props.isUnauthenticatedSender}
            clientScenario="SenderImageDiv"
            size={props.size}
            presence={presence}
            displayPersonaHighlightRing={props.displayPersonaHighlightRing}
        />
    );
};
export default SenderImage;

export interface SenderImageDivProps extends PersonaCardBehaviorProps {
    style?: string;
    presence?: PersonaPresence;
}

const SenderImageDiv = observer(function SenderImageDiv(props: SenderImageDivProps) {
    const PersonaCardBehavior = useLivePersonaCard(props);
    return (
        <div className={props.style}>
            <PersonaCardBehavior>
                <PersonaControl
                    name={props.name}
                    emailAddress={props.emailAddress}
                    size={props.size || calculatePersonaSize()}
                    showUnknownPersonaCoin={props.isUnauthenticatedSender}
                    presence={props.presence}
                    mailboxType={props.mailBoxType}
                />
            </PersonaCardBehavior>
        </div>
    );
});
