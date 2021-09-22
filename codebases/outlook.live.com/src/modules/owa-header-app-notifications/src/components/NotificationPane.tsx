import * as React from 'react';
import classNames from 'classnames';
import NewMailNotificationHost from './newmail/NewMailNotificationHost';
import RemindersHost from './reminders/RemindersHost';
import LikeNotificationHost from './likes/LikeNotificationHost';
import ReactionNotificationHost from './reactions/ReactionNotificationHost';
import AutomaticRepliesNotificationHost from './automatic-replies/AutomaticRepliesNotificationHost';
import { ForwardingNoticeNotificationHost } from './forwarding-notice/ForwardingNoticeNotificationHost';
import getStore from '../store/store';
import { observer } from 'mobx-react-lite';
import { Layer } from '@fluentui/react/lib/Layer';
import { isAppPaneUnderlayExpanded } from 'owa-application';
import { isShySuiteHeaderMode } from 'owa-suite-header-store';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getNonBootUserConfiguration } from 'owa-nonboot-userconfiguration-manager';
import { UaeEduPrivacyNotification } from './privacy-notice/UaeEduPrivacyNotification';
import { LightningId } from 'owa-lightning-v2';

import styles from './NotificationPane.scss';

export interface NotificationPaneProps {
    children?: React.ReactNode;
}

const NotificationPane: React.StatelessComponent<NotificationPaneProps> = observer(props => {
    const { reminders, showReminders, showAutomaticRepliesNotification } = getStore();
    return (
        <Layer className={styles.layer}>
            <div
                className={classNames(
                    styles.panel,
                    isAppPaneUnderlayExpanded() && styles.flexOffset,
                    {
                        isShyHeaderMode: isShySuiteHeaderMode(),
                    }
                )}
                aria-live="polite">
                <UaeEduPrivacyNotification
                    lid={LightningId.UaeEduPrivacyNotification}
                    when={lightupIfEdu}
                />
                {getUserConfiguration().SessionSettings.WebSessionType ===
                    WebSessionType.Business && <ForwardingNoticeNotificationHost />}
                {showAutomaticRepliesNotification && <AutomaticRepliesNotificationHost />}
                <NewMailNotificationHost />
                <LikeNotificationHost />
                <ReactionNotificationHost />
                {showReminders && <RemindersHost reminders={reminders} />}
                {props.children}
            </div>
        </Layer>
    );
});

function lightupIfEdu(lightup: () => void) {
    getNonBootUserConfiguration().then(config => {
        if (config.IsEdu) {
            lightup();
        }
    });
}

export default NotificationPane;
