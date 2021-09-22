import {
    whatsNew_Card_PauseInbox_Body,
    whatsNew_Card_PauseInbox_Title,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_PauseInbox_Disabled_Action_Tooltip,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isFeatureEnabled } from 'owa-feature-flags';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { openPauseInboxMenu } from '../../actions/openPauseInboxMenu';
import { showWhatsNewCallout } from '../WhatsNewCallout';
import { getStore } from '../../store/store';

import styles from '../WhatsNewFluentCard.scss';
import classNames from 'classnames';

export const PauseInboxCard = observer(function PauseInboxCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.PauseInbox);
    }, []);

    const isDisabledAction = getStore().disablePauseInboxTryIt;
    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_PauseInbox_Body)}</div>
            <div>
                <WhatsNewActionLink
                    title={loc(whatsNew_Card_PauseInbox_Disabled_Action_Tooltip)}
                    disabled={isDisabledAction}
                    onClick={onTryItClicked}
                    className={classNames(
                        styles.whatsNewCardCallToAction,
                        isDisabledAction && styles.whatsNewCardDisabledAction
                    )}
                    whatsNewCardIdentity={WhatsNewCardIdentity.PauseInbox}
                    whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
                />
            </div>
        </>
    );
});

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.PauseInbox);

    // Open filter menu programmatically
    openPauseInboxMenu();

    // Show a callout and anchor it to the pause menu in mail list filter dropdown
    showWhatsNewCallout(
        WhatsNewCardIdentity.PauseInbox,
        () => document.getElementById('mail-list-filter-pause'),
        0 /* gapSpace - 0 so that the pulse appears on the edges */
    );
}

function pauseInboxCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.PauseInbox,
        title: loc(whatsNew_Card_PauseInbox_Title),
        iconName: ControlIcons.MailPause,
        body: <PauseInboxCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('tri-pauseInbox') || isConsumer()),
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_PauseInbox.gif')}
            />
        ),
    };
}

export default pauseInboxCardProps;
