import { observer } from 'mobx-react-lite';
import { conflictInfo, eventCanceled } from './MailListItemMeetingInfo.locstring.json';
import shouldMeetingItemShowRSVP from 'owa-listview-rsvp/lib/utils/shouldMeetingItemShowRSVP';
import loc, { format } from 'owa-localize';
import { noConflictsLabel } from 'owa-locstrings/lib/strings/noconflictslabel.locstring.json';
import getMeetingItem from 'owa-meeting-message/lib/utils/getMeetingItem';
import { getFutureConflictingMeetingsCountAndSubject } from 'owa-meeting-message/lib/utils/getMeetingRequestConflicts';
import isMeetingCancellation from 'owa-meeting-message/lib/utils/isMeetingCancellation';
import isMeetingRequest from 'owa-meeting-message/lib/utils/isMeetingRequest';
import { observableToday } from 'owa-observable-datetime';
import { MeetingMessageButton, MeetingMessageButtonEntrySource } from 'owa-rsvp-peek';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { lazyOnRemoveMeeting } from 'owa-mail-triage-action';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';
import { PropertyIcon } from './shared/IconBar';
import { getPropertyIconStyle, PropertyIcons } from 'owa-mail-list-actions';
import formatMeetingTimeSpan from 'owa-timeformat/lib/utils/formatMeetingTimeSpan';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getMeetingInviteTheme } from 'owa-mail-densities/lib/utils/getMeetingInviteTheme';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './MailListItemMeetingInfo.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListItemMeetingInfoProps {
    latestItemId: string;
    isSingleLineView: boolean;
    tableViewId: string;
    conversationId: string;
    listViewType: ReactListViewType;
    isSelected: boolean;
    itemClassIcon?: PropertyIcons;
}

