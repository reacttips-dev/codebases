import {
    whatsNew_Card_SmartSearch_Body,
    whatsNew_Card_SmartSearch_Title,
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

export const SmartSearchCard = observer(function SmartSearchCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.SmartSearch);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_SmartSearch_Body)}</div>;
});

function smartSearchCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.SmartSearch,
        title: loc(whatsNew_Card_SmartSearch_Title),
        iconName: ControlIcons.Search,
        body: <SmartSearchCard />,
        animation: (
            <img
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl('WN_SmartSearch_600x400_24.gif')}
            />
        ),
    };
}

export default smartSearchCardProps;
