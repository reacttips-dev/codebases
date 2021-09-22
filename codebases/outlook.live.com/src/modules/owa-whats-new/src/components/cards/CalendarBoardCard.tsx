import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { observer } from 'mobx-react-lite';
import {
    canUseCalendarBoard,
    openCalendarBoardInNewWindow,
    openCalendarBoardView,
} from 'owa-calendar-board-launch';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { ControlIcons } from 'owa-control-icons';
import { getIsDarkTheme } from 'owa-fabric-theme';
import loc from 'owa-localize';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import * as React from 'react';
import {
    whatsNew_Card_CalendarBoard_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_CalendarBoard_Title,
    whatsNew_Card_CalendarBoard_AltText,
} from '../../strings.locstring.json';

import styles from '../WhatsNewFluentCard.scss';

function onTryItClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.CalendarBoard);

    // Navigate user to Board view
    if (getOwaWorkload() === OwaWorkload.Calendar) {
        // fire action to trigger Calendar module orchestrator and switch to Board view
        openCalendarBoardView();
    } else {
        // launch Board view in new window
        openCalendarBoardInNewWindow();
    }
}

export const CalendarBoardCard = observer(function CalendarBoard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.CalendarBoard);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_CalendarBoard_Body)}</div>
            <WhatsNewActionLink
                onClick={onTryItClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.CalendarBoard}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function CalendarBoardCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.CalendarBoard,
        title: loc(whatsNew_Card_CalendarBoard_Title),
        iconName: ControlIcons.Taskboard,
        body: <CalendarBoardCard />,
        isHidden: () => Promise.resolve(!canUseCalendarBoard()),
        animation: (
            <img
                alt={loc(whatsNew_Card_CalendarBoard_AltText)}
                className={styles.whatsNewCardAnimation}
                src={getOwaResourceImageUrl(
                    `wn-calendarboard-${getIsDarkTheme() ? 'dark' : 'light'}.gif`
                )}
            />
        ),
    };
}

export default CalendarBoardCardProps;
