import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import * as React from 'react';
import {
    whatsNew_Card_PersonalBookings_Title,
    whatsNew_Card_PersonalBookings_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.PersonalBookingPage);

    // Navigate to PBP options page
    lazyMountAndShowFullOptions.importAndExecute('calendar', 'pbp');
}

export const PersonalBookingsCard = observer(function PersonalBookingsCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.PersonalBookingPage);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_PersonalBookings_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.PersonalBookingPage}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function personalBookingsCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.PersonalBookingPage,
        title: loc(whatsNew_Card_PersonalBookings_Title),
        iconName: ControlIcons.BookingsLogo,
        body: <PersonalBookingsCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('cal-personalbookingpage')),
    };
}

export default personalBookingsCardProps;
