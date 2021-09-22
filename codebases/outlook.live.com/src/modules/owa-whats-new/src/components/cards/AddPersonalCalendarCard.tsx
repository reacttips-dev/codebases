import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import { getCalendarPath } from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import * as React from 'react';
import {
    whatsNew_Card_AddPersonalCalendar_Title,
    whatsNew_Card_AddPersonalCalendar_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.AddPersonalCalendar);

    let personalCalendarsPath =
        getCalendarPath() + 'addcalendar/personal/' + getHostLocation().search;

    if (getOwaWorkload() == OwaWorkload.Calendar) {
        // If we are in OWA Calendar, navigate to add personal calendars page directly
        window.location.assign(personalCalendarsPath);
    } else {
        window.open(personalCalendarsPath);
    }
}

export const PersonalCalendarsCard = observer(function PersonalCalendarsCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.AddPersonalCalendar);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_AddPersonalCalendar_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.AddPersonalCalendar}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function personalCalendarsCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.AddPersonalCalendar,
        title: loc(whatsNew_Card_AddPersonalCalendar_Title),
        iconName: ControlIcons.Accounts,
        body: <PersonalCalendarsCard />,
        isHidden: () =>
            Promise.resolve(
                !isFeatureEnabled('cal-multiAccounts') || !isHostAppFeatureEnabled('multiAccounts')
            ),
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WhatsNew_PersonalCalendars.gif')}
            />
        ),
    };
}

export default personalCalendarsCardProps;
