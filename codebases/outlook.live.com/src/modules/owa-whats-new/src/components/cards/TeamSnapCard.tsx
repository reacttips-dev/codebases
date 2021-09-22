import { getUserConfiguration } from 'owa-session-store';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import { getCalendarPath } from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import * as React from 'react';
import {
    whatsNew_Card_TeamSnap_Title,
    whatsNew_Card_TeamSnap_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';
import teamSnapStyles from './TeamSnapCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.TeamSnap);

    let teamSnapPath = getCalendarPath() + 'addcalendar/teamsnap/' + getHostLocation().search;
    if (getOwaWorkload() == OwaWorkload.Calendar) {
        // If we are in OWA Calendar, navigate to add TeamSnap calendar page directly
        window.location.assign(teamSnapPath);
    } else {
        window.open(teamSnapPath);
    }
}

export const TeamSnapCard = observer(function TeamSnapCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.TeamSnap);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_TeamSnap_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.TeamSnap}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function teamSnapCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.TeamSnap,
        title: loc(whatsNew_Card_TeamSnap_Title),
        body: <TeamSnapCard />,
        isHidden: () =>
            Promise.resolve(
                !isFeatureEnabled('cal-addCalendar-teamSnap') ||
                    getUserConfiguration()?.SessionSettings?.IsExplicitLogon
            ),
        svgIcon: (
            <svg
                id="TeamSnapIconBW"
                data-name="TeamSnapIconBW"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <title>TeamSnapIcon Monochrome</title>
                <g id="TyzTU2.tif">
                    <path d="M11.977,23.965A11.966,11.966,0,1,1,23.955,12.011,11.96,11.96,0,0,1,11.977,23.965ZM10.615,10.313A32.727,32.727,0,0,0,5.8,7.885L4.5,11.623c1.761.525,3.532.914,5.323,1.319-1.356,1.306-2.681,2.613-3.908,4.036l3.18,2.431,2.9-4.766,2.778,4.676,3.258-2.135-3.69-4.232L19.7,11.939a.822.822,0,0,0-.013-.1q-.51-1.8-1.019-3.6c-.03-.107-.071-.121-.169-.081-.57.23-1.148.441-1.712.684-1.12.482-2.234.981-3.35,1.472-.037.017-.077.026-.131.044.026-.192.05-.36.071-.528.065-.505.134-1.009.193-1.515s.114-1,.156-1.5c.055-.648.092-1.3.14-1.946.009-.123-.032-.166-.159-.166Q12,4.7,10.281,4.7c-.113,0-.171.027-.156.151.008.069,0,.14,0,.21.068.983.127,1.966.21,2.948.048.576.136,1.15.207,1.725Z" />
                </g>
            </svg>
        ),
        svgIconStyle: teamSnapStyles.teamSnapIcon,
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WhatsNew_TeamSnap.gif')}
            />
        ),
    };
}

export default teamSnapCardProps;
