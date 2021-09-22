import { userDate } from 'owa-datetime';
import EditorScenarios from 'owa-editor/lib/store/schema/EditorScenarios';
import createEditorViewState from 'owa-editor/lib/utils/createEditorViewState';
import ExternalAudience from 'owa-service/lib/contract/ExternalAudience';
import type MailboxAutoReplyConfigurationOptions from 'owa-service/lib/contract/MailboxAutoReplyConfigurationOptions';
import OofState from 'owa-service/lib/contract/OofState';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type AutomaticRepliesOptionState from '../data/store/schema/AutomaticRepliesOptionState';
import getAutomaticRepliesOptionStateDefaultValue from './getAutomaticRepliesOptionStateDefaultValue';

/**
 * Utility function to parse mailbox auto reply configuration options
 * @returns state of type AutomaticRepliesOptionState
 */
export default function parseMailboxAutoReplyConfiguration(
    mailboxAutoReplyConfigurationOptions: MailboxAutoReplyConfigurationOptions
): AutomaticRepliesOptionState {
    const optionState: AutomaticRepliesOptionState = getAutomaticRepliesOptionStateDefaultValue();

    optionState.isAutomaticReplyEnabled =
        mailboxAutoReplyConfigurationOptions.AutoReplyState === OofState.Enabled ||
        mailboxAutoReplyConfigurationOptions.AutoReplyState === OofState.Scheduled;

    optionState.periodicReplyEnabled =
        mailboxAutoReplyConfigurationOptions.AutoReplyState === OofState.Scheduled;

    optionState.blockCalendarEnabled = mailboxAutoReplyConfigurationOptions.CreateOOFEvent;

    optionState.blockCalendarTitle = mailboxAutoReplyConfigurationOptions.OOFEventSubject;

    optionState.declineNewInvitationsEnabled =
        mailboxAutoReplyConfigurationOptions.AutoDeclineFutureRequestsWhenOOF;

    optionState.declineExistingCalendarEventsEnabled =
        mailboxAutoReplyConfigurationOptions.DeclineEventsForScheduledOOF;

    optionState.sendRepliesToContactsOnlyEnabled =
        mailboxAutoReplyConfigurationOptions.ExternalAudience === ExternalAudience.Known;

    optionState.sendRepliesOutsideOrgEnabled =
        mailboxAutoReplyConfigurationOptions.ExternalAudience === ExternalAudience.Known ||
        mailboxAutoReplyConfigurationOptions.ExternalAudience === ExternalAudience.All;

    const isEnterpriseUser = !isConsumer();
    if (isEnterpriseUser) {
        optionState.editorViewStateMessage = createEditorViewState(
            EditorScenarios.AutoReply,
            mailboxAutoReplyConfigurationOptions.InternalMessage,
            false
        );
        optionState.editorViewStateOutsideOrg = createEditorViewState(
            EditorScenarios.AutoReplyOutside,
            mailboxAutoReplyConfigurationOptions.ExternalMessage,
            false
        );
    } else {
        optionState.editorViewStateMessage = createEditorViewState(
            EditorScenarios.AutoReply,
            mailboxAutoReplyConfigurationOptions.ExternalMessage,
            false
        );
    }

    // Check condition if the value can be null or empty string
    optionState.startDate = userDate(mailboxAutoReplyConfigurationOptions.StartTime);
    optionState.endDate = userDate(mailboxAutoReplyConfigurationOptions.EndTime);

    return optionState;
}
