import PropertyIcons from './PropertyIcons';
import { ControlIcons } from 'owa-control-icons';
import { MailIcons } from 'owa-mail-icons';
import { default as Attach } from 'owa-fluent-icons-svg/lib/icons/AttachRegular';
import { default as Mention } from 'owa-fluent-icons-svg/lib/icons/MentionRegular';
import { default as Link } from 'owa-fluent-icons-svg/lib/icons/LinkRegular';
import { default as ThumbLike } from 'owa-fluent-icons-svg/lib/icons/ThumbLikeRegular';
import { default as Clock } from 'owa-fluent-icons-svg/lib/icons/ClockRegular';
import { default as ArrowReply } from 'owa-fluent-icons-svg/lib/icons/ArrowReplyRegular';
import { default as ArrowForward } from 'owa-fluent-icons-svg/lib/icons/ArrowForwardRegular';
import { default as LockClosed } from 'owa-fluent-icons-svg/lib/icons/LockClosedRegular';
import { default as CalendarEmpty } from 'owa-fluent-icons-svg/lib/icons/CalendarEmptyRegular';
import { default as CalendarCheckmark } from 'owa-fluent-icons-svg/lib/icons/CalendarCheckmarkRegular';
import { default as CalendarCancel } from 'owa-fluent-icons-svg/lib/icons/CalendarCancelRegular';
import { default as CalendarQuestionMark } from 'owa-fluent-icons-svg/lib/icons/CalendarQuestionMarkRegular';
import { default as Voicemail } from 'owa-fluent-icons-svg/lib/icons/VoicemailRegular';
import { default as ArrowDown } from 'owa-fluent-icons-svg/lib/icons/ArrowDownRegular';
import { default as Important } from 'owa-fluent-icons-svg/lib/icons/ImportantFilled';
import { default as CheckboxChecked } from 'owa-fluent-icons-svg/lib/icons/CheckboxCheckedRegular';
import { default as CalendarSync } from 'owa-fluent-icons-svg/lib/icons/CalendarSyncRegular';
import { default as Notepad } from 'owa-fluent-icons-svg/lib/icons/NotepadRegular';
import { default as Note } from 'owa-fluent-icons-svg/lib/icons/NoteRegular';
import { default as ArrowCircleRight } from 'owa-fluent-icons-svg/lib/icons/ArrowCircleRightRegular';
import { default as DoorArrowLeft } from 'owa-fluent-icons-svg/lib/icons/DoorArrowLeftRegular';
import { default as CheckmarkCircle } from 'owa-fluent-icons-svg/lib/icons/CheckmarkCircleRegular';

import classname from 'classnames';
import styles from './propertyIcons.scss';

