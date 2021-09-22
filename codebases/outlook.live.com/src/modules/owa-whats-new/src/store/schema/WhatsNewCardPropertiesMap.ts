import { WhatsNewCardIdentity } from './WhatsNewCardIdentity';
import AddCloudCacheAccountCard from '../../components/cards/AddCloudCacheAccountCard';
import AddFlairWithExpressions from '../../components/cards/AddFlairWithExpressions';
import AddPersonalCalendarCard from '../../components/cards/AddPersonalCalendarCard';
import BoldCalendarColorsCard from '../../components/cards/BoldCalendarColorsCard';
import CalendarBoardCard from '../../components/cards/CalendarBoardCard';
import CivicEngagementCard from '../../components/cards/CivicEngagementCard';
import Covid19TrackerCard from '../../components/cards/Covid19TrackerCard';
import CreateNotesFromMessageCard from '../../components/cards/CreateNotesFromMessageCard';
import DarkModeCard from '../../components/cards/DarkModeCard';
import FilesHubCard from '../../components/cards/FilesHubCard';
import GroupsHubPendingMembershipCard from '../../components/cards/GroupsHubPendingMembershipCard';
import GroupsHubRestoreCard from '../../components/cards/GroupsHubRestoreCard';
import InlineTranslationCard from '../../components/cards/InlineTranslationCard';
import NotesFeedCard from '../../components/cards/NotesFeedCard';
import OnlineMeetingsCard from '../../components/cards/OnlineMeetingsCard';
import OutlookSpacesCard from '../../components/cards/OutlookSpacesCard';
import PasteLinksCard from '../../components/cards/PasteLinksCard';
import PauseInboxCard from '../../components/cards/PauseInboxCard';
import PersonalBookingsCard from '../../components/cards/PersonalBookingsCard';
import { proofingBusinessCard, proofingConsumerCard } from '../../components/cards/ProofingCards';
import RevocationCard from '../../components/cards/RevocationCard';
import SamsungNotesCard from '../../components/cards/SamsungNotesCard';
import ScheduleAtGlanceCard from '../../components/cards/ScheduleAtGlanceCard';
import SchoolCalendarsCard from '../../components/cards/SchoolCalendarsCard';
import ShortenEventsDurationCard from '../../components/cards/ShortenEventsDurationCard';
import SmartSearchCard from '../../components/cards/SmartSearchCard';
import SonoraCard from '../../components/cards/SonoraCard';
import SpeedyMeetingsCard from '../../components/cards/SpeedyMeetingsCard';
import StickyNotesCard from '../../components/cards/StickyNotesCard';
import TeamSnapCard from '../../components/cards/TeamSnapCard';
import TimePanelCard from '../../components/cards/TimePanelCard';
import VipNotificationsCard from '../../components/cards/VipNotificationsCard';
import CommandBarCustomizationCard from '../../components/cards/CommandBarCustomizationCard';
import {
    webPushRemindersCard,
    webPushRemindersWithTimersCard,
} from '../../components/cards/WebPushRemindersCard';
import CollabSpaceCard from '../../components/cards/CollabSpaceCard';

// Cards will be ordered by feature type and creation time. Cards for Premium feature will always
// show on the top, and then by creation time in descending order.
export const WhatsNewCardPropertiesMap = {
    [WhatsNewCardIdentity.AddCloudCacheAccount]: AddCloudCacheAccountCard,
    [WhatsNewCardIdentity.AddFlairWithExpressions]: AddFlairWithExpressions,
    [WhatsNewCardIdentity.DarkMode]: DarkModeCard,
    [WhatsNewCardIdentity.SmartSearch]: SmartSearchCard,
    [WhatsNewCardIdentity.FilesHub]: FilesHubCard,
    [WhatsNewCardIdentity.ScheduleAtGlance]: ScheduleAtGlanceCard,
    [WhatsNewCardIdentity.BoldCalendarColors]: BoldCalendarColorsCard,
    [WhatsNewCardIdentity.GroupsHubPendingMembership]: GroupsHubPendingMembershipCard,
    [WhatsNewCardIdentity.GroupsHubRestore]: GroupsHubRestoreCard,
    [WhatsNewCardIdentity.TimePanel]: TimePanelCard,
    [WhatsNewCardIdentity.PauseInbox]: PauseInboxCard,
    [WhatsNewCardIdentity.PasteLinks]: PasteLinksCard,
    [WhatsNewCardIdentity.PersonalBookingPage]: PersonalBookingsCard,
    [WhatsNewCardIdentity.Revocation]: RevocationCard,
    [WhatsNewCardIdentity.StickyNotes]: StickyNotesCard,
    [WhatsNewCardIdentity.TeamSnap]: TeamSnapCard,
    [WhatsNewCardIdentity.SchoolCalendars]: SchoolCalendarsCard,
    [WhatsNewCardIdentity.InlineTranslation]: InlineTranslationCard,
    [WhatsNewCardIdentity.AddPersonalCalendar]: AddPersonalCalendarCard,
    [WhatsNewCardIdentity.ProofingConsumerFree]: proofingConsumerCard,
    [WhatsNewCardIdentity.ProofingBusiness]: proofingBusinessCard,
    [WhatsNewCardIdentity.OutlookSpaces]: OutlookSpacesCard,
    [WhatsNewCardIdentity.COVID19]: Covid19TrackerCard,
    [WhatsNewCardIdentity.SpeedyMeetings]: SpeedyMeetingsCard,
    [WhatsNewCardIdentity.OnlineMeetings]: OnlineMeetingsCard,
    [WhatsNewCardIdentity.WebPushReminders]: webPushRemindersCard,
    [WhatsNewCardIdentity.WebPushRemindersWithTimers]: webPushRemindersWithTimersCard,
    [WhatsNewCardIdentity.ShortenEventsDuration]: ShortenEventsDurationCard,
    [WhatsNewCardIdentity.VipNotifications]: VipNotificationsCard,
    [WhatsNewCardIdentity.OneNoteFeedPanel]: NotesFeedCard,
    [WhatsNewCardIdentity.SamsungNotes]: SamsungNotesCard,
    [WhatsNewCardIdentity.CivicEngagement]: CivicEngagementCard,
    [WhatsNewCardIdentity.Sonora]: SonoraCard,
    [WhatsNewCardIdentity.CalendarBoard]: CalendarBoardCard,
    [WhatsNewCardIdentity.CreateNotesFromMessage]: CreateNotesFromMessageCard,
    [WhatsNewCardIdentity.CollabSpace]: CollabSpaceCard,
    [WhatsNewCardIdentity.CommandBarCustomization]: CommandBarCustomizationCard,
};
