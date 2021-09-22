import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_CreateNotesFromMessage_Title,
    whatsNew_Card_CreateNotesFromMessage_Body,
} from '../../strings.locstring.json';

export const CreateNotesFromMessageCard = observer(function CreateNotesFromMessageCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.CreateNotesFromMessage);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_CreateNotesFromMessage_Body)}</div>;
});

function CreateNotesFromMessageCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.CreateNotesFromMessage,
        title: loc(whatsNew_Card_CreateNotesFromMessage_Title),
        iconName: ControlIcons.QuickNote,
        body: <CreateNotesFromMessageCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('rp-userMarkup')),
    };
}

export default CreateNotesFromMessageCardProps;
