import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_OneNoteFeed_Title,
    whatsNew_Card_NotesFeed_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_NotesFeed_AltText,
} from '../../strings.locstring.json';
import { openOneNoteFeedPanel } from 'owa-notes-feed-bootstrap';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

const WHATSNEW_SOURCE = 'WhatsNew';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.OneNoteFeedPanel);

    openOneNoteFeedPanel(WHATSNEW_SOURCE);
}

export const NotesFeedCard = observer(function NotesFeedCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.OneNoteFeedPanel);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_NotesFeed_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.OneNoteFeedPanel}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function NotesFeedCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.OneNoteFeedPanel,
        title: loc(whatsNew_Card_OneNoteFeed_Title),
        iconName: ControlIcons.OneNoteLogo,
        body: <NotesFeedCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('notes-noteFeedWhatsNew')),
        animation: (
            <img
                alt={loc(whatsNew_Card_NotesFeed_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_NotesFeed.gif')}
            />
        ),
    };
}

export default NotesFeedCardProps;
