import {
    whatsNew_Card_TimePanel_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_TimePanel_Title,
    whatsNew_Card_TimePanel_AltText,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { isTimePanelAvailable, openTimePanel } from 'owa-time-panel-bootstrap';

import styles from '../WhatsNewFluentCard.scss';
const WHATSNEW_SOURCE = 'WhatsNew';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.TimePanel);

    // Expand the time panel
    openTimePanel(WHATSNEW_SOURCE);
}

export const TimePanelCard = observer(function TimePanelCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.TimePanel);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_TimePanel_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.TimePanel}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function TimePanelCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.TimePanel,
        title: loc(whatsNew_Card_TimePanel_Title),
        iconName: ControlIcons.EventToDoLogo,
        body: <TimePanelCard />,
        animation: (
            <img
                alt={loc(whatsNew_Card_TimePanel_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_TimePanel.gif')}
            />
        ),
        // additional client-side checks are required for Time Panel card
        isHidden: () => Promise.resolve(!isTimePanelAvailable()),
    };
}

export default TimePanelCardProps;
