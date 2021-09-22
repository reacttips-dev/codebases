import {
    whatsNew_Card_WebPushReminders_Body,
    whatsNew_Card_WebPushReminders_Button,
    whatsNew_Card_WebPushReminders_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { lazyMountAndShowFullOptions } from 'owa-options-view';

function onGoToSettingsClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.WebPushReminders);

    // Show Full Notifications Settings
    lazyMountAndShowFullOptions.importAndExecute('general', 'notifications');
}

export const WebPushRemindersCard = observer(function WebPushRemindersCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.WebPushReminders);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_WebPushReminders_Body)}</div>
            <WhatsNewActionLink
                onClick={onGoToSettingsClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.WebPushReminders}
                whatsNewActionText={loc(whatsNew_Card_WebPushReminders_Button)}
            />
        </>
    );
});

export function webPushRemindersCard(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.WebPushReminders,
        title: loc(whatsNew_Card_WebPushReminders_Title),
        iconName: ControlIcons.Ringer,
        body: <WebPushRemindersCard />,
    };
}

export function webPushRemindersWithTimersCard(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.WebPushRemindersWithTimers,
        title: loc(whatsNew_Card_WebPushReminders_Title),
        iconName: ControlIcons.Ringer,
        body: <WebPushRemindersCard />,
    };
}
