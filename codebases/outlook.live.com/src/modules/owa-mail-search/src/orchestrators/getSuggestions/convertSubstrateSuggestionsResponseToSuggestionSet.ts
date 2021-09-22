import attachmentType from 'owa-service/lib/factory/attachmentType';
import referenceAttachment from 'owa-service/lib/factory/referenceAttachment';
import { FileProviders } from 'owa-attachment-constants/lib/fileProviders';
import {
    FILE_ATTACHMENT_TYPE,
    REFERENCE_ATTACHMENT_TYPE,
} from 'owa-attachment-constants/lib/attachmentTypes';
import { logUsage } from 'owa-analytics';

import {
    SubstrateSearchSuggestionsResponse,
    SuggestionSet,
    Suggestion,
    SubstrateSearchSuggestionsResponseTextSuggestion,
    KeywordSuggestion,
    SuggestionKind,
    SubstrateSearchSuggestionsResponsePeopleSuggestion,
    PeopleSuggestion,
    SubstrateSearchSuggestionsResponseMessageSuggestion,
    MessageSuggestion,
    SubstrateSearchSuggestionsResponseAttachmentFileSuggestion,
    SubstrateSearchSuggestionsResponseFileSuggestion,
    FileSuggestion,
    SubstrateSearchSuggestionsResponseEventSuggestion,
    EventSuggestion,
    SubstrateSearchSuggestionsResponseModernFileSuggestionsGroup,
    FileSuggestionType,
} from 'owa-search-service';
import { FileSuggestionImmersiveViewSupported } from 'owa-search-service/lib/data/schema/SuggestionSet';
import loc, { format } from 'owa-localize';
import getIsSearchingWithinFromFolder from '../../selectors/getIsSearchingWithinFromFolder';
import getSelectedSearchScope from '../../utils/getSelectedSearchScope';
import { MAX_SERVER_SUGGESTION_OF_KIND, HIGHLIGHT_REGEX } from '../../searchConstants';
import {
    emailAddressWithToHint_1,
    emailAddressWithFromHint_1,
} from './convertSubstrateSuggestionsResponseToSuggestionSet.locstring.json';
import { getUrlWithAddedQueryParameters } from 'owa-url';
import { isModernFilesEnabled } from 'owa-search';
import { isFeatureEnabled } from 'owa-feature-flags';
import { convertRestIdToEwsId } from 'owa-identifiers';

/**
 * Parses 3S suggestions response and converts it to a SuggestionSet.
 */
