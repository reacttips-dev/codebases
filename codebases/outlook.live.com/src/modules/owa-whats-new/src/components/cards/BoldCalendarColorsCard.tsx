import {
    whatsNew_Card_BoldCalendarColors_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_BoldCalendarColors_Title,
    whatsNew_Card_BoldCalendarColors_AltText,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { openQuickSettings } from '../../actions/openQuickSettings';
import { showWhatsNewCallout } from '../WhatsNewCallout';

import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { getOwaResourceImageUrl } from 'owa-resource-url';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.BoldCalendarColors);

    // Expand the quick setting pane
    openQuickSettings();

    // Show a callout and anchor it to the bold calendar color mode quick option
    showWhatsNewCallout(WhatsNewCardIdentity.BoldCalendarColors, () =>
        document.getElementById('options-quick-calendarAppearance_boldColors')
    );
}

export const BoldCalendarColorsCard = observer(function BoldCalendarColorsCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.BoldCalendarColors);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_BoldCalendarColors_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.BoldCalendarColors}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function boldCalendarColorsCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.BoldCalendarColors,
        title: loc(whatsNew_Card_BoldCalendarColors_Title),
        iconName: ControlIcons.Color,
        body: <BoldCalendarColorsCard />,
        animation: (
            <img
                alt={loc(whatsNew_Card_BoldCalendarColors_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_Calendar_BoldColors.gif')}
            />
        ),
    };
}

export default boldCalendarColorsCardProps;
