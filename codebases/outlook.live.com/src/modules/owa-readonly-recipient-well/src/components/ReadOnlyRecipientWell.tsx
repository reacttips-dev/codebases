import { observer } from 'mobx-react-lite';
import {
    toRecipientWellLabel,
    ccRecipientWellLabel,
    bccRecipientWellLabel,
} from './ReadOnlyRecipientWell.locstring.json';
import loc from 'owa-localize';
import ReadOnlyRecipient from './ReadOnlyRecipient';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';

import styles from './ReadOnlyRecipientWell.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface ReadOnlyRecipientWellProps {
    recipients: ReadOnlyRecipientViewState[];
    recipientType?: RecipientType;
    trailingComponent?: JSX.Element;
    includeEmailAddressByDefault?: boolean;
    wellLabelText?: string;
    renderSelf?: boolean;
    disableHover?: boolean;
    className?: string;
    allowRenderEmptyWell?: boolean;
    showPlainText?: boolean;
    recipientClassName?: string;
    recipientPersonaRef?: (ref: HTMLElement) => void;
}

export default observer(
    function ReadOnlyRecipientWell(
        props: ReadOnlyRecipientWellProps,
        recipientsParentRef: React.Ref<HTMLUListElement>
    ) {
        let {
            recipients,
            allowRenderEmptyWell,
            wellLabelText,
            recipientType,
            className,
            renderSelf,
            disableHover,
            trailingComponent,
            showPlainText,
            recipientPersonaRef,
        } = props;
        if (recipients && (allowRenderEmptyWell || recipients.length > 0)) {
            wellLabelText = wellLabelText || getWellLabelTextForRecipientType(recipientType);
            const wellLabelClassNames = classNames(
                styles.label,
                isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') &&
                    styles.wellLabelTextNormalWeight
            );
            const wellLabel =
                recipientType != RecipientType.None ? (
                    <label className={wellLabelClassNames}>{wellLabelText}</label>
                ) : null;
            return (
                <div className={className} key="readOnlyRecipientWellDiv">
                    {wellLabel}
                    <ul className={styles.recipientsContainer} ref={recipientsParentRef}>
                        {recipients.map((recipient, index) => {
                            const isSelf =
                                index == 0 &&
                                recipient.email.EmailAddress ==
                                    getUserConfiguration().SessionSettings.UserEmailAddress &&
                                renderSelf;
                            const isLast = index + 1 == recipients.length;
                            // Using an index as part of the key is sub-optimal, but the recipient array
                            // can contain duplicate data that has no other means of differentiating.
                            return (
                                <ReadOnlyRecipient
                                    recipientContentClassName={props.recipientClassName}
                                    key={`${recipient.email.EmailAddress}_${index}`}
                                    viewState={recipient}
                                    name={recipient.email.Name}
                                    emailAddress={recipient.email.EmailAddress}
                                    renderSelf={isSelf}
                                    isLast={isLast}
                                    disableHover={disableHover}
                                    mailBoxType={recipient.email.MailboxType}
                                    clientScenario="ReadOnlyRecipient"
                                    showPlainText={showPlainText}
                                    recipientPersonaRef={recipientPersonaRef}
                                />
                            );
                        })}
                    </ul>
                    {trailingComponent && (
                        <div
                            className={styles.wellTrailingComponent}
                            key="wellTrailingComponentDiv">
                            {trailingComponent}
                        </div>
                    )}
                </div>
            );
        } else {
            return null;
        }
    },
    { forwardRef: true }
);

function getWellLabelTextForRecipientType(recipientType: RecipientType) {
    switch (recipientType) {
        case RecipientType.To:
            return loc(toRecipientWellLabel);
        case RecipientType.Cc:
            return loc(ccRecipientWellLabel);
        case RecipientType.Bcc:
            return loc(bccRecipientWellLabel);
        default:
            return '';
    }
}
