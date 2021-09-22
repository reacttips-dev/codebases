import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { showWhatsNewCallout } from '../WhatsNewCallout';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { getDefaultCalendar } from 'owa-calendar-cache';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import type { LocalCalendarEntry } from 'owa-graph-schema';
import * as React from 'react';
import {
    whatsNew_Card_OnlineMeetings_Title,
    whatsNew_Card_OnlineMeetings_Teams_Body,
    whatsNew_Card_OnlineMeetings_Skype_Body,
    whatsNew_Card_OnlineMeetings_Skype_Consumer_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';

interface OnlineMeetingsCardProps {
    onlineMeetingCardBody: string;
}

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.OnlineMeetings);

    // Navigate to Events and invitations settings
    lazyMountAndShowFullOptions.importAndExecute('calendar', 'eventAndInvitations', 'event');

    // Show a callout and anchor it to the online meetings options
    showWhatsNewCallout(WhatsNewCardIdentity.OnlineMeetings, () =>
        document.getElementById('onlineMeetingsOption')
    );
}

export const OnlineMeetingsCard = observer(function OnlineMeetingsCard(
    props: OnlineMeetingsCardProps
) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.OnlineMeetings);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(props.onlineMeetingCardBody)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.OnlineMeetings}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function onlineMeetingsCardProps(): WhatsNewCardProperty {
    const onlineMeetingCardBody = getOnlineMeetingCardBody();

    return {
        identity: WhatsNewCardIdentity.OnlineMeetings,
        title: loc(whatsNew_Card_OnlineMeetings_Title),
        iconName: ControlIcons.Calendar,
        body: <OnlineMeetingsCard onlineMeetingCardBody={onlineMeetingCardBody} />,
        isHidden: () => Promise.resolve(!onlineMeetingCardBody),
    };
}

function getOnlineMeetingCardBody(): string | null {
    const calendarEntry: LocalCalendarEntry = getDefaultCalendar() as LocalCalendarEntry;
    const onlineMeetingProvider = calendarEntry?.DefaultOnlineMeetingProvider;

    return onlineMeetingProvider === 'TeamsForBusiness'
        ? whatsNew_Card_OnlineMeetings_Teams_Body
        : onlineMeetingProvider === 'SkypeForBusiness'
        ? whatsNew_Card_OnlineMeetings_Skype_Body
        : onlineMeetingProvider === 'SkypeForConsumer'
        ? whatsNew_Card_OnlineMeetings_Skype_Consumer_Body
        : null;
}

export default onlineMeetingsCardProps;
