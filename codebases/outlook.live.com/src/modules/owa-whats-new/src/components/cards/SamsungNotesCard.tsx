import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_SamsungNotes_Title,
    whatsNew_Card_SamsungNotes_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_NotesFeed_AltText,
} from '../../strings.locstring.json';
import { openOneNoteFeedPanel, wereSamsungNotesEverSynchronized } from 'owa-notes-feed-bootstrap';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

const SAMSUNG_WHATSNEW_SOURCE = 'SamsungWhatsNew';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.SamsungNotes);

    openOneNoteFeedPanel(SAMSUNG_WHATSNEW_SOURCE);
}

export const SamsungNotesCard = observer(function SamsungNotesCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.SamsungNotes);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_SamsungNotes_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.SamsungNotes}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function SamsungNotesCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.SamsungNotes,
        title: loc(whatsNew_Card_SamsungNotes_Title),
        iconName: ControlIcons.OneNoteLogo,
        body: <SamsungNotesCard />,
        isHidden: () => Promise.resolve(!wereSamsungNotesEverSynchronized),
        animation: (
            <img
                alt={loc(whatsNew_Card_NotesFeed_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_NotesFeed.gif')}
            />
        ),
    };
}

export default SamsungNotesCardProps;
