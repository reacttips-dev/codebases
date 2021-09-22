import { reminders_title, reminders_dismissAll } from './ReminderHeader.locstring.json';
import { confirmDialogCloseText } from 'owa-locstrings/lib/strings/confirmdialogclosetext.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';

import { observer } from 'mobx-react-lite';
import toggleReminderVisibility from '../../mutators/toggleReminderVisibility';
import dismissAllReminders from '../../actions/onDismissAllReminders';

import styles from './RemindersHost.scss';
import animationStyles from './ReminderAnimations.scss';
import classnames from 'classnames';

export interface ReminderHeaderProps {
    onDismissAll?: (evt?: React.MouseEvent<any>) => void;
    onHideReminders?: (evt?: React.MouseEvent<any>) => void;
}

export default observer(function ReminderHeader(props: ReminderHeaderProps) {
    const onDismissAll = props.onDismissAll || dismissAll;
    const onHideReminders = props.onHideReminders || hideReminders;

    return (
        <div className={classnames(styles.headerContainer, animationStyles.reminderHeader)}>
            <div className={styles.headerText}>{loc(reminders_title)}</div>
            <div className={styles.hoverActions}>
                {/* #24572 - Wire up actions and dataflow */}
                <ActionButton
                    text={loc(reminders_dismissAll)}
                    className={styles.dismissAll}
                    onClick={onDismissAll}
                />
                <IconButton
                    iconProps={{
                        iconName: ControlIcons.Cancel,
                    }}
                    styles={{
                        root: styles.closeButton,
                        icon: styles.closeButtonIcon,
                    }}
                    onClick={onHideReminders}
                    ariaLabel={loc(confirmDialogCloseText)}
                />
            </div>
        </div>
    );
});

function hideReminders(evt: React.MouseEvent<any>) {
    evt.stopPropagation();
    toggleReminderVisibility(false);
}

function dismissAll(evt: React.MouseEvent<any>) {
    evt.stopPropagation();
    dismissAllReminders();
}
