import type { ClientFolderId, ClientItemId } from 'owa-client-ids';
import type { DisplayDate } from 'owa-datetime';
import type EffectiveRightsType from 'owa-service/lib/contract//EffectiveRightsType';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';
import type BusyType from 'owa-service/lib/contract/BusyType';
import type CalendarItemExperienceType from 'owa-service/lib/contract/CalendarItemExperienceType';
import type CalendarItemTypeType from 'owa-service/lib/contract/CalendarItemTypeType';
import type DocLink from 'owa-service/lib/contract/DocLink';
import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import type InboxReminderType from 'owa-service/lib/contract/InboxReminderType';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import type SensitivityType from 'owa-service/lib/contract/SensitivityType';
import type { RoomRequestStatus } from 'owa-graph-schema';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import type SkypeTeamsPropertiesData from './SkypeTeamsPropertiesData';
import type { AppendOnSend } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

// TODO VSO 113957: Replace CalendarEvent client type with GraphQL CalendarEvent type
// Remove this code once we are consuming  GraphQL CalendarEvent

export type CalendarItemTypeTypeEx = CalendarItemTypeType | 'ThisAndFollowingInstancesMaster';

/**
 * Calendar Item definition: Add properties here from the CalendarItem and Item contracts as needed.
 * Mobx has a problem with optionals, so this serves as our wrapper around the calendar item contract type
 * and will be what we use in forms such that the contract type is only used in the service layer.
 */
interface CalendarEvent {
    // Properties from Item contract
    ItemId: ClientItemId;
    ParentFolderId: ClientFolderId;
    Subject: string;
    ReminderIsSet: boolean;
    ReminderMinutesBeforeStart: number;
    LastModifiedTime: DisplayDate;
    InstanceKey: string;
    Preview: string;
    EffectiveRights: EffectiveRightsType;
    HasAttachments: boolean;
    HasBlockedImages: boolean;
    Attachments: AttachmentType[];
    Sensitivity: SensitivityType;
    Body: BodyContentType;
    EntityNamesMap: number;
    TailoredXpEntities: string;
    IsDraft: boolean;
    Categories: string[];
    ConversationId?: ItemId;

    // Properties from CalendarItem contract
    __type: string;
    Start: DisplayDate;
    End: DisplayDate;
    IsAllDayEvent: boolean;
    IsRoomRequested: boolean;
    AutoRoomBookingStatus: RoomRequestStatus;
    FreeBusyType: BusyType;
    IsMeeting: boolean;
    IsCancelled: boolean;
    IsRecurring: boolean;
    IsResponseRequested: boolean;
    CalendarItemType: CalendarItemTypeTypeEx;
    ResponseType: ResponseTypeType;
    Organizer: SingleRecipientType;
    RequiredAttendees: AttendeeType[];
    OptionalAttendees: AttendeeType[];
    Resources: AttendeeType[];
    AppointmentReplyTime: DisplayDate;
    Recurrence: RecurrenceType;
    Location: EnhancedLocation;
    IntendedFreeBusyStatus: BusyType;
    IsOrganizer: boolean;
    AppointmentReplyName: string;
    IsSeriesCancelled: boolean;
    CharmId: number;
    Locations: EnhancedLocation[];
    ClientSeriesId: string;
    UID: string;
    ExperienceType: CalendarItemExperienceType;
    DoNotForwardMeeting: boolean;
    IsOnlineMeeting: boolean;
    JoinOnlineMeetingUrl: string;
    InboxReminders: InboxReminderType[];
    MeetingRequestWasSent: boolean;
    ExtractionSourceId: ItemId;
    StartTimeZoneId: string;
    EndTimeZoneId: string;
    OnlineMeetingProvider: string;
    OnlineMeetingJoinUrl: string;
    OnlineMeetingConferenceId: string;
    OnlineMeetingTollNumber: string;
    OnlineMeetingTollFreeNumbers: string[];
    SeriesMasterItemId: ClientItemId;
    ExtractionSourceInternetMessageId: string;
    HideAttendees: boolean;
    SeriesId?: string;