export default observer(function MailListItemMeetingInfo(props: MailListItemMeetingInfoProps) {
    const {
        latestItemId,
        tableViewId,
        conversationId,
        listViewType,
        isSelected,
        isSingleLineView,
    } = props;
    const renderMeetingInfo = (): JSX.Element => {
        const densityModeString = getDensityModeString();
        const meetingItem = getMeetingItem(latestItemId);
        // The item is not on store yet or does not have all the properties we need
        if (!meetingItem) {
            return null;
        }
        // Checks if this meeting item will be shown
        if (!shouldMeetingItemShowRSVP(meetingItem)) {
            return null;
        }
        let meetingInfoString = null;
        let numberString = null;
        if (isMeetingRequest(meetingItem.ItemClass)) {
            const futureConflictingInfo = getFutureConflictingMeetingsCountAndSubject(
                meetingItem as MeetingRequestMessageType,
                observableToday()
            );
            if (futureConflictingInfo.conflictingMeetingCount > 0) {
                numberString =
                    futureConflictingInfo.conflictingMeetingCount > 1
                        ? futureConflictingInfo.conflictingMeetingCount - 1
                        : null;
                meetingInfoString = format(
                    loc(conflictInfo),
                    futureConflictingInfo.conflictingMeetingSubject
                );
            } else {
                meetingInfoString = loc(noConflictsLabel);
            }
        }
        if (isMeetingCancellation(meetingItem.ItemClass)) {
            meetingInfoString = loc(eventCanceled);
        }

        const hasDensityNext = isFeatureEnabled('mon-densities');
        const hasExtendedMeetingPreview = isFeatureEnabled('mon-tri-mailListMeetingInvite');
        const meetingTimeSpan = hasExtendedMeetingPreview
            ? formatMeetingTimeSpan(meetingItem.Start, meetingItem.End, meetingItem.Recurrence)
            : null;

        const getMeetingPropertyIconProps = () => {
            const iconProps = getPropertyIconStyle(props.itemClassIcon);
            iconProps.iconClasses = classNames(
                iconProps.iconClasses,
                styles.monarchIconPadding,
                isSingleLineView && styles.iconMargin
            );
            return iconProps;
        };
        const getExtendedMeetingPreview = () => {
            return (
                <div
                    className={classNames(
                        isSingleLineView && styles.meetingMessageButtonSLV,
                        isSingleLineView ? styles.meetingInfoSingleLine : styles.meetingInfo3Column,
                        !hasDensityNext && !isSingleLineView && styles.meetingInfoPadding,
                        isSelected && styles.monarchItemSelected,
                        !isSingleLineView && hasDensityNext && densityModeString,
                        !isSingleLineView && styles.monarch3ColumnContainer
                    )}>
                    {props.itemClassIcon &&
                        props.itemClassIcon !== PropertyIcons.None &&
                        !isSingleLineView && (
                            <PropertyIcon
                                key={props.itemClassIcon.toString()}
                                {...getMeetingPropertyIconProps()}
                            />
                        )}
                    {!isSingleLineView && (
                        <div className={styles.monarchSecondColumn}>
                            <div
                                title={meetingTimeSpan}
                                className={classNames(
                                    styles.meetingInfoText,
                                    hasDensityNext && styles.meetingInfoTextNext,
                                    hasDensityNext && densityModeString,
                                    styles.time
                                )}>
                                {meetingTimeSpan}
                            </div>
                            <div
                                title={meetingInfoString}
                                className={classNames(
                                    styles.meetingInfoText,
                                    hasDensityNext && styles.meetingInfoSubText,
                                    hasDensityNext && densityModeString,
                                    styles.conflicts
                                )}>
                                {meetingInfoString}
                                {numberString && ' +' + numberString}
                            </div>
                        </div>
                    )}
                    <MeetingMessageButton
                        item={meetingItem}
                        entrySource={getMeetingMessageButtonEntrySource()}
                        onRemoveMeeting={removeMeetingClicked}
                        isSelected={isSelected}
                    />
                </div>
            );
        };

        const getMeetingPreview = () => {
            return (
                <div
                    className={
                        isSingleLineView ? styles.meetingInfoSingleLine : styles.meetingInfo3Column
                    }>
                    {meetingInfoString && (
                        <div
                            className={
                                isSingleLineView
                                    ? styles.meetingInfoTextContainerSLV
                                    : styles.meetingInfoTextContainer
                            }>
                            <span className={styles.meetingInfoText}>{meetingInfoString}</span>
                            {numberString && <span>{'+' + numberString}</span>}
                        </div>
                    )}
                    <div
                        className={classNames(
                            isSingleLineView
                                ? styles.meetingMessageButtonSLV
                                : styles.meetingMessageButton,
                            !isSingleLineView && hasDensityNext && densityModeString
                        )}>
                        <MeetingMessageButton
                            item={meetingItem}
                            entrySource={getMeetingMessageButtonEntrySource()}
                            onRemoveMeeting={removeMeetingClicked}
                            isSelected={isSelected}
                        />
                    </div>
                </div>
            );
        };
        return (
            <ThemeProvider
                applyTo="none"
                theme={getMeetingInviteTheme(densityModeString, isSingleLineView)}>
                {hasExtendedMeetingPreview ? getExtendedMeetingPreview() : getMeetingPreview()}
            </ThemeProvider>
        );
    };
    const removeMeetingClicked = () => {
        lazyOnRemoveMeeting.import().then(onRemoveMeeting => {
            onRemoveMeeting(tableViewId, conversationId);
        });
    };
    const getMeetingMessageButtonEntrySource = (): MeetingMessageButtonEntrySource => {
        switch (listViewType) {
            case ReactListViewType.Conversation:
                return MeetingMessageButtonEntrySource.LVConversation;
            case ReactListViewType.Message:
                return MeetingMessageButtonEntrySource.LVMessage;
            case ReactListViewType.CalendarItems:
                return MeetingMessageButtonEntrySource.LVCalendarItems;
            default:
                throw new Error(`Unhandled List View Type: ${listViewType}`);
        }
    };
    return renderMeetingInfo();
});
