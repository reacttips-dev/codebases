import { SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';

export type SupportedFilesHubSuggestionKindType =
    | SuggestionKind.File
    | SuggestionKind.People
    | SuggestionKind.Keywords;

export const SUPPORTED_FILESHUB_SUGGESTION_KIND_LIST = [
    SuggestionKind.File,
    SuggestionKind.People,
    SuggestionKind.Keywords,
];
export const ALL_SUGGESTION_KINDS_LIST = [
    SuggestionKind.File,
    SuggestionKind.People,
    SuggestionKind.Keywords,
    SuggestionKind.Message,
    SuggestionKind.Event,
    SuggestionKind.Category,
    SuggestionKind.TrySuggestion,
    SuggestionKind.Setting,
];