    // Birthday Event Properties
    PersonId: ItemId;
    InReplyTo: string;

    // Free/Busy View Event Properties
    IsFreeBusyOnly?: boolean;

    SkypeTeamsProperties: SkypeTeamsPropertiesData;

    DocLinks: DocLink[];

    // Additional(Extended) Properties
    // NOTE: in order to fetch extended properties from the server the ExtendedPropertiesUri must be added to
    // additionalProperties is `getItemResponseShape`
    AppendOnSend?: AppendOnSend[];

    CollabSpace?: string;

    TravelTimeEventsLinked?: boolean;
    FlexEventsMetadata?: string;

    // These properties are not currently used but will be used in future focus time features
    IsBookedFreeBlocks?: boolean;
    AssociatedTasks?: string[];
}

/* Creates empty instance of CalendarEvent with undefined properties
 * so that mobX doesn't freak out and can observe on those properties when they get assigned
 */
export function createEmptyCalendarEvent() {
    let emptyCalendarEvent: CalendarEvent = {
        __type: undefined,
        ItemId: undefined,
        ParentFolderId: undefined,
        Subject: undefined,
        ReminderIsSet: undefined,
        ReminderMinutesBeforeStart: undefined,
        LastModifiedTime: undefined,
        InstanceKey: undefined,
        Preview: undefined,
        EffectiveRights: undefined,
        HasAttachments: undefined,
        HasBlockedImages: undefined,
        Attachments: undefined,
        Sensitivity: undefined,
        Body: undefined,
        EntityNamesMap: undefined,
        TailoredXpEntities: undefined,
        IsDraft: undefined,
        Categories: undefined,
        Start: undefined,
        End: undefined,
        IsAllDayEvent: undefined,
        IsRoomRequested: undefined,
        AutoRoomBookingStatus: undefined,
        FreeBusyType: undefined,
        IsMeeting: undefined,
        IsCancelled: undefined,
        IsRecurring: undefined,
        IsResponseRequested: undefined,
        CalendarItemType: undefined,
        ResponseType: undefined,
        Organizer: undefined,
        RequiredAttendees: undefined,
        OptionalAttendees: undefined,
        Resources: undefined,
        AppointmentReplyTime: undefined,
        Recurrence: undefined,
        Location: undefined,
        IntendedFreeBusyStatus: undefined,
        IsOrganizer: undefined,
        AppointmentReplyName: undefined,
        IsSeriesCancelled: undefined,
        CharmId: undefined,
        Locations: undefined,
        ClientSeriesId: undefined,
        UID: undefined,
        SeriesId: undefined,
        ExperienceType: undefined,
        DoNotForwardMeeting: undefined,
        IsOnlineMeeting: undefined,
        JoinOnlineMeetingUrl: undefined,
        InboxReminders: undefined,
        MeetingRequestWasSent: undefined,
        ExtractionSourceId: undefined,
        StartTimeZoneId: undefined,
        EndTimeZoneId: undefined,
        OnlineMeetingProvider: undefined,
        OnlineMeetingJoinUrl: undefined,
        OnlineMeetingConferenceId: undefined,
        OnlineMeetingTollNumber: undefined,
        OnlineMeetingTollFreeNumbers: undefined,
        SeriesMasterItemId: undefined,
        ExtractionSourceInternetMessageId: undefined,
        HideAttendees: undefined,
        PersonId: undefined,
        InReplyTo: undefined,
        IsFreeBusyOnly: undefined,
        ConversationId: undefined,
        SkypeTeamsProperties: undefined,
        DocLinks: undefined,
        AppendOnSend: undefined,
        IsBookedFreeBlocks: undefined,
        AssociatedTasks: undefined,
        CollabSpace: undefined,
        TravelTimeEventsLinked: undefined,
        FlexEventsMetadata: undefined,
    };

    return emptyCalendarEvent;
}

export default CalendarEvent;
