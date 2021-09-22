import {
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_GroupsHubWithFirstGif_Body,
    whatsNew_Card_GroupsHub_Title,
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
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.GroupsHubPendingMembership);

    onGroupsHubCardTryItClicked(true);
}

export const GroupsHubPendingMembershipCard = observer(
    function GroupsHubPendingMembershipCard(props: {}) {
        React.useEffect(() => {
            logWhatsNewCardShown(WhatsNewCardIdentity.GroupsHubPendingMembership);
        }, []);

        return (
            <>
                <div tabIndex={0}>{loc(whatsNew_Card_GroupsHubWithFirstGif_Body)}</div>
                <WhatsNewActionLink
                    onClick={onTryItClicked}
                    whatsNewCardIdentity={WhatsNewCardIdentity.GroupsHubPendingMembership}
                    whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
                />
            </>
        );
    }
);

function groupsHubPendingMembershipCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.GroupsHubPendingMembership,
        title: loc(whatsNew_Card_GroupsHub_Title),
        iconName: ControlIcons.People,
        body: <GroupsHubPendingMembershipCard />,
        isHidden: () => Promise.resolve(!isGroupsEnabled()),
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('Web_Mail_GroupsHubPendingMembership.gif')}
            />
        ),
    };
}

export default groupsHubPendingMembershipCardProps;
