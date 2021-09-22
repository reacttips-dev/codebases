import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { PrivateDistributionListMember } from 'owa-persona-models';
import type {
    SubstrateSearchTextSuggestionAttributes,
    SubstrateSearchSuggestionAttributes,
} from './SubstrateSearchSuggestionsResponse';

export enum SuggestionKind {
    Keywords,
    People,
    PrivateDistributionList,
    File,
    Category,
    Message,
    Event,
    TrySuggestion,
    Setting,
}

export type SuggestionSource =
    | 'none' // Used for PeopleSuggestions objects that are created for certain non-pure search scenarios, such as persona fallback search
    | 'gal' // GAL are the people suggestions that are not part of the recipient cache but are present in user's global contact directory
    | 'localCache' // These are the suggestions present in the user's recipient cache for people kind
    | 'qf' // These are the suggestions received from QF source
    | 'peopleAnswer'; // Used for suggestion created from 3S people answer

interface SuggestionBase {
    ReferenceId: string;
    BestMatchPosition?: number; // Value of -1 means that suggestion is not a "Best Match" suggestion
}

export interface KeywordSuggestion extends SuggestionBase {
    kind: SuggestionKind.Keywords;
    DisplayText: string;
    QueryText: string;
    Attributes: SubstrateSearchTextSuggestionAttributes;
}

export interface CategorySearchSuggestion extends SuggestionBase {
    kind: SuggestionKind.Category;
    Name: string;
}

interface PeopleSuggestionBase extends SuggestionBase {
    Attributes: SubstrateSearchSuggestionAttributes;
    DisplayName: string;
    HighlightedDisplayName: string;
    Source: SuggestionSource;
    QueryText?: string;
    CustomQueryText?: {
        FromKql?: string;
        ToKql?: string;
        CCKql?: string;
    };
}

export interface PeopleSuggestion extends PeopleSuggestionBase {
    kind: SuggestionKind.People;
    EmailAddresses: string[];
    MailboxType?: string;
    EmailAddressDisplayText?: string;
    PeopleFavorite?: boolean;
    ImAddress?: string;
}

export interface PrivateDistributionListSuggestion extends PeopleSuggestionBase {
    kind: SuggestionKind.PrivateDistributionList;
    PdlId: string;
    OwsPersonaId: string;
    Members: PrivateDistributionListMember[];
}

export interface MessageSuggestion extends SuggestionBase {
    kind: SuggestionKind.Message;
    Subject: string;
    DisplayName: string;
    ItemId: ItemId;
    ConversationId: ItemId;
    DateTimeReceived: string;
    HasAttachments: boolean;
}

export enum FileSuggestionType {
    ODSPFile = 'ODSP file',
    CloudyAttachment = 'Cloudy attachment',
    ClassicAttachment = 'Classic attachment',
    LinkAttachment = 'Link attachment',
    Unknown = 'Unknown',
}

export interface FileSuggestion extends SuggestionBase {
    kind: SuggestionKind.File;
    FileName: string;
    FileExtension: string;
    FileUrl: string;
    FileType: string;
    FileSuggestionType: FileSuggestionType;
    HighlightedDisplayText: string;

    DateTimeCreated?: string;
    DateTimeLastAccessed?: string;
    DateTimeReceived?: string;

    AttachmentType?: AttachmentType;
    AttachmentId?: string;

    Sender?: string;
    ItemId?: string;
    ConversationId?: string;
    Subject?: string;

    FileAuthor?: string;
    WebUrl?: string;
    LayoutHint?: 'Attachment' | 'MruFile' | 'ModernFile';

    ImmersiveViewSupported?: FileSuggestionImmersiveViewSupported;
}

export enum FileSuggestionImmersiveViewSupported {
    Unknown,
    Checking,
    NotSupported,
    Supported,
}

export interface EventSuggestion extends SuggestionBase {
    kind: SuggestionKind.Event;
    Subject: string;
    Text: string;
    Start: string;
    End: string;
    EventId: string;
    Location: string;
    OrganizerName: string;
    OrganizerAddress: string;
    OnlineMeetingUrl: string;
    SkypeTeamsMeetingUrl: string;
    IsAllDay: boolean;
    IsCancelled: boolean;
}

export interface TrySearchSuggestion extends SuggestionBase {
    kind: SuggestionKind.TrySuggestion;
    QueryText: string;
    SuggestionId: string;
}

/**
 * Suggestions which are shown in a rich pill form in the search box
 */
export type PillSuggestion =
    | PeopleSuggestion
    | PrivateDistributionListSuggestion
    | CategorySearchSuggestion
    | FileSuggestion;

export type Suggestion =
    | KeywordSuggestion
    | PeopleSuggestion
    | PrivateDistributionListSuggestion
    | MessageSuggestion
    | FileSuggestion
    | CategorySearchSuggestion
    | EventSuggestion
    | TrySearchSuggestion;

interface SuggestionSet {
    Suggestions: Suggestion[];
    IsComplete: boolean;
    TraceId?: string;
    RequestStart?: Date;
}

export default SuggestionSet;
