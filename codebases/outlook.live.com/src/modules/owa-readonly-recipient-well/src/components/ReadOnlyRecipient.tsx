import { recipientSelf } from 'owa-locstrings/lib/strings/recipientself.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';

import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';
import { observer as observerLite } from 'mobx-react-lite';

import styles from './ReadOnlyRecipient.scss';
import classNames from 'classnames';

export interface ReadOnlyRecipientProps extends PersonaCardBehaviorProps {
    viewState: ReadOnlyRecipientViewState;
    renderSelf?: boolean;
    isLast?: boolean;
    onlyShowEmail?: boolean;
    showPlainText?: boolean;
    // We have to call this recipientContentClassName and not className because
    // otherwise it conflicts with the lpc className prop, and is applied to both
    // the lpc container and the component itself after copying props.
    recipientContentClassName?: string;
    recipientPersonaRef?: (ref: HTMLElement) => void;
}

interface ReadOnlyRecipientWithPeronaCardBehaviorProps extends ReadOnlyRecipientProps {
    recipientContent: string;
    recipientContentClassName: string;
}

const ReadOnlyRecipient = observerLite(function ReadOnlyRecipient(props: ReadOnlyRecipientProps) {
    let recipientContent;
    if (props.onlyShowEmail) {
        recipientContent = props.viewState.email.EmailAddress;
    } else {
        recipientContent = props.renderSelf
            ? loc(recipientSelf)
            : props.viewState.email.Name || props.viewState.email.EmailAddress;
        if (props.viewState.showFullEmail && props.viewState.email.EmailAddress) {
            recipientContent += ' <' + props.viewState.email.EmailAddress + '>';
        }
        if (!props.isLast) {
            recipientContent += ';';
        }
    }

    recipientContent = ' ' + recipientContent;

    const recipientContentClassName = classNames(
        styles.recipientContent,
        props.recipientContentClassName,
        props.viewState.isGroupOrDl ? styles.groupOrDl : null
    );

    return props.showPlainText ? (
        <li className={recipientContentClassName}>{recipientContent}</li>
    ) : (
        <ReadOnlyRecipientWithPeronaCardBehavior
            {...props}
            recipientContent={recipientContent}
            recipientContentClassName={recipientContentClassName}
        />
    );
});
export default ReadOnlyRecipient;

const ReadOnlyRecipientWithPeronaCardBehavior = observerLite(
    function ReadOnlyRecipientWithPeronaCardBehavior(
        props: ReadOnlyRecipientWithPeronaCardBehaviorProps
    ) {
        const PersonaCardBehavior = useLivePersonaCard({ ...props, mountWithoutWrapperSpan: true });
        return (
            <li
                className={classNames(props.recipientContentClassName, props.className)}
                ref={props.recipientPersonaRef}
                aria-label={props.ariaLabel}>
                <PersonaCardBehavior>
                    <div className={styles.recipientContent}>{props.recipientContent}</div>
                </PersonaCardBehavior>
            </li>
        );
    }
);
