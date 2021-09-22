import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isOutlookSpacesEnabled } from 'owa-timestream-enabled';
import loc from 'owa-localize';
import { getOutlookSpacesPath } from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import * as React from 'react';
import {
    whatsNew_Card_OutlookSpaces_Title,
    whatsNew_Card_OutlookSpaces_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.OutlookSpaces);

    let outlookSpacesPath = getOutlookSpacesPath() + getHostLocation().search;

    // We are not going to have whatsNew for Spaces module,
    // hence by default open in a new window
    window.open(outlookSpacesPath);
}

export const OutlookSpacesCard = observer(function OutlookSpacesCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.OutlookSpaces);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_OutlookSpaces_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.OutlookSpaces}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function outlookSpacesCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.OutlookSpaces,
        title: loc(whatsNew_Card_OutlookSpaces_Title),
        iconName: ControlIcons.NotePinned,
        body: <OutlookSpacesCard />,
        isHidden: () => Promise.resolve(!isOutlookSpacesEnabled()),
    };
}

export default outlookSpacesCardProps;
