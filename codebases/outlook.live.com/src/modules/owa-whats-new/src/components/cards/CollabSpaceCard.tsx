import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_CollabSpace_Title,
    whatsNew_Card_CollabSpace_Body,
    whatsNew_Card_CollabSpace_AltText,
    whatsNew_Card_TryIt_Button,
} from '../../strings.locstring.json';
import { FluidOwaSource, isFluidEnabledForSource } from 'owa-fluid-validations';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { getIsDarkTheme } from 'owa-fabric-theme';
import EventScope from 'owa-service/lib/contract/EventScope';
import type { CreateCollabSpaceOnInitProps } from 'owa-calendar-helpers-types';
import { lazyPopoutCalendarCompose } from 'owa-popout-calendar';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.CollabSpace);

    const createCollabSpaceOnInitProps: CreateCollabSpaceOnInitProps = {
        shouldCreateCollabSpace: true,
        collabSpaceCreationSource: 'WhatsNewCard',
    };

    lazyPopoutCalendarCompose.importAndExecute(
        null /* calendarEvent */,
        'CollabSpaceWhatsNewCard',
        false /* eventHasUpdates */,
        undefined /* shouldDuplicate */,
        EventScope.Default,
        createCollabSpaceOnInitProps
    );
}

export const CollabSpaceCard = observer(function CollabSpaceCard() {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.CollabSpace);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_CollabSpace_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.CollabSpace}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function CalendarBoardCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.CollabSpace,
        title: loc(whatsNew_Card_CollabSpace_Title),
        iconName: ControlIcons.SharedNotes,
        body: <CollabSpaceCard />,
        isHidden: () => Promise.resolve(!isFluidEnabledForSource(FluidOwaSource.CalendarCompose)),
        animation: (
            <img
                alt={loc(whatsNew_Card_CollabSpace_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl(
                    `wn-collabspace-${getIsDarkTheme() ? 'dark' : 'light'}.gif`
                )}
            />
        ),
    };
}

export default CalendarBoardCardProps;
