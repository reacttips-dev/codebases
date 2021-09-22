import type { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { showWhatsNewCallout } from '../WhatsNewCallout';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import * as React from 'react';
import {
    whatsNew_Card_SpeedyMeetings_Body,
    whatsNew_Card_SpeedyMeetings_Title,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';

interface SpeedyMeetingsBaseCardProps {
    identity: WhatsNewCardIdentity;
    elementId: string;
}

function onTryItClickedHandler(
    evt: React.MouseEvent<unknown>,
    identity: WhatsNewCardIdentity,
    elementId: string
): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(identity);

    // Navigate to Events and invitations settings
    lazyMountAndShowFullOptions.importAndExecute('calendar', 'eventAndInvitations', 'event');

    // Show a callout and anchor it to the speedy meetings options
    showWhatsNewCallout(identity, () => document.getElementById(elementId));
}

export const SpeedyMeetingsBaseCard = observer(function SpeedyMeetingsBaseCard(
    props: SpeedyMeetingsBaseCardProps
) {
    React.useEffect(() => {
        logWhatsNewCardShown(props.identity);
    }, []);

    const onTryItClicked = evt => onTryItClickedHandler(evt, props.identity, props.elementId);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_SpeedyMeetings_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={props.identity}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function speedyMeetingsBaseCardProps(
    identity: WhatsNewCardIdentity,
    elementId: string,
    isHidden: () => Promise<boolean>
): WhatsNewCardProperty {
    return {
        identity: identity,
        title: loc(whatsNew_Card_SpeedyMeetings_Title),
        iconName: ControlIcons.Clock,
        body: <SpeedyMeetingsBaseCard identity={identity} elementId={elementId} />,
        isHidden: isHidden,
    };
}

export default speedyMeetingsBaseCardProps;
