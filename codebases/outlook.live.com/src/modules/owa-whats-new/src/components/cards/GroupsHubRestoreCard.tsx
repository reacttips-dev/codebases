import {
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_GroupsHub_Title,
    whatsNew_Card_GroupsHubWithSecondGif_Body,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { onGroupsHubCardTryItClicked } from '../../utils/onGroupsHubCardTryItClicked';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.GroupsHubRestore);

    onGroupsHubCardTryItClicked(false);
}

export const GroupsHubRestoreCard = observer(function GroupsHubRestoreCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.GroupsHubRestore);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_GroupsHubWithSecondGif_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.GroupsHubRestore}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function groupsHubRestoreCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.GroupsHubRestore,
        title: loc(whatsNew_Card_GroupsHub_Title),
        iconName: ControlIcons.People,
        body: <GroupsHubRestoreCard />,
        isHidden: () => Promise.resolve(!isGroupsEnabled()),
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('Web_Mail_GroupsHubRestore.gif')}
            />
        ),
    };
}

export default groupsHubRestoreCardProps;
