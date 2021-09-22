import {
    whatsNew_Card_DarkMode_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_DarkMode_Title,
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

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.DarkMode);

    // Expand the quick setting pane
    openQuickSettings();

    // Show a callout and anchor it to the dark mode quick option
    showWhatsNewCallout(WhatsNewCardIdentity.DarkMode, () =>
        document.getElementById('options-quick-darkMode')
    );
}

export const DarkModeCard = observer(function DarkModeCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.DarkMode);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_DarkMode_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.DarkMode}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function darkModeCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.DarkMode,
        title: loc(whatsNew_Card_DarkMode_Title),
        iconName: ControlIcons.ClearNight,
        body: <DarkModeCard />,
    };
}

export default darkModeCardProps;