export default function getPropertyIcon(
    propertyIcon: PropertyIcons,
    hasDensityNext?: boolean
): { iconClasses?: string; iconName: string } {
    switch (propertyIcon) {
        case PropertyIcons.ReadGlobalMentionedMe:
            return {
                iconClasses: classname(styles.accountsRead),
                iconName: hasDensityNext ? Mention : ControlIcons.Accounts,
            }; // Read
        case PropertyIcons.GlobalMentionedMe:
            return {
                iconClasses: classname(styles.accounts, hasDensityNext && styles.accountsNext),
                iconName: hasDensityNext ? Mention : ControlIcons.Accounts,
            };
        case PropertyIcons.Attachment:
            return {
                iconName: hasDensityNext ? Attach : ControlIcons.Attach,
            };
        case PropertyIcons.ImportanceLow:
            return {
                iconName: hasDensityNext ? ArrowDown : ControlIcons.Down,
            };
        case PropertyIcons.ImportanceHigh:
            return {
                iconClasses: classname(styles.redDark, hasDensityNext && styles.redDarkNext),
                iconName: hasDensityNext ? Important : ControlIcons.Important,
            };
        case PropertyIcons.Like:
            return {
                iconName: hasDensityNext ? ThumbLike : ControlIcons.Like,
            };
        case PropertyIcons.Snooze:
            return {
                iconClasses: classname(styles.snooze, hasDensityNext && styles.snoozeNext),
                iconName: hasDensityNext ? Clock : ControlIcons.Clock,
            };
        case PropertyIcons.MailListViewReplied:
            return {
                iconName: hasDensityNext ? ArrowReply : ControlIcons.Reply,
            };
        case PropertyIcons.MailListViewForwarded:
            return {
                iconName: hasDensityNext ? ArrowForward : ControlIcons.Forward,
            };
        case PropertyIcons.MailListViewIRM:
        case PropertyIcons.MailListViewIRMReplied:
        case PropertyIcons.MailListViewIRMForwarded:
            return {
                iconName: hasDensityNext ? LockClosed : ControlIcons.Lock,
            };
        case PropertyIcons.MailListViewVoiceMailItem:
            return {
                iconName: hasDensityNext ? Voicemail : MailIcons.Memo,
            };
        case PropertyIcons.MailListViewVoiceMailReplied:
            return {
                iconName: MailIcons.VoicemailReply,
            };
        case PropertyIcons.MailListViewVoiceMailForwarded:
            return {
                iconName: MailIcons.VoicemailForward,
            };
        case PropertyIcons.MailListViewVoiceMailIRM:
            return {
                iconName: MailIcons.VoicemailIRM,
            };
        case PropertyIcons.MailListViewFaxItem:
            return {
                iconName: MailIcons.Fax,
            };
        case PropertyIcons.MailListViewAppointmentItem:
            return {
                iconName: hasDensityNext ? CalendarEmpty : ControlIcons.Event,
            };
        case PropertyIcons.MailListViewAppointmentAccepted:
            return {
                iconName: hasDensityNext ? CalendarCheckmark : ControlIcons.EventAccepted,
            };
        case PropertyIcons.MailListViewAppointmentDeclined:
            return {
                iconName: hasDensityNext ? CalendarCancel : ControlIcons.EventDeclined,
            };
        case PropertyIcons.MailListViewAppointmentTentative:
            return {
                iconName: hasDensityNext ? CalendarQuestionMark : ControlIcons.EventTentative,
            };
        case PropertyIcons.MailListViewAppointmentCanceled:
            return {
                iconName: hasDensityNext ? CalendarCancel : ControlIcons.RemoveEvent,
            };
        case PropertyIcons.MailListViewContactItem:
            return {
                iconName: ControlIcons.ContactCard,
            };
        case PropertyIcons.MailListViewTaskItem:
            return {
                iconName: hasDensityNext ? CheckboxChecked : ControlIcons.CheckboxComposite,
            };
        case PropertyIcons.MailListViewTaskReocurItem:
            return {
                iconName: hasDensityNext ? CalendarSync : MailIcons.RecurringTask,
            };
        case PropertyIcons.MailListViewJournalItem:
            return {
                iconName: hasDensityNext ? Notepad : MailIcons.DietPlanNotebook,
            };
        case PropertyIcons.MailListViewPostItem:
            return {
                iconName: ControlIcons.NotePinned,
            };
        case PropertyIcons.MailListViewNoteItem:
            return {
                iconName: hasDensityNext ? Note : ControlIcons.QuickNote,
            };
        case PropertyIcons.MailListViewDelivery:
            // Bug 1752 - culture specific
            return {
                iconName: hasDensityNext ? ArrowCircleRight : MailIcons.ReceiptForward,
            };
        case PropertyIcons.MailListViewNonDelivery:
            // Bug 1752 - culture specific
            return {
                iconName: MailIcons.ReceiptReply,
            };
        case PropertyIcons.MailListViewApprovalRequest:
            // add sprite response_request.png
            return {
                iconName: MailIcons.ReceiptReply,
            };
        case PropertyIcons.MailListViewResponseApprove:
            // add sprite response_approve.png
            return {
                iconName: MailIcons.ReceiptReply,
            };
        case PropertyIcons.MailListViewResponseReject:
            // add sprite response_reject.png
            return {
                iconName: MailIcons.ReceiptReply,
            };
        case PropertyIcons.MailListViewOutOfOffice:
            // Bug 1752 - culture specific
            return {
                iconName: hasDensityNext ? DoorArrowLeft : MailIcons.OutOfOffice,
            };
        case PropertyIcons.MailListViewReadReport:
            return {
                iconName: hasDensityNext ? CheckmarkCircle : MailIcons.ReceiptCheck,
            };
        case PropertyIcons.MailListViewReminderMessage:
            return {
                iconName: ControlIcons.Ringer,
            };
        case PropertyIcons.Link:
            return {
                iconName: hasDensityNext ? Link : ControlIcons.Link,
            };
        default:
            throw new Error('No CSS class icon for the given property icon');
    }
}
