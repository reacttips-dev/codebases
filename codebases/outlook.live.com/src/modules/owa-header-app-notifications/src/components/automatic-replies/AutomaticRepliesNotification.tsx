import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import loc from 'owa-localize';
import { confirmDialogCloseText } from 'owa-locstrings/lib/strings/confirmdialogclosetext.locstring.json';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import * as React from 'react';
import { lazyOnDismissAutomaticReplyNotification } from '../../index';
import {
    logAutomaticReplyNotificationDismissButtonClicked,
    logAutomaticReplyNotificationShown,
    logAutomaticReplyNotificationTurnOffButtonClicked,
} from '../../utils/logAutomaticReplyNotificationDatapoints';
import {
    automatic_replies_description,
    automatic_replies_title,
    automatic_replies_turnOff,
} from './AutomaticRepliesNotification.locstring.json';
import styles from './AutomaticRepliesNotification.scss';

const AutomaticRepliesNotification = observer(function AutomaticRepliesNotification(props: {}) {
    React.useEffect(() => {
        logAutomaticReplyNotificationShown();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <Icon iconName={ControlIcons.Warning} className={styles.warningIcon} />
                <div>
                    <div className={styles.headerText}>{loc(automatic_replies_title)} </div>
                    <div className={styles.textContainer}>
                        <span className={styles.textDescription}>
                            {loc(automatic_replies_description)}
                        </span>
                        <ActionButton
                            text={loc(automatic_replies_turnOff)}
                            className={styles.turnOffButton}
                            onClick={onTurnOffAutomaticReplies}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <IconButton
                    iconProps={{
                        iconName: ControlIcons.Cancel,
                    }}
                    styles={{
                        icon: styles.closeButtonIcon,
                        root: styles.closeButton,
                    }}
                    onClick={onHideAutomaticRepliesNotification}
                    ariaLabel={loc(confirmDialogCloseText)}
                />
            </div>
        </div>
    );
});
export default AutomaticRepliesNotification;

async function onHideAutomaticRepliesNotification(evt: React.MouseEvent<any>) {
    evt.stopPropagation();
    const onDismissAutomaticReplyNotification = await lazyOnDismissAutomaticReplyNotification.import();
    onDismissAutomaticReplyNotification();
    logAutomaticReplyNotificationDismissButtonClicked();
}

async function onTurnOffAutomaticReplies() {
    const onDismissAutomaticReplyNotification = await lazyOnDismissAutomaticReplyNotification.import();
    onDismissAutomaticReplyNotification();

    if (isFeatureEnabled('nh-boot-acctmonaccounts') && isHostAppFeatureEnabled('acctmonaccounts')) {
        lazyMountAndShowFullOptions.importAndExecute(
            'accounts-category',
            'automaticReply',
            'automaticRepliesOption'
        );
    } else {
        lazyMountAndShowFullOptions.importAndExecute(
            'mail',
            'automaticReplies',
            'automaticRepliesOption'
        );
    }
    logAutomaticReplyNotificationTurnOffButtonClicked();
}
