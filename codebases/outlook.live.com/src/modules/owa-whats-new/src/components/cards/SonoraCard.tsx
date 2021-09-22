import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import isSonoraPluginEnabled from 'owa-editor-sonora-plugin/lib/utils/isSonoraPluginEnabled';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_Sonora_Title,
    whatsNew_Card_Sonora_Body,
} from '../../strings.locstring.json';

export const SonoraCard = observer(function SonoraCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.Sonora);
    }, []);

    return <div tabIndex={0}>{loc(whatsNew_Card_Sonora_Body)}</div>;
});

function SonoraCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.Sonora,
        title: loc(whatsNew_Card_Sonora_Title),
        iconName: ControlIcons.Search,
        body: <SonoraCard />,
        isHidden: () => Promise.resolve(!isSonoraPluginEnabled()),
    };
}

export default SonoraCardProps;
