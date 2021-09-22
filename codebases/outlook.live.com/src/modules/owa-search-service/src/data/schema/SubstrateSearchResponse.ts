import type { Provenance } from './SubstrateSearchShared';
import type IconIndexType from 'owa-service/lib/contract/IconIndexType';
import type ImportanceType from 'owa-service/lib/contract/ImportanceType';
import type SensitivityType from 'owa-service/lib/contract/SensitivityType';
import type { Message } from 'owa-teams-client/lib/store/schema/ServiceSchema';

export interface SubstrateSearchResponseV1 {
    ApiVersion: string;
    EntitySets: EntitySet[];
    Instrumentation: InstrumentationDetails;
    SearchTerms: string[];
    error?: any; // Present when call to 3S fails
}

export interface SubstrateSearchResponseV2 {
    ApiVersion: string;
    EntitySets: EntitySet[];
    Instrumentation: InstrumentationDetails;
    SearchTerms: string[];
    QueryAlterationResponse?: QueryAlterationResponseV2;
    error?: any; // Present when call to 3S fails
}

export type SubstrateSearchResponse = SubstrateSearchResponseV1 | SubstrateSearchResponseV2;

export interface EntitySet {
    QueryAlterationResponse?: QueryAlterationResponse;
    ResultSets: SearchResultSet[];
    Type: EntitySetType;
    EntityType?: EntitySetType;
}

interface AlteredQuery {
    HighlightedString: string;
    DisplayText: string;
    RawString: string;
    ReferenceId: string;
}

interface FlaggedToken {
    Length: number;
    Suggestion: string;
    Offset: number;
}

interface RecourseQuery {
    HighlightedString: string;
    RawString: string;
}

export interface QueryAlterationResponse {
    AlteredQuery: {
        AlteredQuery: AlteredQuery;
        FlaggedTokens: FlaggedToken[];
    };
    QueryAlterationType: QueryAlterationType;
    RecourseQuery: RecourseQuery;
}

export interface QueryAlterationResponseV2 {
    QueryAlteration: {
        AlteredQuery: AlteredQuery;
        FlaggedTokens: FlaggedToken[];
    };
    QueryAlterationType: QueryAlterationType;
    RecourseQuery: RecourseQuery;
}

export type QueryAlterationType =
    | 'Suggestion'
    | 'Modification'
    | 'NoResultModification'
    | 'NoRequeryModification'
    | 'Modification'
    | 'Extension'
    | 'NoResultFolderRefinerModification';

export interface SearchResultSet {
    MoreResultsAvailable: boolean;
    Provenance: Provenance;
    QueryId: QueryId;
    Results: SearchResult[];
    Total: number;
}

export interface QueryId {
    Id: string;
}

export interface SearchResult {
    Id: string;
    Provenance: string;
    ReferenceId: string;
    Source: {};
    InstUrlSuffix: string;
}

export interface InstrumentationDetails {
    TraceId: string;
    InstUrlBase: string;
}

export type EntitySetType =
    | 'Message'
    | 'Messages'
    | 'Conversation'
    | 'Conversations'
    | 'Event'
    | 'Events';

export interface SearchResultItem {
    Categories: string[];
    ConversationId: SearchResultItemId;
    ConversationThreadId: string;
    DateTimeCreated: string;
    DateTimeLastModified: string;
    DateTimeReceived: string;
    DateTimeSent: string;
    DiagnosticsItemContent: string;
    DiagnosticsItemQuery: string;
    DisplayBcc: string;
    DisplayCc: string;
    DisplayTo: string;
    ExtendedProperty: SearchResultExtendedPropertyType[];
    Flag: SearchResultFlagType;
    HasAttachments: boolean;
    Hashtags: string[];
    HasProcessedSharepointLink: boolean;
    IconIndex: IconIndexType;
    Importance: ImportanceType;
    IsDraft: boolean;
    IsFromMe: boolean;
    ItemClass: string;
    ItemId: SearchResultItemId;
    ParentFolderId: SearchResultFolderId;
    Preview: string;
    SearchKey: string;
    Sensitivity: SensitivityType;
    Size: number;
    SortKey: number;
    SortOrderSource: string;
    Subject: string;
}

