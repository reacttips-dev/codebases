import { observer } from 'mobx-react-lite';
import * as React from 'react';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import { PersonaSize } from '@fluentui/react/lib/Persona';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { getUserConfiguration } from 'owa-session-store';
import removeNewMailNotification from '../../mutators/removeNewMailNotification';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import onNewMailNotificationClicked from '../../actions/onNewMailNotificationClicked';
import { CSSTransition } from 'react-transition-group';
import { AnimationClassNames } from '@fluentui/style-utilities';

import styles from './NewMailNotification.scss';

// This should be kept in sync with the animation-duration (in ms) of the Fabric animations being used.
const ANIMATION_DURATION = 167;

export interface NewMailNotificationProps {
    notification: NewMailNotificationPayload;
    removeNotification?: (itemId: string) => void;
    openNotification?: (notification: NewMailNotificationPayload) => void;
}

export default observer(function NewMailNotification(props: NewMailNotificationProps) {
    props = {
        removeNotification: removeNewMailNotification,
        openNotification: onNewMailNotificationClicked,
        ...props,
    };
    const onClose = (evt: React.MouseEvent<any>) => {
        const { removeNotification } = props;
        evt.stopPropagation();
        removeNotification?.(props.notification.ItemId);
    };
    const onNavigate = () => {
        const { openNotification } = props;
        openNotification?.(props.notification);
    };
    /**
     * The parent <TransitionGroup> passes several properties that the CSSTransition needs. However, I don't want to expose internal workings to the outside in the props,
     *  so I use this construct to strip all our own properties out and pass the rest to the transition, to prevent React warnings.
     **/
    const { notification, removeNotification, openNotification, ...transitionProps } = props;
    const { Sender, SenderSmtpEmailAddress, Subject, PreviewText } = notification;
    const topTwoLines = [Sender, Subject];
    if (!getUserConfiguration().UserOptions.ShowSenderOnTopInListView) {
        topTwoLines.reverse();
    }
    return (
        <CSSTransition
            {...transitionProps}
            timeout={ANIMATION_DURATION}
            classNames={{
                enter: AnimationClassNames.slideDownIn20,
                exit: AnimationClassNames.slideUpOut20,
            }}>
            <div className={styles.container}>
                <ActionButton
                    className={styles.notificationButton}
                    styles={{
                        flexContainer: styles.notificationButtonFlexContainer,
                    }}
                    onClick={onNavigate}>
                    <PersonaControl
                        emailAddress={SenderSmtpEmailAddress}
                        name={Sender}
                        size={PersonaSize.size32}
                        showPersonaDetails={false}
                        className={styles.persona}
                    />
                    <div className={styles.data}>
                        <div className={styles.firstLine}>{topTwoLines[0]}</div>
                        <div className={styles.secondLine}>{topTwoLines[1]}</div>
                        <div className={styles.previewText}>{PreviewText}</div>
                    </div>
                </ActionButton>
                <IconButton
                    className={styles.dismissButton}
                    iconProps={{
                        iconName: ControlIcons.Cancel,
                        styles: {
                            root: styles.dismissButtonIcon,
                        },
                    }}
                    onClick={onClose}
                />
            </div>
        </CSSTransition>
    );
});
