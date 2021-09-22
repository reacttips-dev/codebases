import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getUserConfiguration } from 'owa-session-store';
import { openNotesFolder } from '../../actions/openNotesFolder';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_StickyNotes_Title,
    whatsNew_Card_StickyNotes_Body,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.StickyNotes);

    openNotesFolder('WhatsNew');
}

export const StickyNotesCard = observer(function StickyNotesCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.StickyNotes);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_StickyNotes_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.StickyNotes}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function StickyNotesCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.StickyNotes,
        title: loc(whatsNew_Card_StickyNotes_Title),
        iconName: ControlIcons.QuickNote,
        body: <StickyNotesCard />,
        isHidden: () =>
            Promise.resolve(
                !(
                    getUserConfiguration().SegmentationSettings.StickyNotes &&
                    isFeatureEnabled('cal-stickyNotesFolder') &&
                    isFeatureEnabled('notes-folder-view')
                )
            ),
    };
}

export default StickyNotesCardProps;
