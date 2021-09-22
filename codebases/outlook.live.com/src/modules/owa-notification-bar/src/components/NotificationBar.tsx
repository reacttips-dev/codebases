import { observer } from 'mobx-react-lite';
import * as React from 'react';
import dismissNotification from '../orchestrators/dismissNotification';
import type NotificationBarData from '../store/schema/NotificationBarData';
import { useActionButtonStyles, useDismissButtonStyles } from './NotificationBar.styles';
import { AnimationClassNames } from '@fluentui/style-utilities';
import { ControlIcons } from 'owa-control-icons';
import { CSSTransition } from 'react-transition-group';
import { DefaultButton, IconButton, PrimaryButton, IButton } from '@fluentui/react/lib/Button';
import { getNotificationBarCallback } from '../callbacksMap/notificationBarCallbacks';
import { Icon } from '@fluentui/react/lib/Icon';
import { NotificationBarCallbackReason } from '../callbacksMap/NotificationBarCallbackReason';
import {
    notificationMouseEnter,
    notificationMouseLeave,
    setIsNotificationBarFocused,
} from '../actions/internalActions';
import { Spinner, SpinnerType } from '@fluentui/react/lib/Spinner';
import store from '../store/Store';
import { useGlobalHotkey } from 'owa-hotkeys';
import { useWindowEvent } from 'owa-react-hooks/lib/useWindowEvent';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { ariaDismissNotificationButtonString } from './NotificationBar.locstring.json';
import loc from 'owa-localize';

import styles from './NotificationBar.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

const ANIMATION_DURATION = 167;
const BEFORE_UNLOAD_EVENT = 'beforeunload';

export interface NotificatinBarProps {
    notification: NotificationBarData;
    onNotificationBlur?: () => any;
}

export default observer(function NotificationBar(props: NotificatinBarProps) {
    const { notification, onNotificationBlur, ...transitionProps } = props;

    const onPrimaryButtonClick = () => {
        closeAndExecuteCallback(NotificationBarCallbackReason.PrimaryActionClicked);
    };
    useGlobalHotkey(notification.primaryActionHotKeyCommand, onPrimaryButtonClick);

    const onBeforeUnload = () => {
        // fire the callback before window closes
        closeAndExecuteCallback(NotificationBarCallbackReason.NotificationBarUnmounted);
    };
    useWindowEvent(BEFORE_UNLOAD_EVENT, onBeforeUnload);

    React.useEffect(() => {
        return () => {
            if (getNotificationBarCallback(props.notification.id)) {
                closeAndExecuteCallback(NotificationBarCallbackReason.NotificationBarUnmounted);
            }
        };
    }, []);
    React.useEffect(() => {
        // Notification bar will take focus if there are multiple notifications stacked and the notification is becoming the
        // top notification after the current top notification is dismissed
        if (shouldFocus()) {
            focusButtonRef.current.focus();
        }
    });

    const actionButtonStyles = useActionButtonStyles(notification.showButtonsOnBottom);
    const dismissButtonStyles = useDismissButtonStyles();

    const focusButtonRef = React.useRef<IButton>();
    const shouldFocus = (): boolean => {
        // Notification bar should put focus itself if
        // 1. It's the top notification on the stack
        // 2. The previous notification bar had focus
        // 3. This notification bar does not have focus
        // 4. We have a button to put focus on
        return store.notificationBarViewState.isFocused && focusButtonRef.current !== null;
    };
    const renderSpinnerOrIcon = () => {
        if (props.notification.shouldShowSpinner) {
            return <Spinner className={styles.spinner} type={SpinnerType.normal} />;
        }
        if (props.notification.icon) {
            const iconStyles = {
                root: styles.iconRoot,
            };
            return <Icon styles={iconStyles} iconName={props.notification.icon} />;
        }
        return <div className={styles.iconSpace} />;
    };
    const onSecondaryButtonClick = () => {
        closeAndExecuteCallback(NotificationBarCallbackReason.SecondaryActionClicked);
    };
    const onDismissClick = () => {
        closeAndExecuteCallback(NotificationBarCallbackReason.DismissClicked);
    };
    const closeAndExecuteCallback = (reason: NotificationBarCallbackReason) => {
        let notificationCallBack = getNotificationBarCallback(props.notification.id);
        dismissNotification(props.notification.id);
        if (!store.notificationBarViewState.isFocused && props.onNotificationBlur) {
            props.onNotificationBlur();
        }
        if (notificationCallBack) {
            notificationCallBack(reason);
        }
    };
    const onMouseLeave = () => {
        notificationMouseLeave(props.notification.id);
    };
    const setPrimaryButtonRef = (button: IButton) => {
        focusButtonRef.current = button;
    };
    const setDismissButtonRef = (button: IButton) => {
        // Only set this ref if there is no primary action button.
        // The ref is used to choose the default focused element in the bar
        if (!props.notification.primaryActionText) {
            focusButtonRef.current = button;
        }
    };

    const content = notification.contentText ? (
        <span
            className={classNames(
                styles.contentText,
                isBrowserIE() && styles.isIE,
                notification.showButtonsOnBottom && styles.showButtonsOnBottom
            )}
            title={notification.contentText}>
            {notification.contentText}
        </span>
    ) : (
        notification.renderContent?.()
    );

    const buttons = (
        <>
            {notification.primaryActionText && (
                <PrimaryButton
                    componentRef={setPrimaryButtonRef}
                    onClick={onPrimaryButtonClick}
                    text={notification.primaryActionText}
                    title={notification.primaryActionText}
                    ariaLabel={notification.primaryActionText}
                    styles={actionButtonStyles}
                    onFocus={onButtonFocused}
                    iconProps={{ iconName: notification.primaryActionIcon }}
                />
            )}
            {notification.primaryActionText && notification.secondaryActionText && (
                <DefaultButton
                    onClick={onSecondaryButtonClick}
                    text={notification.secondaryActionText}
                    title={notification.secondaryActionText}
                    ariaLabel={notification.secondaryActionText}
                    styles={actionButtonStyles}
                />
            )}
        </>
    );

    return (
        <CSSTransition
            {...transitionProps}
            timeout={ANIMATION_DURATION}
            classNames={{
                enter: AnimationClassNames.slideUpIn20,
                exit: AnimationClassNames.slideDownOut20,
            }}>
            {/* Positioning container necessary for IE since the notificationBarContainer
                is position: absolute. It needs a parent with a width property for IE to calculate the correct position */}
            <div className={styles.positioningContainer}>
                <div
                    className={styles.notificationBarContainer}
                    style={{
                        minWidth: notification.minWidth + 'px',
                        maxWidth: notification.maxWidth + 'px',
                    }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}>
                    <div className={styles.leftItems}>
                        {renderSpinnerOrIcon()}
                        <div className={styles.middleContent}>
                            {content}
                            <div>{notification.showButtonsOnBottom && buttons}</div>
                        </div>
                    </div>

                    <div className={styles.rightItems}>
                        {!notification.showButtonsOnBottom && buttons}
                        <IconButton
                            componentRef={setDismissButtonRef}
                            onClick={onDismissClick}
                            styles={dismissButtonStyles}
                            iconProps={{
                                iconName: ControlIcons.Cancel,
                            }}
                            onFocus={onButtonFocused}
                            title={loc(ariaDismissNotificationButtonString)}
                            ariaLabel={loc(ariaDismissNotificationButtonString)}
                        />
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
});

function onMouseEnter() {
    notificationMouseEnter();
}

function onButtonFocused() {
    setIsNotificationBarFocused();
}