export default function convertSubstrateSuggestionsResponseToSuggestionSet(
    response: SubstrateSearchSuggestionsResponse,
    queryString?: string
): SuggestionSet {
    if (!response || !response.Groups) {
        throw new Error('Substrate suggestions response "Groups" should not be null.');
    }

    const traceId = response.Instrumentation.TraceId;

    // Array of parsed suggestions to return.
    const suggestions: Suggestion[] = [];

    // Counts of how many suggestions of each type are in array to return.
    let keywordSuggestionCount = 0;
    let peopleSuggestionCount = 0;

    // Iterate over groups of suggestions and convert to known suggestion types.
    for (const group of response.Groups) {
        switch (group.Type) {
            case 'Text':
                {
                    // Determine how many more keyword suggestions we should fetch.
                    const maxSuggestionsOfKind =
                        MAX_SERVER_SUGGESTION_OF_KIND - keywordSuggestionCount;

                    /**
                     * Get the first "maxSuggestionsOfKind" remaining keyword
                     * suggestions (or none if we are over max).
                     */
                    const convertedKeywords = group.Suggestions.map(
                        convertToKeywordSuggestion
                    ).slice(0, maxSuggestionsOfKind > 0 ? maxSuggestionsOfKind : 0);

                    // Add to suggestions array to return.
                    suggestions.push(...convertedKeywords);

                    // Increment count of fetched keyword suggestions.
                    keywordSuggestionCount += convertedKeywords.length;
                }
                break;
            case 'People':
                {
                    if (!validatePeopleSuggestions(group.Suggestions)) {
                        continue;
                    }

                    let localizedEmailAddressWithHintText;

                    const selectedSearchScope = getSelectedSearchScope();
                    const shouldUseFromHintText = getIsSearchingWithinFromFolder(
                        selectedSearchScope
                    );
                    localizedEmailAddressWithHintText = shouldUseFromHintText
                        ? loc(emailAddressWithFromHint_1)
                        : loc(emailAddressWithToHint_1);

                    // Determine how many more people suggestions we should fetch.
                    const maxSuggestionsOfKind =
                        MAX_SERVER_SUGGESTION_OF_KIND - peopleSuggestionCount;

                    /**
                     * Get the first "maxSuggestionsOfKind" remaining people
                     * suggestions (or none if we are over max).
                     */
                    const convertedPeople = group.Suggestions.map(suggestion =>
                        convertToPeopleSuggestion(suggestion, localizedEmailAddressWithHintText)
                    ).slice(0, maxSuggestionsOfKind > 0 ? maxSuggestionsOfKind : 0);

                    // Add to suggestions array to return.
                    suggestions.push(...convertedPeople);

                    // Increment count of fetched people suggestions.
                    peopleSuggestionCount += convertedPeople.length;
                }
                break;
            case 'Message':
                if (!validateMessageSuggestions(group.Suggestions)) {
                    continue;
                }

                const convertedMessageSuggestions = group.Suggestions.map(
                    convertToMessageSuggestion
                );

                suggestions.push(...convertedMessageSuggestions);
                break;
            case 'Attachment':
                const convertedFileSuggestions = group.Suggestions.map(suggestion =>
                    convertToFileSuggestion(suggestion, traceId)
                );

                suggestions.push(...convertedFileSuggestions);
                break;
            case 'Event':
                const convertedEventSuggestions = group.Suggestions.map(convertToEventSuggestion);
                suggestions.push(...convertedEventSuggestions);
                break;
            case 'File':
                (group as SubstrateSearchSuggestionsResponseModernFileSuggestionsGroup).Suggestions.map(
                    suggestion => {
                        const fileSuggestion =
                            suggestion.FileType === 'File'
                                ? (suggestion as SubstrateSearchSuggestionsResponseFileSuggestion)
                                : (suggestion as SubstrateSearchSuggestionsResponseAttachmentFileSuggestion);
                        const convertedFileSuggestion: FileSuggestion = convertToFileSuggestion(
                            fileSuggestion,
                            traceId,
                            queryString.length === 0
                        );
                        if (convertedFileSuggestion.FileSuggestionType !== 'Unknown') {
                            suggestions.push(convertedFileSuggestion);
                        }
                    }
                );
                break;
        }
    }

    // Populate BestMatchPosition for each suggestion.
    addBestMatchPosition(response, suggestions);

    return {
        Suggestions: suggestions,
        IsComplete: true,
        TraceId: traceId,
    };
}

const addBestMatchPosition = (
    response: SubstrateSearchSuggestionsResponse,
    suggestions: Suggestion[]
) => {
    /**
     * If BestMatchSuggestions isn't part of the response (or feature isn't enabled),
     * then assign -1 (which means the suggestion is not a "Best Match" suggestion)
     * to all suggestions and return.
     */
    if (!response.LayoutHints?.BestMatchSuggestions) {
        suggestions.map(suggestion => (suggestion.BestMatchPosition = -1));
        return;
    }

    // Get "Best Match" suggestion reference IDs from LayoutHints property.
    const bestMatchReferenceIds = response.LayoutHints.BestMatchSuggestions.map(
        bestMatchSuggestion => {
            return bestMatchSuggestion.ReferenceId;
        }
    );

    /**
     * Assign BestMatchPosition for each suggestion based on the order of the
     * reference IDs from the LayoutHints property of the response.
     */
    for (const suggestion of suggestions) {
        suggestion.BestMatchPosition = bestMatchReferenceIds.indexOf(suggestion.ReferenceId);
    }
};

const validateMessageSuggestions = (
    suggestions: SubstrateSearchSuggestionsResponseMessageSuggestion[]
): boolean => {
    for (const suggestion of suggestions) {
        if (suggestion.Subject === undefined) {
            logUsage('SearchError_InvalidMessageSuggestion');
            return false;
        }
    }

    return true;
};

const validatePeopleSuggestions = (
    suggestions: SubstrateSearchSuggestionsResponsePeopleSuggestion[]
): boolean => {
    for (const suggestion of suggestions) {
        if (suggestion.Text === undefined || suggestion.EmailAddresses === undefined) {
            logUsage('SearchError_InvalidPeopleSuggestion');
            return false;
        }
    }

    return true;
};

