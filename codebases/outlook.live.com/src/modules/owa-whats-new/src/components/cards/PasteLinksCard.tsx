import {
    whatsNew_Card_PasteLinks_Body,
    whatsNew_Card_PasteLinks_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export const PasteLinksCard = observer(function PasteLinksCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.PasteLinks);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_PasteLinks_Body)}</div>;
});

function PasteLinksCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.PasteLinks,
        title: loc(whatsNew_Card_PasteLinks_Title),
        iconName: ControlIcons.PageLink,
        body: <PasteLinksCard />,
        isHidden: () => Promise.resolve(isConsumer()),
    };
}

export default PasteLinksCardProps;
