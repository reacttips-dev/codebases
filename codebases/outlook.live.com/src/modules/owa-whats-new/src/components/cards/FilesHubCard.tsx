import {
    whatsNew_Card_FileHub_Body,
    whatsNew_Card_FileHub_Title,
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

export const FilesHubCard = observer(function FilesHubCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.FilesHub);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_FileHub_Body)}</div>;
});

function filesHubCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.FilesHub,
        title: loc(whatsNew_Card_FileHub_Title),
        iconName: ControlIcons.Attach,
        body: <FilesHubCard />,
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_Attachments_600x400_24.gif')}
            />
        ),
    };
}

export default filesHubCardProps;
