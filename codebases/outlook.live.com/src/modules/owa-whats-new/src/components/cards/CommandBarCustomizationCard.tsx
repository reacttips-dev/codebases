import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_CommandBarCustomization_Body,
    whatsNew_Card_CommandBarCustomization_Title,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { lazyOnOpenEditor } from 'owa-mail-commandbar-editor';
import { getIsViewModeSelected } from 'owa-command-ribbon-store';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.CommandBarCustomization);

    lazyOnOpenEditor.importAndExecute();
}

export const CommandBarCustomizationCard = observer(function CommandBarCustomizationCard() {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.CommandBarCustomization);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_CommandBarCustomization_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.CommandBarCustomization}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function CommandBarCustomizationCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.CommandBarCustomization,
        title: loc(whatsNew_Card_CommandBarCustomization_Title),
        iconName: ControlIcons.CustomizeToolbar,
        body: <CommandBarCustomizationCard />,
        isHidden: () =>
            Promise.resolve(
                !(
                    getIsViewModeSelected(CommandingViewMode.CommandBar) &&
                    isFeatureEnabled('tri-commandBarCustomization') &&
                    !isBrowserIE()
                )
            ),
    };
}

export default CommandBarCustomizationCardProps;
