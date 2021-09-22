import { observer as observer_0 } from 'mobx-react-lite';
import {
    ariaUndoWinText,
    ariaUndoMacText,
    ariaNotifBarActionString,
} from './NotificationBarHost.locstring.json';
import loc, { format } from 'owa-localize';
import NotificationBar from './NotificationBar';
import type NotificationBarHostId from '../store/schema/NotificationBarHostId';
import store from '../store/Store';
import { toJS } from 'mobx';

import { isWindows } from 'owa-user-agent';
import * as React from 'react';
import { TransitionGroup } from 'react-transition-group';

import styles from './NotificationBar.scss';

export interface NotificationBarHostProps {
    /** Identifies the host for showing relevant notifications (tagged with the same hostId) */
    hostId: NotificationBarHostId;
    onNotificationBlur?: () => any;
}

export default observer_0(function NotificationBarHost(props: NotificationBarHostProps) {
    if (!props.hostId) {
        return null;
    }
    let notificationToShow;
    let ariaNotifString: string = '';
    if (store.notificationStack.length > 0) {
        const id = store.notificationStack[store.notificationStack.length - 1];
        const notification = store.notificationsMap.get(id);
        if (props.hostId === notification.hostId) {
            notificationToShow = notification;
            const macOrWindowsUndoString = isWindows ? loc(ariaUndoWinText) : loc(ariaUndoMacText);
            ariaNotifString =
                notificationToShow.primaryActionText !== null
                    ? format(
                          loc(ariaNotifBarActionString),
                          notificationToShow.contentText,
                          macOrWindowsUndoString,
                          notificationToShow.primaryActionText
                      )
                    : notificationToShow.contentText;
        }
    }
    return (
        /**
         * NOTE: Calling toJS() on an observable object is generally ill-advised
         * It is only done in this case so the <NewMailNotification /> can render properly when
         * it is being animated out, since the <TransitionGroup /> clones the object.
         * If we didn't do this, the data passed in would be nulled out in the cloned
         * <NewMailNotification /> component, causing issues.
         */
        <>
            <TransitionGroup className={styles.notificationBarHostContainer}>
                {notificationToShow && (
                    <NotificationBar
                        notification={toJS(notificationToShow)}
                        key={notificationToShow.id}
                        onNotificationBlur={props.onNotificationBlur}
                    />
                )}
            </TransitionGroup>
            <div
                className="screenReaderOnly"
                role="alert"
                aria-relevant="additions"
                aria-live="assertive"
                id="notificationBarText">
                {store.notificationStack.length > 0 && ariaNotifString && (
                    <div key={ariaNotifString}>{ariaNotifString}</div>
                )}
            </div>
        </>
    );
});
