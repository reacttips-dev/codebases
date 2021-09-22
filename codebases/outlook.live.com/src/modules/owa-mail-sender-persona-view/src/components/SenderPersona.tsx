import { observer } from 'mobx-react-lite';
import { draftSenderPersonaPlaceholder } from 'owa-locstrings/lib/strings/draftsenderpersonaplaceholder.locstring.json';
import loc from 'owa-localize';
import getSenderDisplayName from '../utils/getSenderDisplayName';
import { highlightTermsInHtmlElement } from 'owa-mail-highlight-terms';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import * as React from 'react';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';
import { useCustomTimeout } from 'owa-react-hooks/lib/useCustomTimeout';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './SenderPersona.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface SenderPersonaProps {
    sender: SingleRecipientType;
    isRead: boolean;
    treatAsDraft: boolean;
    displaySelf: boolean;
    hideSMTP?: boolean;
    messageSafetyLevel: MessageSafetyLevel;
    isUnauthenticatedSender?: boolean;
    className?: string;
    showPlainText?: boolean;
    displayYouForSelf?: boolean;
    showSMTPoverride?: boolean;
}

export interface SenderPersonaState {
    showPlainText: boolean;
}

interface SenderPersonaDivWithPersonaCardBehaviorProps extends PersonaCardBehaviorProps {
    displayNameComponent: JSX.Element;
}

const timeoutForShowPlainText = 1;

export default observer(function SenderPersona(props: SenderPersonaProps) {
    const [setShowPlainTextTimer] = useCustomTimeout();

    React.useEffect(() => {
        // If this is for draft, no need to re-render.
        if (!props.treatAsDraft) {
            setShowPlainTextTimer(() => {
                setShowPlainText(false);
            }, timeoutForShowPlainText);
        }
    }, []);
    const [showPlainText, setShowPlainText] = React.useState<boolean>(true);
    const userConfiguration = getUserConfiguration();
    const {
        sender,
        isRead,
        displaySelf,
        treatAsDraft,
        hideSMTP,
        className,
        messageSafetyLevel,
        isUnauthenticatedSender,
        displayYouForSelf,
        showSMTPoverride,
    } = props;
    let senderName = '';
    let emailAddress = null;
    let mailboxType = '';
    if (sender?.Mailbox) {
        senderName = sender.Mailbox.Name;
        emailAddress = sender.Mailbox.EmailAddress;
        mailboxType = sender.Mailbox.MailboxType;
    }
    if (displaySelf) {
        // If displaying self, override senderName and emailAddress using userConfiguration data
        senderName = userConfiguration.SessionSettings.UserDisplayName;
        emailAddress = userConfiguration.SessionSettings.UserEmailAddress;
    }
    if (treatAsDraft) {
        return (
            <div className={classNames(className, styles.senderPersona, styles.isDraft)}>
                {loc(draftSenderPersonaPlaceholder)}
            </div>
        );
    } else {
        // Always show SMTP in print preview
        const displayName = getSenderDisplayName(
            senderName,
            emailAddress,
            mailboxType,
            hideSMTP,
            messageSafetyLevel,
            displayYouForSelf,
            showSMTPoverride
        );
        const displayNameComponent = renderDisplayName(
            emailAddress,
            displayName,
            isMessageLevelUntrusted(messageSafetyLevel)
        );
        const senderPersonaClassName = classNames(
            className,
            styles.senderPersona,
            isFeatureEnabled('mon-densities') && getDensityModeString(),
            {
                isUnread: !isRead,
                isUnstackedReadingPane: shouldShowUnstackedReadingPane(),
                largerSenderName: isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates'),
            }
        );
        return showPlainText || props.showPlainText ? (
            <div className={className}>{displayNameComponent}</div>
        ) : (
            <SenderPersonaDivWithPersonaCardBehavior
                emailAddress={emailAddress}
                name={senderName}
                isUnauthenticatedSender={isUnauthenticatedSender}
                displayNameComponent={displayNameComponent}
                className={senderPersonaClassName}
                clientScenario="SenderPersonaDiv"
            />
        );
    }
});

function SenderPersonaDivWithPersonaCardBehavior(
    props: SenderPersonaDivWithPersonaCardBehaviorProps
) {
    const PersonaCardBehavior = useLivePersonaCard(props);
    const { displayNameComponent, className } = props;
    return (
        <PersonaCardBehavior>
            <div
                ref={ref => {
                    highlightTermsInHtmlElement(ref);
                }}
                className={className}>
                {displayNameComponent}
            </div>
        </PersonaCardBehavior>
    );
}

function renderDisplayName(
    emailAddress: string,
    displayName: string[],
    isUntrusted: boolean
): JSX.Element {
    return (
        <span>
            {displayName[0]}
            {displayName.length > 1 && displayName[1]}
        </span>
    );
}

function isMessageLevelUntrusted(messageSafetyLevel: MessageSafetyLevel): boolean {
    return (
        messageSafetyLevel === MessageSafetyLevel.Suspicious ||
        messageSafetyLevel === MessageSafetyLevel.Unknown
    );
}
