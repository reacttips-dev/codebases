import {
    whatsNew_Card_ScheduleAtGlance_Body,
    whatsNew_Card_ScheduleAtGlance_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

export const ScheduleAtGlanceCard = observer(function ScheduleAtGlanceCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.ScheduleAtGlance);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_ScheduleAtGlance_Body)}</div>;
});

function scheduleAtGlanceCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.ScheduleAtGlance,
        title: loc(whatsNew_Card_ScheduleAtGlance_Title),
        iconName: ControlIcons.AddEvent,
        body: <ScheduleAtGlanceCard />,
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_SchedGlance_600x400_24.gif')}
            />
        ),
    };
}

export default scheduleAtGlanceCardProps;
