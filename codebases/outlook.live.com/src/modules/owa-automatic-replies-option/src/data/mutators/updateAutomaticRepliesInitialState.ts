import getStore from '../store/store';
import { mutatorAction } from 'satcheljs';
import type AutomaticRepliesOptionState from '../store/schema/AutomaticRepliesOptionState';
import DeclineMeetingSelectionState from '../store/schema/DeclineMeetingSelectionState';

export default mutatorAction(
    'updateAutomaticRepliesInitialState',
    function updateAutomaticRepliesInitialState(data: AutomaticRepliesOptionState) {
        let initialState = getStore().initialState;
        initialState.blockCalendarEnabled = data.blockCalendarEnabled;
        initialState.blockCalendarTitle = data.blockCalendarTitle;
        initialState.oofCalendarEventRecipientWellViewState =
            data.oofCalendarEventRecipientWellViewState;
        initialState.blockCalendarReminderOffset =
            data.blockCalendarReminderOffset != null ? data.blockCalendarReminderOffset : 0;
        initialState.customReminderDropdownOptionSelected =
            data.customReminderDropdownOptionSelected;
        initialState.blockCalendarReminderMessageViewState = data.blockCalendarReminderMessageViewState
            ? { ...data.blockCalendarReminderMessageViewState }
            : null;
        initialState.declineExistingCalendarEventsEnabled =
            data.declineExistingCalendarEventsEnabled;
        initialState.declineNewInvitationsEnabled = data.declineNewInvitationsEnabled;
        initialState.editorViewStateMessage = data.editorViewStateMessage
            ? { ...data.editorViewStateMessage }
            : null;
        initialState.editorViewStateDeclineMeeting = data.editorViewStateDeclineMeeting
            ? { ...data.editorViewStateDeclineMeeting }
            : null;
        initialState.editorViewStateOutsideOrg = data.editorViewStateOutsideOrg
            ? { ...data.editorViewStateOutsideOrg }
            : null;
        initialState.endDate = data.endDate;
        initialState.isAutomaticReplyEnabled = data.isAutomaticReplyEnabled;
        initialState.periodicReplyEnabled = data.periodicReplyEnabled;
        initialState.sendRepliesToContactsOnlyEnabled = data.sendRepliesToContactsOnlyEnabled;
        initialState.sendRepliesOutsideOrgEnabled = data.sendRepliesOutsideOrgEnabled;
        initialState.startDate = data.startDate;
        initialState.declineMeetingSelectedCategoryKey =
            DeclineMeetingSelectionState.CreateNewMessage;
        initialState.customReminderDropdownOptionSelected =
            data.customReminderDropdownOptionSelected;
    }
);
