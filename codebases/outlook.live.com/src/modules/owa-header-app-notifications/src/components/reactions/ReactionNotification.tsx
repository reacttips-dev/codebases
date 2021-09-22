import { observer } from 'mobx-react-lite';
import { reactorsNotificationText } from './ReactionNotification.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';
import onReactionNotificationClicked from '../../actions/onReactionNotificationClicked';
import removeReactionNotification from '../../mutators/removeReactionNotification';

import { AnimationClassNames } from '@fluentui/style-utilities';
import { ControlIcons } from 'owa-control-icons';
import { CSSTransition } from 'react-transition-group';

import { IconButton } from '@fluentui/react/lib/Button';
import type { ReactionNotificationData } from '../../store/schema/ReactionNotificationData';

import { getReactionResourceData, ReactionsMap } from 'owa-mail-reactions-data';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import { PersonaSize } from '@fluentui/react/lib/Persona';

import styles from './ReactionNotification.scss';

// This should be kept in sync with the animation-duration (in ms) of the Fabric animations being used.
const ANIMATION_DURATION = 167;

export interface ReactionNotificationProps {
    notification: ReactionNotificationData;
    removeNotification?: (notification: ReactionNotificationData) => void;
    openNotification?: (notification: ReactionNotificationData) => void;
}

export default observer(function ReactionNotification(props: ReactionNotificationProps) {
    props = {
        removeNotification: removeReactionNotification,
        openNotification: onReactionNotificationClicked,
        ...props,
    };
    const onClose = (evt: React.MouseEvent<any>) => {
        const { removeNotification } = props;
        evt.stopPropagation();
        removeNotification?.(props.notification);
    };
    const onNavigate = () => {
        const { openNotification } = props;
        openNotification?.(props.notification);
    };
    /**
     * The parent <TransitionGroup> passes several properties that the CSSTransition needs. However, I don't want to expose internal workings to the outside in the props,
     *  so I use this construct to strip all our own properties out and pass the rest to the transition, to prevent React warnings.
     **/
    const { notification, removeNotification, ...transitionProps } = props;
    const resourceData = getReactionResourceData(notification.reactionType, false /* isAnimated */);
    // This might be refactored to match NewMailToast. VSO:31148 tracks doing that if they endup being really similar
    return (
        <CSSTransition
            {...transitionProps}
            timeout={ANIMATION_DURATION}
            classNames={{
                enter: AnimationClassNames.slideDownIn20,
                exit: AnimationClassNames.slideUpOut20,
            }}>
            <div className={styles.container} onClick={onNavigate}>
                <div className={styles.notificationContainer}>
                    <div className={styles.centerContainer}>
                        <PersonaControl
                            name={notification.actor.EmailAddress.Name}
                            emailAddress={notification.actor.EmailAddress.EmailAddress}
                            size={PersonaSize.size32}
                            showPersonaDetails={false}
                            className={styles.persona}
                        />
                        <div className={styles.data}>
                            <div className={styles.firstLine}>
                                {resourceData && <img className={styles.icon} src={resourceData} />}
                                {!resourceData && (
                                    <span className={styles.icon}>
                                        {ReactionsMap[notification.reactionType].icon}
                                    </span>
                                )}
                                {format(
                                    loc(reactorsNotificationText),
                                    notification.actor.EmailAddress.Name
                                )}
                            </div>
                            <div className={styles.secondLine}>{notification.subject}</div>
                            <div className={styles.previewText}>{notification.preview}</div>
                        </div>
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
                </div>
            </div>
        </CSSTransition>
    );
});
