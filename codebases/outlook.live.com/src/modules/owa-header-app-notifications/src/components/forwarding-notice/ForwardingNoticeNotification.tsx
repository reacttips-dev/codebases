import {
    forwardingNoticeTitle,
    forwardingNoticeDescription,
    forwardingNoticeTurnOff,
} from './ForwardingNoticeNotification.locstring.json';
import loc, { format } from 'owa-localize';
import * as React from 'react';
import { IconButton, ActionButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';

import styles from './ForwardingNoticeNotification.scss';

export interface ForwardingNoticeNotificationProps {
    forwardingAddress: string;
    onDismiss: () => void;
    onTurnOff: () => void;
}

export const ForwardingNoticeNotification = ({
    forwardingAddress,
    onDismiss,
    onTurnOff,
}: ForwardingNoticeNotificationProps) => (
    <div className={styles.forwardingNotice}>
        <Icon className={styles.forwardingIcon} iconName={ControlIcons.MailForward} />
        <div className={styles.description}>
            <div className={styles.header}>{loc(forwardingNoticeTitle)}</div>
            <div className={styles.body}>
                {format(loc(forwardingNoticeDescription), forwardingAddress)}
                <ActionButton
                    text={loc(forwardingNoticeTurnOff)}
                    className={styles.turnOff}
                    onClick={onTurnOff}
                />
            </div>
        </div>
        <IconButton
            className={styles.closeButton}
            iconProps={{
                iconName: ControlIcons.Cancel,
            }}
            styles={{
                root: styles.closeButtonIcon,
            }}
            onClick={onDismiss}
        />
    </div>
);
