import type AutomaticRepliesOptionState from '../data/store/schema/AutomaticRepliesOptionState';
import createRibbonViewState from 'owa-editor-ribbonplugin/lib/utils/createRibbonViewState';
import createEditorViewState from 'owa-editor/lib/utils/createEditorViewState';
import mapPeopleIdentityToRecipientWellWithFindControlViewState from './mapPeopleIdentityToRecipientWellWithFindControlViewState';
import EditorScenarios from 'owa-editor/lib/store/schema/EditorScenarios';

/**
 * Utility function to get automatic replies state default value
 * @returns instance of AutomaticRepliesOptionState type
 */
export default function getAutomaticRepliesOptionStateDefaultValue(): AutomaticRepliesOptionState {
    return {
        editorViewStateMessage: createEditorViewState(
            EditorScenarios.AutoReply,
            null /*content*/,
            false /*isDirty*/
        ),
        editorViewStateDeclineMeeting: createEditorViewState(
            EditorScenarios.AutoReplyDecline,
            null /*content*/,
            false /*isDirty*/
        ),
        editorViewStateOutsideOrg: createEditorViewState(
            EditorScenarios.AutoReplyOutside,
            null /*content*/,
            false /*isDirty*/
        ),
        ribbon: createRibbonViewState(),
        periodicReplyEnabled: null,
        isAutomaticReplyEnabled: null,
        blockCalendarEnabled: null,
        blockCalendarTitle: null,
        oofCalendarEventRecipientWellViewState: mapPeopleIdentityToRecipientWellWithFindControlViewState(
            []
        ),
        blockCalendarReminderOffset: null,
        blockCalendarReminderMessageViewState: createEditorViewState(
            EditorScenarios.AutoReplyBlock,
            null /*content*/,
            false /*isDirty*/
        ),
        declineNewInvitationsEnabled: null,
        declineExistingCalendarEventsEnabled: null,
        sendRepliesToContactsOnlyEnabled: null,
        sendRepliesOutsideOrgEnabled: null,
        startDate: null,
        endDate: null,
        declineMeetingSelectedCategoryKey: null,
        calendarViewItems: [],
        customReminderDropdownOptionSelected: null,
        customReminderDropdownDate: null,
    };
}
