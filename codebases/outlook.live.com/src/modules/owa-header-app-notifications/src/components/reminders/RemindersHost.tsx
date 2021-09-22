import * as React from 'react';
import ReminderHeader from './ReminderHeader';
import type { ReminderData } from '../../store/schema/ReminderData';
import ReminderForCalendarOrTask from './ReminderForCalendarOrTask';
import { observer } from 'mobx-react-lite';
import { TransitionGroup } from 'react-transition-group';
import { AnimationClassNames } from '@fluentui/style-utilities';
import { toJS } from 'mobx';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { getRTLSafeKeyCode, KeyCodes } from '@fluentui/utilities';
import { raiseEventNotification } from '../../utils/raiseHostNotification';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import styles from './RemindersHost.scss';
import classnamesBind from 'classnames/bind';
const classnames = classnamesBind.bind(styles);
import animations from './ReminderAnimations.scss';

export interface ReminderHostProps {
    reminders: ReminderData[];
}

export default observer(function RemindersHost(props: ReminderHostProps) {
    let { reminders } = props;

    const isShown = !!reminders && reminders.length > 0;
    const isMonarch = isHostAppFeatureEnabled('nativeResolvers');
    // Send reminder notification pie event to the native host app if isShown
    if (isShown) {
        raiseEventNotification(reminders);
    }

    return (
        <div
            className={classnames(
                styles.container,
                isShown && !isMonarch
                    ? AnimationClassNames.slideDownIn20
                    : classnames(AnimationClassNames.slideUpOut20, animations.remindersHostExit)
            )}>
            <ReminderHeader />
            <FocusZone
                className={styles.remindersContainer}
                direction={FocusZoneDirection.vertical}
                isInnerZoneKeystroke={isInnerZoneKeystroke}>
                <TransitionGroup>
                    {reminders.map(data => (
                        /**
                         * NOTE: Calling toJS() on an observable object is generally ill-advised
                         * It is only done in this case so the <Reminder /> can render properly when
                         * it is being animated out, since the <TransitionGroup /> clones the object.
                         * If we didn't do this, the data passed in would be nulled out in the cloned
                         * <Reminder /> component, causing issues.
                         */
                        <ReminderForCalendarOrTask key={data.itemId.Id} reminder={toJS(data)} />
                    ))}
                </TransitionGroup>
            </FocusZone>
        </div>
    );
});

function isInnerZoneKeystroke(ev: React.KeyboardEvent<HTMLElement>): boolean {
    return ev.which === getRTLSafeKeyCode(KeyCodes.right);
}
