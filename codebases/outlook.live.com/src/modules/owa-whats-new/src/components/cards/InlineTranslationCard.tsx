import {
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_InlineTranslation_Body,
    whatsNew_Card_InlineTranslation_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import { showWhatsNewCallout } from '../WhatsNewCallout';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.InlineTranslation);

    // Navigate to Message Handling settings.
    lazyMountAndShowFullOptions.importAndExecute('mail', 'handling', 'inlineTranslation');

    // Show a callout and anchor it to the translation options.
    showWhatsNewCallout(WhatsNewCardIdentity.InlineTranslation, () =>
        document.getElementById('translationOptions')
    );
}

export const InlineTranslationCard = observer(function InlineTranslationCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.InlineTranslation);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_InlineTranslation_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.InlineTranslation}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function inlineTranslationCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.InlineTranslation,
        title: loc(whatsNew_Card_InlineTranslation_Title),
        iconName: ControlIcons.MicrosoftTranslatorLogo,
        body: <InlineTranslationCard />,
    };
}

export default inlineTranslationCardProps;
