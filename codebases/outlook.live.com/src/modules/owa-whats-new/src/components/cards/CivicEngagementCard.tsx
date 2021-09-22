import {
    whatsNew_Card_CivicEngagement_Body,
    whatsNew_Card_CivicEngagement_Button,
    whatsNew_Card_CivicEngagement_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';

const CIVIC_ENGAGEMENT_LEARN_MORE_URL =
    'https://www.bing.com/search?q=vote%202020&qs=n&form=CIENWN&sp=-1&pq=vote%202020&sc=2-14&sk=&cvid=ADA9F569C221411AB8BAC5EDF288703D';

import iconStyles from './NewsCard.scss';

function onLearnMoreClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.CivicEngagement);

    // Link goes to a Bing search for "Vote Early Day"
    window.open(CIVIC_ENGAGEMENT_LEARN_MORE_URL, '_blank');
}

export const CivicEngagementCard = observer(function CivicEngagementCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.CivicEngagement);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_CivicEngagement_Body)}</div>
            <WhatsNewActionLink
                onClick={onLearnMoreClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.CivicEngagement}
                whatsNewActionText={loc(whatsNew_Card_CivicEngagement_Button)}
            />
        </>
    );
});

function CivicEngagementCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.CivicEngagement,
        title: loc(whatsNew_Card_CivicEngagement_Title),
        body: <CivicEngagementCard />,
        svgIcon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" width="20" height="20">
                <path d="M1767 660q2 8 9 38t19 75 25 98 27 109 27 107 24 92 16 66 6 27v776H128v-776q0-1 7-32t20-82 29-115 34-133 34-135 30-122 23-93 13-48h457L1280 5l571 571-84 84zM731 738l159 158h459l321-320-390-389-549 551zm-473 542h1532l-129-515-131 131h6l32 128H496l32-128h180L549 739l99-99H418l-160 640zm1534 640v-512H256v512h1536z" />
            </svg>
        ),
        svgIconStyle: iconStyles.icon,
    };
}

export default CivicEngagementCardProps;