function convertToKeywordSuggestion(
    suggestion: SubstrateSearchSuggestionsResponseTextSuggestion
): KeywordSuggestion {
    return {
        kind: SuggestionKind.Keywords,
        DisplayText: suggestion.Text,
        QueryText: suggestion.QueryText,
        ReferenceId: suggestion.ReferenceId,
        Attributes: suggestion.Attributes,
    };
}

function convertToPeopleSuggestion(
    suggestion: SubstrateSearchSuggestionsResponsePeopleSuggestion,
    localizedEmailAddressWithHintText?: string
): PeopleSuggestion {
    // Remove highlighting tokens from email addresses
    const emailAddresses = suggestion.EmailAddresses.map(x => x.replace(HIGHLIGHT_REGEX, ''));

    return {
        kind: SuggestionKind.People,
        DisplayName: suggestion.DisplayName || emailAddresses[0],
        HighlightedDisplayName: suggestion.Text,
        EmailAddresses: emailAddresses,
        ReferenceId: suggestion.ReferenceId,
        Attributes: suggestion.Attributes,
        Source: 'qf',
        QueryText: suggestion.QueryText,
        EmailAddressDisplayText:
            localizedEmailAddressWithHintText &&
            format(localizedEmailAddressWithHintText, emailAddresses[0]),
        ImAddress: suggestion.ImAddress,
    };
}

function convertToMessageSuggestion(
    suggestion: SubstrateSearchSuggestionsResponseMessageSuggestion
): MessageSuggestion {
    return {
        kind: SuggestionKind.Message,
        Subject: suggestion.Subject,
        DisplayName: suggestion.From?.EmailAddress ? suggestion.From.EmailAddress.Name : '',
        ReferenceId: suggestion.ReferenceId,
        ItemId: isFeatureEnabled('fwk-immutable-ids')
            ? suggestion.ImmutableId.Id
                ? { Id: convertRestIdToEwsId(suggestion.ImmutableId.Id) }
                : suggestion.ItemId
            : suggestion.ItemId,
        ConversationId: suggestion.ConversationId,
        HasAttachments: suggestion.HasAttachments,
        DateTimeReceived: suggestion.DateTimeReceived,
    };
}

function convertToFileSuggestion(
    suggestion:
        | SubstrateSearchSuggestionsResponseAttachmentFileSuggestion
        | SubstrateSearchSuggestionsResponseFileSuggestion,
    traceId: string,
    isZeroQuery?: boolean
): FileSuggestion {
    if (suggestion.FileType === 'File') {
        const FileSuggestion: FileSuggestion = {
            kind: SuggestionKind.File,
            AttachmentType: getAttachmentTypeForFileSuggestion(suggestion),
            AttachmentId: null,
            DateTimeCreated: suggestion.DateCreated + '.000Z',
            DateTimeLastAccessed: suggestion.DateAccessed,
            FileName: suggestion.FileName,
            FileExtension: suggestion.FileExtension,
            FileUrl: suggestion.AccessUrl,
            WebUrl: getUrlWithAddedQueryParameters(suggestion.AccessUrl, { web: '1' }), // Appending ?web=1 (or &web=1) directs the file's accessUrl to open in Office Online
            ReferenceId: suggestion.ReferenceId,
            FileAuthor: suggestion.Author,
            FileType: suggestion.FileType,
            FileSuggestionType: FileSuggestionType.ODSPFile,
            HighlightedDisplayText: suggestion.Text,
            LayoutHint: getFileSuggestionLayoutHint(suggestion, isZeroQuery),
            ImmersiveViewSupported: FileSuggestionImmersiveViewSupported.Unknown,
        };
        return FileSuggestion;
    } else if (suggestion.FileType === 'Attachment' || suggestion.FileType === 'Link') {
        const sender = suggestion.From?.EmailAddress?.Name || '';
        const fileSuggestion: FileSuggestion = {
            kind: SuggestionKind.File,
            AttachmentType: getAttachmentTypeForFileSuggestion(suggestion),
            AttachmentId: suggestion.AttachmentId?.Id,
            ConversationId: suggestion.ConversationId.Id,
            DateTimeCreated: suggestion.DateCreated + '.000Z', // DateTime is in UTC, but the timezone is not specified,
            DateTimeLastAccessed: suggestion.DateAccessed + '.000Z',
            DateTimeReceived: suggestion.DateCreated + '.000Z',
            FileUrl: suggestion.AccessUrl,
            FileName: suggestion.FileName,
            FileExtension: suggestion.FileExtension,
            FileType: suggestion.FileType,
            FileSuggestionType: getFileSuggestionTypeForAttachment(suggestion, traceId),
            HighlightedDisplayText: suggestion.Text,
            ItemId: suggestion.ItemId.Id,
            ReferenceId: suggestion.ReferenceId,
            Subject: suggestion.Subject,
            Sender: sender,
            LayoutHint: getFileSuggestionLayoutHint(suggestion, isZeroQuery),
            ImmersiveViewSupported: FileSuggestionImmersiveViewSupported.Unknown,
        };

        return fileSuggestion;
    }

    return null;
}

