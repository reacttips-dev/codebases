import { observer } from 'mobx-react-lite';
import {
    likersNotificationOneLikerText,
    likersNotificationTwoLikersText,
    likersNotificationMoreThanTwoLikersText,
} from './LikeNotification.locstring.json';
import loc, { format, formatToArray } from 'owa-localize';
import * as React from 'react';
import onLikeNotificationClicked from '../../actions/onLikeNotificationClicked';
import removeLikeNotification from '../../mutators/removeLikeNotification';

import { AnimationClassNames } from '@fluentui/style-utilities';
import { ControlIcons } from 'owa-control-icons';
import { CSSTransition } from 'react-transition-group';

import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import type { LikeNotificationData } from '../../store/schema/LikeNotificationData';

import styles from './LikeNotification.scss';

// This should be kept in sync with the animation-duration (in ms) of the Fabric animations being used.
const ANIMATION_DURATION = 167;

export interface LikeNotificationProps {
    notification: LikeNotificationData;
    removeNotification?: (notification: LikeNotificationData) => void;
    openNotification?: (notification: LikeNotificationData) => void;
}

interface LikeNotificationInfo {
    notificationContent: any[];
    notificationTooltip: string;
}

export default observer(function LikeNotification(props: LikeNotificationProps) {
    props = {
        removeNotification: removeLikeNotification,
        openNotification: onLikeNotificationClicked,
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
    const notificationInfo = buildLikeNotificationInfo(notification);
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
                        <Icon className={styles.icon} iconName={ControlIcons.Like} />
                        <div className={styles.data}>
                            <div className={styles.firstLine}>
                                {notificationInfo.notificationContent}
                            </div>
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

function buildLikeNotificationInfo(notificationData: LikeNotificationData): LikeNotificationInfo {
    switch (notificationData.actors.length) {
        case 0:
            // should not happen because if we got here we should have at least one valid liker name
            throw new Error('There should be at least one liker on a notification');
        case 1:
            const boldName = (
                <span className={styles.actorsName}>
                    {notificationData.actors[0].EmailAddress.Name}
                </span>
            );
            return {
                notificationTooltip: format(
                    loc(likersNotificationOneLikerText),
                    notificationData.actors[0].EmailAddress.Name
                )
                    .concat(' ')
                    .concat(notificationData.subject),
                notificationContent: formatToArray(loc(likersNotificationOneLikerText), boldName)
                    .concat(' ')
                    .concat(notificationData.subject),
            };
        case 2:
            const boldName1 = (
                <span className={styles.actorsName}>
                    {notificationData.actors[0].EmailAddress.Name}
                </span>
            );
            const boldName2 = (
                <span className={styles.actorsName}>
                    {notificationData.actors[1].EmailAddress.Name}
                </span>
            );
            return {
                notificationTooltip: format(
                    loc(likersNotificationTwoLikersText),
                    notificationData.actors[0].EmailAddress.Name,
                    notificationData.actors[1].EmailAddress.Name
                )
                    .concat(' ')
                    .concat(notificationData.subject),
                notificationContent: formatToArray(
                    loc(likersNotificationTwoLikersText),
                    boldName1,
                    boldName2
                )
                    .concat(' ')
                    .concat(notificationData.subject),
            };
        default:
            const boldLatestName = (
                <span className={styles.actorsName}>
                    {notificationData.actors[0].EmailAddress.Name}
                </span>
            );
            const boldCount = (
                <span className={styles.actorsName}>{notificationData.actors.length - 1}</span>
            );
            return {
                notificationTooltip: format(
                    loc(likersNotificationMoreThanTwoLikersText),
                    notificationData.actors[0].EmailAddress.Name,
                    notificationData.actors.length - 1
                )
                    .concat(' ')
                    .concat(notificationData.subject),
                notificationContent: formatToArray(
                    loc(likersNotificationMoreThanTwoLikersText),
                    boldLatestName,
                    boldCount
                )
                    .concat(' ')
                    .concat(notificationData.subject),
            };
    }
}
