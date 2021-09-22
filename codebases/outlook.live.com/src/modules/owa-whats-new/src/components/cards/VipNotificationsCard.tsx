import {
    whatsNew_Card_VipNotifications_Body,
    whatsNew_Card_VipNotifications_Button,
    whatsNew_Card_VipNotifications_Title,
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
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.VipNotifications);

    // Show Full Notifications Settings
    lazyMountAndShowFullOptions.importAndExecute('general', 'notifications');
}

export const VipNotificationsCard = observer(function VipNotificationsCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.VipNotifications);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_VipNotifications_Body)}</div>
            <WhatsNewActionLink
                onClick={onGoToSettingsClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.VipNotifications}
                whatsNewActionText={loc(whatsNew_Card_VipNotifications_Button)}
            />
        </>
    );
});

function vipNotificationsCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.VipNotifications,
        title: loc(whatsNew_Card_VipNotifications_Title),
        iconName: ControlIcons.Ringer,
        body: <VipNotificationsCard />,
    };
}

export default vipNotificationsCardProps;