export interface SearchResultItemId {
    ChangeKey: string;
    EntryId: string;
    Id: string;
    OutlookItemId: string;
}

export interface SearchResultFolderId {
    ChangeKey: string;
    Id: string;
}

export interface SearchResultExtendedPropertyType {
    ExtendedFieldURI: string;
    Value: string;
    Values: string[];
}

export interface SearchResultFlagType {
    CompleteDate: string;
    DueDate: string;
    FlagStatus: SearchResultFlagStatus;
    StartDate: string;
}

export type SearchResultFlagStatus = 'NotFlagged' | 'Complete' | 'Flagged';

export interface SearchResultMessage extends SearchResultItem {
    ConversationIndex: string;
    ConversationTopic: string;
    FolderRefinerId: string;
    From: SearchResultRecipient;
    ImmutableId: string;
    InternetMessageId: string;
    IsRead: boolean;
    MailboxGuids: string[];
    Sender: SearchResultRecipient;
    SenderSMTPAddress: string;
    MentionsPreview: MentionsPreview;
}

export interface SearchResultTeamsMessage extends SearchResultItem {
    ConversationHexId: string;
    ConversationRestId: string;
    ConversationIndex: number[];
    ConversationTopic: string;
    DocumentId?: number;
    MentionsPreview: MentionsPreview;
    ClientConversationId: string;
    ClientThreadId: string;
    AnnouncementTitle: string;
    From: SearchResultRecipient;
    InternetMessageId: string;
    IsRead?: boolean;
    ItemHexId: string;
    ItemRestId: string;
    MailboxGuids: string[];
    NormalizedSubject: string;
    ReceivedOrRenewTime?: string;
    Sender: SearchResultRecipient;
    SideEffects: number;
    WebLink: string;
    OwnerFolderRestId: string;
    ParentFolderDisplayName: string;
}

export interface TeamsMessage extends Message {
    displayTo: string;
}

export interface MentionsPreview {
    IsMentioned: boolean;
}

export interface SearchResultRecipient {
    EmailAddress: SearchResultEmailAddress;
}

export interface SearchResultEmailAddress {
    Address: string;
    EmailAddressIndex: string;
    IsDomainInOrganization: boolean;
    IsExternalSmtpAddress: boolean;
    ItemId: SearchResultItemId;
    MailboxType: string;
    Name: string;
    OriginalDisplayName: string;
    RelevanceScore: number;
    RoutingType: string;
    SipUri: string;
    Submitted: boolean;
}

export interface SearchResultConversation extends SearchResultItem {
    Categories: string[];
    ConversationTopic: string;
    FlagStatus: SearchResultFlagStatus;
    FolderRefinerId: string;
    From: SearchResultRecipient;
    GlobalItemIds: SearchResultItemId[];
    GlobalMessageCount: number;
    GlobalUnreadCount: number;
    HasIrm: boolean;
    ImmutableId: string;
    ItemClasses: string[];
    ItemIds: SearchResultItemId[];
    LastDeliveryOrRenewTime: string;
    LastDeliveryTime: string;
    LastModifiedTime: string;
    MailboxGuids: string[];
    MessageCount: number;
    SenderSMTPAddress: string;
    UniqueRecipients: string[];
    UniqueSenders: string[];
    UnreadCount: number;
}

export interface SearchResultEvent extends SearchResultItem {
    CalendarItemType: SearchResultCalendarItemType;
    Charm: number;
    End: string;
    ImmutableId: string;
    IsAllDayEvent: boolean;
    IsMeeting: boolean;
    IsMeetingPollEvent: boolean;
    IsOrganizer: boolean;
    IsCancelled: boolean;
    MyResponseType: string;
    LegacyFreeBusyStatus: SearchResultBusyType;
    Location: string;
    Organizer: SearchResultRecipient;
    SeriesMasterItemId: SearchResultItemId;
    Start: string;
    UID: string;
}

export enum SearchResultCalendarItemType {
    Single = 0,
    Occurrence = 1,
    Exception = 2,
    RecurringMaster = 3,
}

export enum SearchResultBusyType {
    Free = 0,
    Tentative = 1,
    Busy = 2,
    Oof = 3,
    WorkingElsewhere = 4,
    NoData = 5,
}

export default SubstrateSearchResponse;