function convertToEventSuggestion(
    suggestion: SubstrateSearchSuggestionsResponseEventSuggestion
): EventSuggestion {
    const eventSuggestion: EventSuggestion = {
        kind: SuggestionKind.Event,
        Subject: suggestion.Subject,
        Text: suggestion.Text,
        EventId: suggestion.EventId.Id,
        ReferenceId: suggestion.ReferenceId,
        Start: suggestion.Start,
        End: suggestion.End,
        Location: suggestion.Location,
        OrganizerName: suggestion.OrganizerName,
        OrganizerAddress: suggestion.OrganizerAddress,
        OnlineMeetingUrl: suggestion.OnlineMeetingUrl,
        SkypeTeamsMeetingUrl: suggestion.SkypeTeamsMeetingUrl,
        IsAllDay: suggestion.IsAllDay,
        IsCancelled: suggestion.IsCancelled,
    };
    return eventSuggestion;
}

function getFileSuggestionLayoutHint(
    suggestion:
        | SubstrateSearchSuggestionsResponseAttachmentFileSuggestion
        | SubstrateSearchSuggestionsResponseFileSuggestion,
    isZeroQuery: boolean
) {
    if (suggestion.FileType === 'Attachment' || suggestion.FileType === 'Link') {
        return isModernFilesEnabled() ? 'ModernFile' : 'Attachment';
    } else if (suggestion.FileType === 'File') {
        return isZeroQuery ? 'MruFile' : 'ModernFile';
    }

    return null;
}

function getFileSuggestionTypeForAttachment(
    suggestion: SubstrateSearchSuggestionsResponseAttachmentFileSuggestion,
    traceId: string
): FileSuggestionType {
    if (suggestion.FileType === 'Attachment' && suggestion.FileSourceType === 'ClassicAttachment') {
        return FileSuggestionType.ClassicAttachment;
    } else if (
        suggestion.FileType === 'Attachment' &&
        (suggestion.FileSourceType === 'OneDriveForBusiness' ||
            suggestion.FileSourceType === 'SharepointOnline')
    ) {
        return FileSuggestionType.CloudyAttachment;
    } else if (suggestion.FileType === 'Link') {
        return FileSuggestionType.LinkAttachment;
    } else {
        // Log unhandled cases so we can catch and handle them in the future
        // In the meantime, return unknown so the file suggestion isn't shown if we don't know its file/attachment type
        // https://dev.azure.com/outlookweb/Outlook%20Web/_workitems/edit/113084
        logUsage('Search_UnknownFileSuggestionType', {
            fileType: suggestion.FileType,
            fileSourceType: suggestion.FileSourceType,
            suggestionScenario: 'owa-mail-search',
            traceId: traceId,
        });
        return FileSuggestionType.Unknown;
    }
}

function getAttachmentTypeForFileSuggestion(
    suggestion:
        | SubstrateSearchSuggestionsResponseAttachmentFileSuggestion
        | SubstrateSearchSuggestionsResponseFileSuggestion
) {
    const attachmentId =
        suggestion.FileType === 'Attachment' || suggestion.FileType === 'Link'
            ? {
                  Id: suggestion.AttachmentId?.Id,
              }
            : null;

    if (suggestion.FileSourceType === 'ClassicAttachment') {
        return attachmentType({
            __type: FILE_ATTACHMENT_TYPE,
            Name: suggestion.FileName,
            IsInline: false,
            AttachmentId: attachmentId,
        });
    }

    return referenceAttachment({
        __type: REFERENCE_ATTACHMENT_TYPE,
        Name: suggestion.FileName,
        AttachmentIsFolder: false,
        IsInline: false,
        ProviderType: FileProviders.ONE_DRIVE_PRO, // 3S only supports OneDrivePro for now
        AttachLongPathName: suggestion.AccessUrl,
        AttachmentId: attachmentId,
    });
}
