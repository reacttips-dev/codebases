import { draftSavedOnText } from './SentReceivedSavedTime.locstring.json';
import loc from 'owa-localize';
import { formatWeekDayDateTime, userDate } from 'owa-datetime';
import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';

import * as React from 'react';

export interface SentReceivedSavedTimeProps {
    time: string;
    className?: string;
    treatAsDraft?: boolean;
    isDeferredSend?: boolean;
}

const SentReceivedSavedTime = observer(function SentReceivedSavedTime(
    props: SentReceivedSavedTimeProps
) {
    let dateText = props.treatAsDraft && !props.isDeferredSend ? loc(draftSavedOnText) + ' ' : '';

    // The time here comes directly from the item via server response. Rarely it appears to be undefined (VSO #25779).
    // When this happens, just fallback to an empty string to avoid component errors.
    const formattedDate = props.time ? formatWeekDayDateTime(userDate(props.time)) : '';
    dateText += formattedDate;

    return (
        <div className={props.className}>
            {props.isDeferredSend && <Icon iconName={ControlIcons.Clock} />}
            {dateText}
        </div>
    );
});

export default SentReceivedSavedTime;
