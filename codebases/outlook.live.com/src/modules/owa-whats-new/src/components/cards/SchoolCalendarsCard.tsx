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
    whatsNew_Card_SchoolCalendars_Title,
    whatsNew_Card_SchoolCalendars_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.SchoolCalendars);

    let schoolCalendarsPath = getCalendarPath() + 'addcalendar/schools/' + getHostLocation().search;

    if (getOwaWorkload() == OwaWorkload.Calendar) {
        // If we are in OWA Calendar, navigate to add school calendars page directly
        window.location.assign(schoolCalendarsPath);
    } else {
        window.open(schoolCalendarsPath);
    }
}

export const SchoolCalendarsCard = observer(function SchoolCalendarsCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.SchoolCalendars);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_SchoolCalendars_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.SchoolCalendars}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function schoolCalendarsCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.SchoolCalendars,
        title: loc(whatsNew_Card_SchoolCalendars_Title),
        iconName: ControlIcons.Education,
        body: <SchoolCalendarsCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('cal-schoolCalendars')),
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WhatsNew_SchoolCalendars.gif')}
            />
        ),
    };
}

export default schoolCalendarsCardProps;
