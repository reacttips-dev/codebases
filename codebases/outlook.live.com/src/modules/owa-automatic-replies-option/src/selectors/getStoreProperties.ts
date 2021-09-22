import getStore from '../data/store/store';
import { getFallbackValueIfNull } from 'owa-options-core';
import DeclineMeetingSelectionState from '../data/store/schema/DeclineMeetingSelectionState';

export function getIsAutomaticReplyEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.isAutomaticReplyEnabled,
        initialState.isAutomaticReplyEnabled
    );
}

export function getIsAutomaticReplyNotificationSavedSetting() {
    return getStore().initialState.isAutomaticReplyEnabled;
}

export function getPeriodicReplyEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.periodicReplyEnabled,
        initialState.periodicReplyEnabled
    );
}

export function getBlockCalendarEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.blockCalendarEnabled,
        initialState.blockCalendarEnabled
    );
}

export function getBlockCalendarTitle() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(optionsState.blockCalendarTitle, initialState.blockCalendarTitle);
}

export function getOOFCalendarEventRecipientWellViewState() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    if (optionsState.oofCalendarEventRecipientWellViewState.isDirty) {
        return optionsState.oofCalendarEventRecipientWellViewState;
    }
    return initialState.oofCalendarEventRecipientWellViewState;
}

export function getBlockCalendarReminderOffset() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.blockCalendarReminderOffset,
        initialState.blockCalendarReminderOffset
    );
}

export function getCustomReminderDropdownOptionSelected() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.customReminderDropdownOptionSelected,
        initialState.customReminderDropdownOptionSelected
    );
}

export function getCustomReminderDropdownDate() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.customReminderDropdownDate,
        initialState.customReminderDropdownDate
    );
}

export function getBlockCalendarReminderMessageContent() {
    return getBlockCalendarReminderMessageViewState().content;
}

export function getBlockCalendarReminderMessageViewState() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return optionsState.blockCalendarReminderMessageViewState.content == null
        ? initialState.blockCalendarReminderMessageViewState
        : optionsState.blockCalendarReminderMessageViewState;
}

export function getDeclineExistingCalendarEventsEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.declineExistingCalendarEventsEnabled,
        initialState.declineExistingCalendarEventsEnabled
    );
}

export function getDeclineNewInvitationsEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.declineNewInvitationsEnabled,
        initialState.declineNewInvitationsEnabled
    );
}

export function getEditorViewStateMessageContent() {
    return getEditorViewState().content;
}

export function getEditorViewState() {
    const optionsState = getStore().currentState;
    const initialState = getStore().initialState;
    return optionsState.editorViewStateMessage.content == null
        ? initialState.editorViewStateMessage
        : optionsState.editorViewStateMessage;
}

export function getEditorViewStateDeclineMeetingContent() {
    return getEditorViewStateDeclineMeeting().content;
}

export function getEditorViewStateDeclineMeeting() {
    const optionsState = getStore().currentState;
    const initialState = getStore().initialState;
    return optionsState.editorViewStateDeclineMeeting.content == null
        ? initialState.editorViewStateDeclineMeeting
        : optionsState.editorViewStateDeclineMeeting;
}

export function getEditorViewStateOutsideOrgContent() {
    return getEditorViewStateOutsideOrg().content;
}

export function getEditorViewStateOutsideOrg() {
    const optionsState = getStore().currentState;
    const initialState = getStore().initialState;
    return optionsState.editorViewStateOutsideOrg.content == null
        ? initialState.editorViewStateOutsideOrg
        : optionsState.editorViewStateOutsideOrg;
}

export function getSendRepliesOutsideOrgEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.sendRepliesOutsideOrgEnabled,
        initialState.sendRepliesOutsideOrgEnabled
    );
}

export function getSendRepliesToContactsOnlyEnabled() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(
        optionsState.sendRepliesToContactsOnlyEnabled,
        initialState.sendRepliesToContactsOnlyEnabled
    );
}

export function getStartDate() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(optionsState.startDate, initialState.startDate);
}

export function getEndDate() {
    let optionsState = getStore().currentState;
    let initialState = getStore().initialState;
    return getFallbackValueIfNull(optionsState.endDate, initialState.endDate);
}

export function getDeclineMeetingSelectedCategoryKey(): DeclineMeetingSelectionState {
    let optionsState = getStore().currentState;
    return getFallbackValueIfNull(
        optionsState.declineMeetingSelectedCategoryKey,
        DeclineMeetingSelectionState.UseAutomaticReplyMessage
    );
}
