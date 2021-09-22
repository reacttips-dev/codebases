import { observer } from 'mobx-react-lite';
import { highlightTermsInHtmlElement } from 'owa-highlight';
import getMeetingItem from 'owa-meeting-message/lib/utils/getMeetingItem';
import shouldMeetingItemShowRSVP from 'owa-listview-rsvp/lib/utils/shouldMeetingItemShowRSVP';
import formatMeetingTimeSpan from 'owa-timeformat/lib/utils/formatMeetingTimeSpan';
import renderMeetingPreviewPlaceHolder from './MailListItemMeetingPreviewPlaceholder';
import * as React from 'react';

import styles from './MailListItem.scss';
export interface MailListItemMeetingPreviewProps {
    highlightTerms: string[];
    latestItemId: string;
    originalPreview: string;
}

export default observer(function MailListItemMeetingPreview(
    props: MailListItemMeetingPreviewProps
) {
    const { highlightTerms, latestItemId, originalPreview } = props;
    const highLightTerms = (element: HTMLElement) => {
        highlightTermsInHtmlElement(element, highlightTerms);
    };
    const renderMeetingPreview = (): JSX.Element => {
        const meetingItem = getMeetingItem(latestItemId);
        // The item is not on store yet or does not have all the properties we need
        if (!meetingItem) {
            return renderMeetingPreviewPlaceHolder();
        }
        // Checks if this meeting item will be shown, othewise fallback to original preview
        if (!shouldMeetingItemShowRSVP(meetingItem)) {
            return (
                <span className={styles.previewDisplayText} ref={highLightTerms}>
                    {originalPreview}
                </span>
            );
        }
        return (
            <>
                <span className={styles.previewDisplayText} ref={highLightTerms}>
                    {formatMeetingTimeSpan(
                        meetingItem.Start,
                        meetingItem.End,
                        !meetingItem.RecurrenceId /* ideally we would check CalendarItemType but it seems broken */
                            ? meetingItem.Recurrence
                            : undefined /* recurrenceId indicates instance */,
                        true // short string
                    )}
                </span>
            </>
        );
    };
    return renderMeetingPreview();
});
